import fs from 'fs-extra';
import path from 'path';
import ora, { type Ora } from 'ora';
import ts from 'typescript';
import { BuildType, WorkspaceConfig, WorkspaceItem } from '../types.js';
import { tryReadWorkspaceConfig, writeWorkspaceConfig, getWorkspaceConfigFileName, getWorkspaceWebpackConfigFileName } from './workspace.service.js';
import { getPublishedPackageVersion, WORKSPACE_BUILD_DEV_DEPENDENCIES } from './generator.service.js';
import { migrateWebpackConfigFiles } from './webpack-migration.service.js';
import { ensureMinimumDependencies, formatDependencyUpdates } from '../utils/dependencies.js';

type MigrationPath = 'already-workspace' | 'pre-v2' | 'standalone-to-workspace' | 'unknown';

interface DetectedItem
{
    name: string;
    type: BuildType;
    entry: string;
    icon?: string;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function migrateProject(): void
{
    const dir = process.cwd();
    const migrationPath = detectMigrationPath(dir);

    if (migrationPath === 'already-workspace')
    {
        ora().succeed('Already using workspace mode. No migration needed.');
        return;
    }

    if (migrationPath === 'pre-v2')
    {
        migratePreV2(dir);
        return;
    }

    if (migrationPath === 'standalone-to-workspace')
    {
        migrateStandaloneToWorkspace(dir);
        return;
    }

    ora().fail(
        'Could not detect project type for migration.\n' +
        'Expected one of:\n' +
        '  - A pre-v2 project with src/index_ifd.ts\n' +
        '  - A standalone CLI project with a build script using `intuiface-cli build -n <name>`\n' +
        '  - A project already in workspace mode (intuiface.workspace.json)'
    );
    process.exit(-2);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function detectMigrationPath(dir: string): MigrationPath
{
    if (tryReadWorkspaceConfig(dir) != null)
    {
        return 'already-workspace';
    }

    if (fs.existsSync(path.join(dir, 'src', 'index_ifd.ts')))
    {
        return 'pre-v2';
    }

    const packageJsonPath = path.join(dir, 'package.json');
    if (fs.existsSync(packageJsonPath))
    {
        const packageJson = fs.readJsonSync(packageJsonPath, { throws: false });
        const buildScript: string = packageJson?.scripts?.build ?? '';
        if (buildScript.includes('intuiface-cli build') && getBuildScriptOption(buildScript, 'name') != null)
        {
            return 'standalone-to-workspace';
        }
    }

    return 'unknown';
}

/**
 * Options of `intuiface-cli build` read from a 2.x build script, in their short (`-n MyAsset`)
 * and long (`--name MyAsset`, `--name=MyAsset`) forms, as the 2.x CLI accepts them.
 */
const BUILD_SCRIPT_OPTIONS = {
    name: /(?:^|\s)(?:-n\s+|--name(?:\s+|=))(\S+)/,
    type: /(?:^|\s)(?:-t\s+|--type(?:\s+|=))(\S+)/,
    icon: /(?:^|\s)(?:-i\s+|--icon(?:\s+|=))(\S+)/
};

/**
 * @returns the value of an option of `intuiface-cli build` in a build script, without surrounding quotes
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getBuildScriptOption(buildScript: string, option: keyof typeof BUILD_SCRIPT_OPTIONS): string | undefined
{
    const value = buildScript.match(BUILD_SCRIPT_OPTIONS[option])?.[1].replace(/^(['"])(.*)\1$/, '$2');
    return value != null && value !== '' ? value : undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function detectItemFromBuildScript(buildScript: string, dir: string): DetectedItem | undefined
{
    const name = getBuildScriptOption(buildScript, 'name');
    if (name == null)
    {
        return undefined;
    }

    const type: BuildType = getBuildScriptOption(buildScript, 'type') === 'binding-converter' ? 'binding-converter' : 'interface-asset';
    const explicitIcon = getBuildScriptOption(buildScript, 'icon');

    // Detect default binding-converter icon when no explicit icon is set
    const defaultIcon = 'icon_converter_32.png';
    const icon = explicitIcon
        ?? (type === 'binding-converter' && fs.existsSync(path.join(dir, defaultIcon)) ? defaultIcon : undefined);

    // Entry: standalone schematics projects always place the file at src/<name>.ts
    const entry = `src/${name}.ts`;
    return { name, type, entry, icon };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function migrateStandaloneToWorkspace(dir: string): void
{
    const spinner = ora({ text: 'Migrating standalone project to workspace mode...' }).start();

    try
    {
        spinner.indent = 3;

        spinner.start('Reading project configuration');
        const packageJson = fs.readJsonSync(path.join(dir, 'package.json'), { throws: true });
        const buildScript: string = packageJson?.scripts?.build ?? '';
        const detected = detectItemFromBuildScript(buildScript, dir);

        if (!detected)
        {
            throw new Error(
                'Cannot detect workspace item from build script.\n' +
                `Expected a script like: npx intuiface-cli build -n <name>`
            );
        }

        spinner.succeed(`Detected ${detected.type} '${detected.name}'`);

        // Files are changed from the least to the most significant for detectMigrationPath: the build script (which
        // identifies a 2.x project) and then intuiface.workspace.json come last, so a migration that fails on the way
        // can run again (review R3).
        spinner.start('Updating tsconfig.json');
        const isTsConfigUpdated = updateTsConfigForTypeScript6(dir, packageJson);
        spinner.succeed(isTsConfigUpdated ? 'tsconfig.json updated for TypeScript 6' : 'tsconfig.json already up to date');

        moveWebpackConfig(dir, detected.name, spinner);

        spinner.start('Updating package.json scripts and build dependencies');
        packageJson.scripts.build = 'npx intuiface-cli build --all';
        packageJson.scripts['build:debug'] = 'npx intuiface-cli build --all --debug';
        const dependenciesSummary = updateWorkspaceDependencies(packageJson);
        fs.writeJsonSync(path.join(dir, 'package.json'), packageJson, { spaces: 2 });
        spinner.succeed('package.json scripts updated');
        spinner.succeed(dependenciesSummary);

        spinner.start(`Creating ${getWorkspaceConfigFileName()}`);
        const workspaceName: string = packageJson.name ?? path.basename(dir);
        const { name, type, entry, icon } = detected;
        const workspaceItem: WorkspaceItem = { name, type, entry, icon };
        const workspaceConfig: WorkspaceConfig = {
            version: 1,
            name: workspaceName,
            items: [workspaceItem]
        };
        writeWorkspaceConfig(dir, workspaceConfig);
        spinner.succeed(`${getWorkspaceConfigFileName()} created`);

        spinner.indent = 0;
        spinner.succeed(`Migration to workspace mode complete.\nRun 'npm install' and 'npm run build' to install updated dependencies and build.`);
    }
    catch (error)
    {
        spinner.fail();
        const typedError = error instanceof Error ? error : new Error(String(error));
        spinner.fail(`Error: ${typedError.message}`);
        process.exit(-2);
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function migratePreV2(dir: string): void
{
    // `dir` is the folder detectMigrationPath looked at: the migration never reads or changes another one
    // (it used to prefer INIT_CWD, the folder `npm run` started from, review R4).
    const spinner = ora({ text: 'Migrating project to use intuiface-cli...' }).start();
    spinner.info();

    try
    {
        spinner.indent = 3;
        spinner.start('Extracting information from current code');
        const indexIFD = fs.readFileSync(path.join(dir, 'src', 'index_ifd.ts'), 'utf8');
        const match = /const ia = (await import\('.\/(?<importName>\w+).js'\))|(new (?<cstrName>\w+)\(\));/.exec(indexIFD);
        const iaName = match?.groups?.importName ?? match?.groups?.cstrName;
        if (iaName == null || iaName === '')
        {
            throw new Error('Can\'t find IA name from current workspace.');
        }

        // Everything that can fail to parse is read before the first change (review R3).
        // tsconfig.json is read with TypeScript's parser: comments and trailing commas are allowed (review R7).
        const packageJson = fs.readJsonSync(path.join(dir, 'package.json'));
        const project = readTsConfig(dir);
        if (project == null)
        {
            throw new Error('tsconfig.json not found.');
        }
        spinner.succeed(`Detected interface-asset: '${iaName}'`);

        spinner.start('Updating tsconfig.json');
        const tsconfig = project.tsconfig as { compilerOptions?: Record<string, unknown>; include?: string[] };
        const compilerOptions = tsconfig.compilerOptions ?? {};
        compilerOptions.rootDir = './src';
        compilerOptions.outDir = './dist';
        compilerOptions.target = 'ES2022';
        compilerOptions.useDefineForClassFields = false;
        compilerOptions.moduleResolution = 'bundler';
        delete compilerOptions.downlevelIteration;
        if (compilerOptions.types == null && hasNodeTypes(packageJson))
        {
            compilerOptions.types = ['node'];
        }
        tsconfig.compilerOptions = compilerOptions;
        tsconfig.include = ['**/src/**/*.ts'];
        fs.writeFileSync(project.path, JSON.stringify(tsconfig, null, 2));
        spinner.succeed();

        moveWebpackConfig(dir, iaName, spinner);

        spinner.start('Updating package.json scripts');
        packageJson.scripts ??= {};
        packageJson.scripts.build = 'npx intuiface-cli build --all';
        packageJson.scripts['build:debug'] = 'npx intuiface-cli build --all --debug';
        delete packageJson.scripts.cleanDist;
        delete packageJson.scripts.cleanTmp;
        spinner.succeed();

        spinner.start('Updating build dependencies');
        const dependenciesSummary = updateWorkspaceDependencies(packageJson);
        fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
        spinner.succeed(dependenciesSummary);

        spinner.start('Removing unused files');
        fs.removeSync(path.join(dir, 'src', 'index.js'));
        fs.removeSync(path.join(dir, 'src', 'package.json'));
        fs.removeSync(path.join(dir, 'tsconfig.ifd.json'));
        fs.removeSync(path.join(dir, 'dist'));
        spinner.succeed();

        // index_ifd.ts identifies a pre-v2 project and intuiface.workspace.json a migrated one: they are changed last,
        // and the workspace config is removed again when index_ifd.ts cannot be, so a migration that fails on the way
        // can run again (review R3).
        spinner.start(`Creating ${getWorkspaceConfigFileName()}`);
        const workspaceItem: WorkspaceItem = {
            name: iaName,
            type: 'interface-asset',
            entry: `src/${iaName}.ts`
        };
        const workspaceConfig: WorkspaceConfig = {
            version: 1,
            name: path.basename(dir),
            items: [workspaceItem]
        };
        writeWorkspaceConfig(dir, workspaceConfig);
        try
        {
            fs.removeSync(path.join(dir, 'src', 'index_ifd.ts'));
        }
        catch (error)
        {
            fs.removeSync(path.join(dir, getWorkspaceConfigFileName()));
            throw error;
        }
        spinner.succeed(`${getWorkspaceConfigFileName()} created`);

        spinner.indent = 0;
        spinner.succeed(`Migration to workspace mode complete.\nRun 'npm install' and 'npm run build' to install updated dependencies and build.`);
    }
    catch (error)
    {
        spinner.fail();
        const typedError = error instanceof Error ? error : new Error(String(error));
        spinner.fail(`Error: ${typedError.message}\n${typedError.stack}`);
        process.exit(-2);
    }
}

/**
 * Raise the build toolchain and the Intuiface packages to the versions the workspace mode needs
 * (older schematics projects have lower ones). Newer versions are kept: a migration never downgrades.
 * @returns a summary for the console
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function updateWorkspaceDependencies(packageJson: Record<string, unknown>): string
{
    const publishedVersion = getPublishedPackageVersion();
    const updates = [
        ...ensureMinimumDependencies(packageJson, 'devDependencies', WORKSPACE_BUILD_DEV_DEPENDENCIES),
        ...ensureMinimumDependencies(packageJson, 'dependencies', {
            '@intuiface/cli': publishedVersion,
            '@intuiface/core': publishedVersion
        })
    ];

    return updates.length > 0
        ? `Build dependencies updated: ${formatDependencyUpdates(updates)}`
        : 'Build dependencies already up to date';
}

/** A change of the compiler options of a 2.x tsconfig.json for TypeScript 6. */
interface TsConfigChange
{
    /** What to change, e.g. `remove "downlevelIteration"`. */
    description: string;
    apply: (compilerOptions: Record<string, unknown>) => void;
}

/**
 * Changes that make the compiler options of a 2.x project compatible with TypeScript 6 (installed by the migration):
 * - `rootDir` must be explicit (TypeScript 6 reports TS5011 without it, e.g. in `tsc` and in the editor),
 * - `moduleResolution: node|node10|classic` and `downlevelIteration` are deprecated,
 * - `types` defaults to `[]`: without `"types": ["node"]`, an import of a Node.js module (e.g. `fs`, often a webpack external)
 *   no longer compiles. It is added when the project depends on `@types/node` and sets no `types`.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getTsConfigChangesForTypeScript6(compilerOptions: Record<string, unknown>, packageJson: Record<string, unknown>): TsConfigChange[]
{
    const changes: TsConfigChange[] = [];

    if (compilerOptions.rootDir == null)
    {
        changes.push({ description: 'add "rootDir": "./src"', apply: (options) => { options.rootDir = './src'; } });
    }

    const moduleResolution = typeof compilerOptions.moduleResolution === 'string' ? compilerOptions.moduleResolution : undefined;
    if (moduleResolution != null && ['node', 'node10', 'classic'].includes(moduleResolution.toLowerCase()))
    {
        changes.push({
            description: `replace "moduleResolution": "${moduleResolution}" with "moduleResolution": "bundler"`,
            apply: (options) => { options.moduleResolution = 'bundler'; }
        });
    }

    if ('downlevelIteration' in compilerOptions)
    {
        changes.push({ description: 'remove "downlevelIteration"', apply: (options) => { delete options.downlevelIteration; } });
    }

    if (compilerOptions.types == null && hasNodeTypes(packageJson))
    {
        changes.push({ description: 'add "types": ["node"]', apply: (options) => { options.types = ['node']; } });
    }

    return changes;
}

/**
 * Read tsconfig.json and package.json of a project.
 * @returns undefined without tsconfig.json
 * @throws when tsconfig.json cannot be parsed
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function readTsConfig(dir: string): { path: string; tsconfig: { compilerOptions?: Record<string, unknown> } } | undefined
{
    const tsconfigPath = path.join(dir, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath))
    {
        return undefined;
    }

    const parsed = ts.parseConfigFileTextToJson(tsconfigPath, fs.readFileSync(tsconfigPath, 'utf8'));
    if (parsed.error)
    {
        throw new Error(`Cannot parse tsconfig.json: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')}`);
    }

    return { path: tsconfigPath, tsconfig: parsed.config ?? {} };
}

/**
 * Make a 2.x project tsconfig compatible with TypeScript 6 (see {@link getTsConfigChangesForTypeScript6}).
 * @returns true if the file was modified.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function updateTsConfigForTypeScript6(dir: string, packageJson: Record<string, unknown>): boolean
{
    const project = readTsConfig(dir);
    if (project == null)
    {
        return false;
    }

    const compilerOptions = project.tsconfig.compilerOptions ?? {};
    const changes = getTsConfigChangesForTypeScript6(compilerOptions, packageJson);
    if (changes.length === 0)
    {
        return false;
    }

    changes.forEach((change) => change.apply(compilerOptions));
    project.tsconfig.compilerOptions = compilerOptions;
    fs.writeFileSync(project.path, `${JSON.stringify(project.tsconfig, null, 2)}\n`, 'utf8');
    return true;
}

/**
 * Changes of tsconfig.json a 2.x project needs to compile with TypeScript 6, as `migrate` makes them, for the developer
 * to make them by hand.
 * @returns the description of each change, none when tsconfig.json cannot be read
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function describeTsConfigChangesForTypeScript6(dir: string): string[]
{
    try
    {
        const project = readTsConfig(dir);
        const packageJson = fs.readJsonSync(path.join(dir, 'package.json'), { throws: false }) ?? {};
        return project == null
            ? []
            : getTsConfigChangesForTypeScript6(project.tsconfig.compilerOptions ?? {}, packageJson).map((change) => change.description);
    }
    catch (_error)
    {
        return [];
    }
}

/**
 * @returns true when package.json declares `@types/node` (the 2.x schematics added it to devDependencies)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function hasNodeTypes(packageJson: Record<string, unknown>): boolean
{
    return ['dependencies', 'devDependencies'].some((section) =>
    {
        const dependencies = packageJson[section];
        return dependencies != null && typeof dependencies === 'object' && '@types/node' in dependencies;
    });
}

/**
 * Replace webpack.config.js and webpack-debug.config.js with webpack.config.cjs, moving their customisations (e.g. `externals`).
 * A file with changes that cannot be moved automatically is kept, with a warning telling what to move by hand.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function moveWebpackConfig(dir: string, itemName: string, spinner: Ora): void
{
    const webpackConfigFileName = getWorkspaceWebpackConfigFileName();
    spinner.start(`Creating ${webpackConfigFileName}`);
    const migration = migrateWebpackConfigFiles(dir, itemName);

    const created = migration.isWebpackConfigCreated ? `${webpackConfigFileName} created` : `${webpackConfigFileName} kept`;
    const moved = migration.migrated.length > 0 ? `, with ${migration.migrated.map((name) => `\`${name}\``).join(', ')}` : '';
    const removed = migration.removedFiles.length > 0 ? ` (${migration.removedFiles.join(' and ')} removed)` : '';
    spinner.succeed(`${created}${moved}${removed}`);

    for (const keptFile of migration.keptFiles)
    {
        const reasons = keptFile.reasons.map((reason) => `     - ${reason}`).join('\n');
        spinner.warn(`${keptFile.file} kept, move these changes to ${webpackConfigFileName} by hand, then delete it:\n${reasons}`);
    }
}

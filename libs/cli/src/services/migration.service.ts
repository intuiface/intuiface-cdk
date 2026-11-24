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
        if (buildScript.includes('intuiface-cli build') && /\s-n\s/.test(buildScript))
        {
            return 'standalone-to-workspace';
        }
    }

    return 'unknown';
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function detectItemFromBuildScript(buildScript: string, dir: string): DetectedItem | undefined
{
    const nameMatch = buildScript.match(/(?:^|\s)-n\s+(\S+)/);
    if (!nameMatch)
    {
        return undefined;
    }

    const name = nameMatch[1];
    const typeMatch = buildScript.match(/(?:^|\s)-t\s+(\S+)/);
    const type: BuildType = typeMatch?.[1] === 'binding-converter' ? 'binding-converter' : 'interface-asset';
    const iconMatch = buildScript.match(/(?:^|\s)-i\s+(\S+)/);
    const explicitIcon = iconMatch?.[1];

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

        spinner.start('Updating package.json scripts');
        packageJson.scripts.build = 'npx intuiface-cli build --all';
        packageJson.scripts['build:debug'] = 'npx intuiface-cli build --all --debug';
        spinner.succeed('package.json scripts updated');

        spinner.start('Updating build dependencies');
        const dependenciesSummary = updateWorkspaceDependencies(packageJson);
        fs.writeJsonSync(path.join(dir, 'package.json'), packageJson, { spaces: 2 });
        spinner.succeed(dependenciesSummary);

        spinner.start('Updating tsconfig.json');
        const isTsConfigUpdated = updateTsConfigForTypeScript6(dir, packageJson);
        spinner.succeed(isTsConfigUpdated ? 'tsconfig.json updated for TypeScript 6' : 'tsconfig.json already up to date');

        moveWebpackConfig(dir, detected.name, spinner);

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
    // Legacy dir resolution kept for backward compatibility (may run via npm postinstall)
    const legacyDir = process.env.INIT_CWD ?? dir;

    const spinner = ora({ text: 'Migrating project to use intuiface-cli...' }).start();
    spinner.info();

    try
    {
        spinner.indent = 3;
        spinner.start('Extracting information from current code');
        const indexIFD = fs.readFileSync(`${legacyDir}/src/index_ifd.ts`);
        const regexp = /const ia = (await import\('.\/(?<importName>\w+).js'\))|(new (?<cstrName>\w+)\(\));/g;

        if (indexIFD)
        {
            const match = regexp.exec(indexIFD.toString());
            let iaName = '';
            if (match?.groups)
            {
                iaName = match.groups.importName ?? match.groups.cstrName;
            }

            if (iaName == null || iaName === '')
            {
                throw new Error('Can\'t find IA name from current workspace.');
            }
            spinner.succeed(`Detected interface-asset: '${iaName}'`);

            spinner.start(`Creating ${getWorkspaceConfigFileName()}`);
            const workspaceName: string = path.basename(legacyDir);
            const workspaceItem: WorkspaceItem = {
                name: iaName,
                type: 'interface-asset',
                entry: `src/${iaName}.ts`
            };
            const workspaceConfig: WorkspaceConfig = {
                version: 1,
                name: workspaceName,
                items: [workspaceItem]
            };
            writeWorkspaceConfig(legacyDir, workspaceConfig);
            spinner.succeed(`${getWorkspaceConfigFileName()} created`);

            spinner.start('Updating package.json scripts');
            const packageJson = fs.readJsonSync(`${legacyDir}/package.json`, { flag: 'r' });
            packageJson.scripts.build = 'npx intuiface-cli build --all';
            packageJson.scripts['build:debug'] = 'npx intuiface-cli build --all --debug';
            delete packageJson.scripts.cleanDist;
            delete packageJson.scripts.cleanTmp;
            spinner.succeed();

            spinner.start('Updating build dependencies');
            const dependenciesSummary = updateWorkspaceDependencies(packageJson);
            fs.writeFileSync(`${legacyDir}/package.json`, JSON.stringify(packageJson, null, 2));
            spinner.succeed(dependenciesSummary);

            spinner.start('Updating tsconfig.json');
            const tsconfigRaw = fs.readFileSync(`${legacyDir}/tsconfig.json`, 'utf8');
            const tsconfig = JSON.parse(tsconfigRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'));
            tsconfig.compilerOptions.rootDir = './src';
            tsconfig.compilerOptions.outDir = './dist';
            tsconfig.compilerOptions.target = 'ES2022';
            tsconfig.compilerOptions.useDefineForClassFields = false;
            tsconfig.compilerOptions.moduleResolution = 'bundler';
            delete tsconfig.compilerOptions.downlevelIteration;
            if (tsconfig.compilerOptions.types == null && hasNodeTypes(packageJson))
            {
                tsconfig.compilerOptions.types = ['node'];
            }
            tsconfig.include = ['**/src/**/*.ts'];
            fs.writeFileSync(`${legacyDir}/tsconfig.json`, JSON.stringify(tsconfig, null, 2));
            spinner.succeed();

            spinner.start('Removing unused files');
            fs.removeSync(`${legacyDir}/src/index_ifd.ts`);
            fs.removeSync(`${legacyDir}/src/index.js`);
            if (fs.existsSync(`${legacyDir}/src/package.json`))
            {
                fs.removeSync(`${legacyDir}/src/package.json`);
            }
            fs.removeSync(`${legacyDir}/tsconfig.ifd.json`);
            fs.removeSync(`${legacyDir}/dist`);
            spinner.succeed();

            moveWebpackConfig(legacyDir, iaName, spinner);

            spinner.indent = 0;
            spinner.succeed(`Migration to workspace mode complete.\nRun 'npm install' and 'npm run build' to install updated dependencies and build.`);
        }
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

/**
 * Make a 2.x project tsconfig compatible with TypeScript 6 (installed by the migration):
 * - `rootDir` must be explicit (the CLI resolves transpiled entries relative to `./src`),
 * - `moduleResolution: node|node10|classic` and `downlevelIteration` are deprecated,
 * - `types` defaults to `[]`: without `"types": ["node"]`, an import of a Node.js module (e.g. `fs`, often a webpack external)
 *   no longer compiles. It is added when the project depends on `@types/node` and sets no `types`.
 * @returns true if the file was modified.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function updateTsConfigForTypeScript6(dir: string, packageJson: Record<string, unknown>): boolean
{
    const tsconfigPath = path.join(dir, 'tsconfig.json');
    if (!fs.existsSync(tsconfigPath))
    {
        return false;
    }

    const parsed = ts.parseConfigFileTextToJson(tsconfigPath, fs.readFileSync(tsconfigPath, 'utf8'));
    if (parsed.error)
    {
        throw new Error(`Cannot parse tsconfig.json: ${ts.flattenDiagnosticMessageText(parsed.error.messageText, '\n')}`);
    }

    const tsconfig = parsed.config ?? {};
    const compilerOptions = tsconfig.compilerOptions ?? {};
    let isModified = false;

    if (compilerOptions.rootDir == null)
    {
        compilerOptions.rootDir = './src';
        isModified = true;
    }

    const moduleResolution = typeof compilerOptions.moduleResolution === 'string' ? compilerOptions.moduleResolution.toLowerCase() : undefined;
    if (moduleResolution === 'node' || moduleResolution === 'node10' || moduleResolution === 'classic')
    {
        compilerOptions.moduleResolution = 'bundler';
        isModified = true;
    }

    if ('downlevelIteration' in compilerOptions)
    {
        delete compilerOptions.downlevelIteration;
        isModified = true;
    }

    if (compilerOptions.types == null && hasNodeTypes(packageJson))
    {
        compilerOptions.types = ['node'];
        isModified = true;
    }

    if (isModified)
    {
        tsconfig.compilerOptions = compilerOptions;
        fs.writeFileSync(tsconfigPath, `${JSON.stringify(tsconfig, null, 2)}\n`, 'utf8');
    }

    return isModified;
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

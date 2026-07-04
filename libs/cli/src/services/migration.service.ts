import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { BuildType, WorkspaceConfig, WorkspaceItem } from '../types.js';
import { tryReadWorkspaceConfig, writeWorkspaceConfig, getWorkspaceConfigFileName } from './workspace.service.js';
import { getPublishedPackageVersion } from './generator.service.js';

type MigrationPath = 'already-workspace' | 'pre-v2' | 'standalone-to-workspace' | 'unknown';

interface DetectedItem
{
    name: string;
    type: BuildType;
    entry: string;
    icon?: string;
}

/**
 * Minimum build-tool dependency versions required by the workspace CLI mode.
 * Older schematics-generated projects will have lower versions that need updating.
 */
const REQUIRED_BUILD_DEV_DEPENDENCIES: Record<string, string> = {
    'ts-loader': '^9.5.1',
    'typescript': '^5.8.0',
    'webpack': '^5.99.0',
    'webpack-cli': '^6.0.1'
};

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
        updateWorkspaceDependencies(packageJson);
        fs.writeJsonSync(path.join(dir, 'package.json'), packageJson, { spaces: 2 });
        spinner.succeed('Build dependencies updated');

        spinner.start('Removing unused webpack config files');
        removeWebpackConfigFiles(dir);
        spinner.succeed('Webpack config files removed');

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
            updateWorkspaceDependencies(packageJson);
            fs.writeFileSync(`${legacyDir}/package.json`, JSON.stringify(packageJson, null, 2));
            spinner.succeed('Build dependencies updated');

            spinner.start('Updating tsconfig.json');
            const tsconfigRaw = fs.readFileSync(`${legacyDir}/tsconfig.json`, 'utf8');
            const tsconfig = JSON.parse(tsconfigRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'));
            tsconfig.compilerOptions.rootDir = './src';
            tsconfig.compilerOptions.outDir = './dist';
            tsconfig.compilerOptions.target = 'ES2022';
            tsconfig.compilerOptions.useDefineForClassFields = false;
            tsconfig.compilerOptions.moduleResolution = 'bundler';
            delete tsconfig.compilerOptions.downlevelIteration;
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
            removeWebpackConfigFiles(legacyDir);
            spinner.succeed();

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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function updateWorkspaceDependencies(packageJson: any): void
{
    if (!packageJson.devDependencies)
    {
        packageJson.devDependencies = {};
    }

    for (const [dep, version] of Object.entries(REQUIRED_BUILD_DEV_DEPENDENCIES))
    {
        packageJson.devDependencies[dep] = version;
    }

    // Update intuiface packages to the running published version
    const publishedVersion = getPublishedPackageVersion();
    if (!packageJson.dependencies)
    {
        packageJson.dependencies = {};
    }

    packageJson.dependencies['@intuiface/cli'] = publishedVersion;
    packageJson.dependencies['@intuiface/core'] = publishedVersion;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function removeWebpackConfigFiles(dir: string): void
{
    for (const file of ['webpack.config.js', 'webpack-debug.config.js'])
    {
        if (fs.existsSync(path.join(dir, file)))
        {
            fs.removeSync(path.join(dir, file));
        }
    }
}

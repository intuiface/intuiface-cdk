import fs from 'fs-extra';
import path from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { BuildTarget, BuildType, WorkspaceItem } from '../types.js';
import { ADD_ITEM_EXAMPLES } from '../utils/examples.js';
import { isExecException, runWebpack } from '../utils/exec.js';
import {
    tryReadWorkspaceConfig,
    getRequiredWorkspaceItem,
    getWorkspaceConfigFileName,
    findLegacyWebpackConfigFiles,
    findWorkspaceWebpackConfig,
    getWorkspaceWebpackConfigFileName
} from '../services/workspace.service.js';
import { validateIconPath } from '../utils/validators.js';
import {
    cleanBuildFolders,
    getItemModuleDir,
    resetBuildMetadata,
    transpileTypeScript,
    resolveBuildIcon,
    writeGeneratedWebpackConfig,
    TypeScriptCompilationError
} from '../services/build.service.js';
import { describeTsConfigChangesForTypeScript6 } from '../services/migration.service.js';
import { buildSchemas, buildResources, buildIFDFile, writeIFDFile } from '../services/descriptor.service.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function runBuildCommand(options: { name?: string; all?: boolean; type?: string; icon?: string; debug?: boolean }): Promise<void>
{
    const dir = process.cwd();
    const workspaceConfig = tryReadWorkspaceConfig(dir);
    if (workspaceConfig)
    {
        warnAboutLegacyWebpackConfigFiles(dir);

        const itemName = options.name;
        let targets: BuildTarget[];
        // --name wins over --all: the generated `build` script passes --all, and `npm run build -- -n X` must build X only
        if (itemName != null && itemName !== '')
        {
            targets = [toBuildTarget(getRequiredWorkspaceItem(workspaceConfig, itemName), options.icon)];
        }
        else if (options.all)
        {
            if (options.icon)
            {
                throw new Error(`'--icon' cannot be used to build every item. Set the icon of each item in ${getWorkspaceConfigFileName()}, or build one item with '--name <name> --icon <icon>'.`);
            }
            targets = workspaceConfig.items.map((item) => toBuildTarget(item));
            if (targets.length === 0)
            {
                // Not an error (`npm run build` right after `init`), but say why nothing was built
                console.log(chalk.yellow(`⚠ Nothing to build: ${getWorkspaceConfigFileName()} has no items yet. Add one with:`));
                for (const command of ADD_ITEM_EXAMPLES)
                {
                    console.log(`    ${chalk.cyan(command)}`);
                }
                return;
            }
        }
        else
        {
            throw new Error(`Workspace build requires either '--name <name>' or '--all'.`);
        }

        validateBuildIcons(targets, dir);
        for (const target of targets)
        {
            await buildTarget(target, options.debug);
        }
        return;
    }

    if (options.name == null || options.name === '')
    {
        throw new Error(`Legacy build mode requires '--name <name>'.`);
    }

    const buildType = normalizeBuildType(options.type);
    const legacyTarget: BuildTarget = {
        name: options.name,
        buildType: buildType,
        entryFile: `src/${options.name}.ts`,
        outputDir: `dist/${options.name}`,
        icon: options.icon,
        useGeneratedWebpackConfig: false
    };
    validateBuildIcons([legacyTarget], dir);
    await buildTarget(legacyTarget, options.debug);
}

/**
 * Check the icons before building anything: a missing icon would otherwise fail after webpack, and wipe the item output.
 * @throws when the icon of a target does not exist
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function validateBuildIcons(targets: BuildTarget[], dir: string): void
{
    for (const target of targets)
    {
        if (target.icon)
        {
            validateIconPath(target.icon, dir, target.name);
        }
    }
}

/**
 * A workspace builds with a generated webpack configuration, customised by webpack.config.cjs:
 * a webpack.config.js left from a 2.x project is not used, which the developer may not expect.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function warnAboutLegacyWebpackConfigFiles(dir: string): void
{
    const legacyFiles = findLegacyWebpackConfigFiles(dir);
    if (legacyFiles.length > 0)
    {
        ora().warn(`${legacyFiles.join(' and ')} ${legacyFiles.length > 1 ? 'are' : 'is'} not used to build a workspace. `
            + `Move ${legacyFiles.length > 1 ? 'their' : 'its'} changes to ${getWorkspaceWebpackConfigFileName()}, then delete ${legacyFiles.length > 1 ? 'them' : 'it'}.`);
    }
}

/**
 * A 2.x project (outside a workspace) whose tsconfig.json was written for TypeScript 5 does not compile with the
 * TypeScript 6 of the CLI: invite the developer to migrate the project, or to change tsconfig.json.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function warnAboutTypeScript6TsConfig(dir: string): void
{
    const changes = describeTsConfigChangesForTypeScript6(dir);
    const lines = [
        'This project was created with an older version of the Intuiface CDK.',
        'It must be updated before it can be built with this version of intuiface-cli.',
        '',
        'Recommended: update the project automatically. In this folder, run these commands one after the other:',
        '',
        ...['npx intuiface-cli migrate', 'npm install', 'npm run build'].map((command) => `    ${chalk.cyan(command)}`),
        '',
        ...(changes.length > 0
            ? ['Or, to keep the project as it is, make these changes in tsconfig.json, then run the build again:', ...changes.map((change) => `    - ${change}`)]
            : ['Or, to keep the project as it is, update tsconfig.json for TypeScript 6 (see https://aka.ms/ts6), then run the build again.'])
    ];
    // ora prints the symbol on the first line only: align the next lines with its text
    ora().warn(lines.map((line, index) => (index === 0 || line === '' ? line : `  ${line}`)).join('\n'));
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function toBuildTarget(item: WorkspaceItem, iconOverride?: string): BuildTarget
{
    return {
        name: item.name,
        buildType: item.type,
        entryFile: item.entry,
        outputDir: path.join('dist', item.name),
        icon: iconOverride ?? item.icon,
        useGeneratedWebpackConfig: true
    };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function normalizeBuildType(buildType: string | undefined): BuildType
{
    if (buildType == null || buildType === '')
    {
        return 'interface-asset';
    }

    if (buildType === 'interface-asset' || buildType === 'binding-converter')
    {
        return buildType;
    }

    throw new Error(`Unsupported build type '${buildType}'. Expected 'interface-asset' or 'binding-converter'.`);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function buildTarget(target: BuildTarget, debug?: boolean): Promise<void>
{
    const spinner = ora({ text: `Build ${target.buildType} ${target.name}.` }).start();
    spinner.info();

    const dir = process.cwd();
    const tmpDir = path.join(dir, 'tmp');
    const resolvedOutputDir = path.join(dir, target.outputDir);

    cleanBuildFolders(dir, target.outputDir);

    try
    {
        await resetBuildMetadata(target);

        spinner.start('Compiling TypeScript...');
        const moduleDir = getItemModuleDir(tmpDir, target.name);
        const transpiledEntryPath = transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, target.entryFile), moduleDir, spinner);
        if (transpiledEntryPath == null)
        {
            spinner.fail(`Fail generating IFD file for ${target.name}. Please check the entry file and try again (${target.entryFile} is not compiled: it must exist and be included by tsconfig.json).`);
            cleanBuildFolders(dir, target.outputDir);
            process.exit(-3);
        }
        spinner.succeed('TypeScript compiled.');

        // Also applies to the item folder, under tmp/
        fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ type: 'module' }, null, 2));

        spinner.start('Loading interface asset...');
        const iaUrl = pathToFileURL(transpiledEntryPath);
        await import(iaUrl.toString());

        const globalThisAny = globalThis as any;
        spinner.start('Loading interface asset metadata...');
        const schemas = buildSchemas(globalThisAny.intuiface_ifd_classes, target.buildType);
        spinner.succeed('Build Schema');
        const resources = buildResources(globalThisAny.intuiface_ifd_classes, target.buildType);
        spinner.succeed('Build Resources');
        // eslint-disable-next-line camelcase
        globalThisAny.intuiface_ifd_file = buildIFDFile(target.name, target.buildType, schemas, resources);

        const icon = resolveBuildIcon(target.buildType, target.icon, dir);
        let iconName = '';
        if (icon)
        {
            iconName = path.basename(icon);
            globalThisAny.intuiface_ifd_file.icons = { x32: iconName };
        }

        spinner.start('Writing descriptor file...');
        await writeIFDFile(target.name, target.outputDir, globalThisAny.intuiface_ifd_file, spinner);

        let webpackOutput;
        if (target.useGeneratedWebpackConfig)
        {
            const customizationPath = findWorkspaceWebpackConfig(dir);
            spinner.start(`Building ${target.buildType}: ${target.name}${customizationPath ? ` (customised by ${getWorkspaceWebpackConfigFileName()})` : ''}...`);
            const webpackConfigPath = writeGeneratedWebpackConfig(target, dir, tmpDir, { debug, customizationPath });
            webpackOutput = await runWebpack(dir, webpackConfigPath);
        }
        else
        {
            spinner.start(`Building ${target.buildType}: ${target.name}...`);
            webpackOutput = await runWebpack(dir, path.join(dir, debug ? 'webpack-debug.config.js' : 'webpack.config.js'));
        }

        if (webpackOutput)
        {
            spinner.succeed();
            console.log();
            console.log(webpackOutput.stdout);
        }
        spinner.succeed(`${target.buildType} '${target.name}' successfully built.`);

        if (icon)
        {
            spinner.start(`Copying icon ${iconName}...`);
            await fs.copy(path.resolve(dir, icon), path.join(resolvedOutputDir, iconName));
            spinner.succeed(`Icon ${iconName} copied.`);
        }

        // tmp/ only holds intermediate files (transpiled JS, generated webpack config)
        fs.removeSync(tmpDir);

        spinner.succeed(`Done! Your ${target.buildType} is in '${target.outputDir}'.\nCopy this folder into "Documents\\Intuiface\\Interface Assets" to use it in Composer.`);
        spinner.stop();
    }
    catch (e)
    {
        if (spinner.isSpinning)
        {
            spinner.fail();
        }

        if (e instanceof TypeScriptCompilationError)
        {
            // The TypeScript errors are already reported
            spinner.fail(e.message);
            if (!target.useGeneratedWebpackConfig && e.isTypeScript6ConfigurationError)
            {
                warnAboutTypeScript6TsConfig(dir);
            }
        }
        else if (isExecException(e))
        {
            let errorText = `Fail to execute command '${e.cmd}'.\n`;
            if (e.stderr)
            {
                errorText += `Error: ${e.stderr}\n`;
            }
            else if (e.stdout)
            {
                errorText += `Error: ${e.stdout}\n`;
            }
            spinner.fail(errorText);
        }
        else
        {
            const error = e instanceof Error ? e : new Error(String(e));
            spinner.fail(`Error: ${error.message}\n${error.stack}`);
        }

        cleanBuildFolders(dir, target.outputDir);
        process.exit(-1);
    }
}

#!/usr/bin/env node

/* eslint-disable camelcase */
import { exec, ExecException } from 'child_process';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import ora, { Ora } from 'ora';
import { Command } from 'commander';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import ts from 'typescript';

const isExecException = (error: unknown): error is ExecException => typeof error === 'object' && error !== null && 'code' in error && 'cmd' in error;
type BuildType = 'interface-asset' | 'binding-converter';

const execPromise = (command: string): Promise<{stdout: string; stderr: string }> => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr)=> {
        if(error)
        {
            error.stderr = error.stderr ?? stderr;
            error.stdout = error.stdout ?? stdout;
            reject(error);
        }

        resolve({stdout, stderr});
    });
});

const globalThisAny = globalThis as any;

const usage = 'Intuiface CLI helps you build interface assets for Intuiface.\nTo see help for a specific command, you can run:\n  intuiface-cli help <command>\n  intuiface-cli <command> --help';

const program = new Command();

const ifdCmd = program
    .name('intuiface-cli')
    .description(usage);


ifdCmd.command('build')
    .summary('build an interface asset')
    .description('Build an interface asset and generate its descriptor file (*.ifd) to be imported into Intuiface Composer.')
    .requiredOption('-n, --name <name>', 'name of the interface asset\'s main file in the src/* folder (without extension).')
    .option('-t, --type <type>', 'asset type to build: interface-asset or binding-converter.', 'interface-asset')
    .option('-i, --icon [icon]', 'path to the icon of the IA displayed in Composer Interface Asset panel.')
    .option('-d, --debug', 'build in debug mode.')
    .addHelpText('afterAll', '\nExamples:\n  intuiface-cli build --name MyCustomIA --icon ./icon.png\n  intuiface-cli build --name MyBindingConverter --type binding-converter\n')
    .action((options) =>
    {
        // Check parameters
        if (options.name != null)
        {
            const buildType = normalizeBuildType(options.type);

            // create object to store metadata
            globalThisAny.intuiface_ifd_name = options.name;
            globalThisAny.intuiface_build_type = buildType;
            globalThisAny.intuiface_ifd_classes = [];
            globalThisAny.intuiface_ifd_properties = {};
            globalThisAny.intuiface_ifd_actions = {};
            globalThisAny.intuiface_ifd_params = {};
            globalThisAny.intuiface_ifd_triggers = {};

            // Initialize dom feature
            globalThisAny.window = new JSDOM('', { url: 'https://web.intuiface.com/' }).window;
            // Inject everything from `window` into global scope
            for (const key in globalThisAny.window)
            {
                if (Object.prototype.hasOwnProperty.call(globalThisAny.window, key) && globalThisAny[key] === undefined)
                {
                    globalThisAny[key] = globalThisAny.window[key];
                }
            }

            return loadIA(options.name, options.icon, buildType, options.debug);
        }
    });

// add subcommand
ifdCmd.command('migrate')
    .description('Migrate old project (<2.x) to new CLI.\nRun this command in the root folder of your project.')
    .summary('migrate old project (<2.x) to new CLI.')
    .action(() =>
    {
        migrateProject();
    });
program.parse();
program.showHelpAfterError();

/**
 * Clean build folders
 * @param dir 
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function cleanBuildFolders(dir: string, iaName: string = undefined): void
{
    // clean dist
    if (iaName && fs.existsSync(`${dir}/dist/${iaName}`))
    {
        fs.removeSync(`${dir}/dist/${iaName}`);
    }
    // clean tmp
    if (fs.existsSync(`${dir}/tmp/`))
    {
        fs.removeSync(`${dir}/tmp/`);
    }
}

/**
 * Transpile TypeScript programmatically
 * @param tsConfigPath Path to the tsconfig.json file
 * @param outDir Output directory for transpiled files
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function transpileTypeScript(tsConfigPath: string, outDir: string, spinner: Ora): void {
    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    if (configFile.error) {
        throw new Error(`Error reading tsconfig.json: ${configFile.error.messageText}`);
    }

    const parsedCommandLine = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        process.cwd()
    );

    const tsProgram = ts.createProgram(parsedCommandLine.fileNames, {
        ...parsedCommandLine.options,
        outDir: outDir,
        skipLibCheck: true
    });

    const emitResult = tsProgram.emit(undefined, undefined, undefined, undefined, {
        after: [
            (context): ts.Transformer<ts.SourceFile> => {
                const visit = (node: ts.Node): ts.Node => {
                    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
                        const moduleSpecifier = node.moduleSpecifier;
                        if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier)) {
                            const text = moduleSpecifier.text;
                            if ((text.startsWith('./') || text.startsWith('../')) && !text.endsWith('.js') && !text.endsWith('.json')) {
                                const updatedSpecifier = ts.factory.createStringLiteral(`${text}.js`);
                                if (ts.isImportDeclaration(node)) {
                                    return ts.factory.updateImportDeclaration(
                                        node,
                                        node.modifiers,
                                        node.importClause,
                                        updatedSpecifier,
                                        node.attributes
                                    );
                                } else if (ts.isExportDeclaration(node)) {
                                    return ts.factory.updateExportDeclaration(
                                        node,
                                        node.modifiers,
                                        node.isTypeOnly,
                                        node.exportClause,
                                        updatedSpecifier,
                                        node.attributes
                                    );
                                }
                            }
                        }
                    }
                    return ts.visitEachChild(node, visit, context);
                };
                return (node: ts.SourceFile) => ts.visitNode(node, visit) as ts.SourceFile;
            },
        ],
    });

    const allDiagnostics = ts.getPreEmitDiagnostics(tsProgram).concat(emitResult.diagnostics);

    const hasErrors = allDiagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
    if(hasErrors)
    {
        spinner.fail();
        spinner.text = '';
    }
    spinner.indent = 3;

    allDiagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            spinner.fail(chalk.red(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`));
        } else {
            spinner.fail(chalk.red(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')));
        }
    });
    spinner.indent = 0;
    if (hasErrors || emitResult.emitSkipped) {
        throw new Error('TypeScript compilation failed.');
    }
}

/**
 * import the IA
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function loadIA(iaName: string | undefined, icon: string | undefined, buildType: BuildType, debug?: boolean): Promise<void>
{
    const spinner = ora({ text: `Build ${buildType} ${iaName}.` }).start();
    spinner.info();

    const dir = process.cwd();

    cleanBuildFolders(dir, iaName);
    try
    {
        // set interface asset to import in composer
        if (iaName !== undefined)
        {
            spinner.start('Compiling TypeScript...');
            // Transpile TypeScript programmatically
            transpileTypeScript(`${dir}/tsconfig.json`, `${dir}/tmp/`, spinner);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if(!fs.existsSync(`${dir}/tmp/${iaName}.js`))
            {
                spinner.fail(`Fail generating IFD file for ${iaName}. Please check the name is correct and try again`);
                process.exit(-3);
            }
            spinner.succeed('TypeScript compiled.');

            // Write package.json to load IA as module
            fs.writeFileSync(`${dir}/tmp/package.json`, JSON.stringify({type: 'module'}, null, 2));

            spinner.start('Loading interface asset...');
            // Convert IA path as full URI (with file://) to be able to load it with import
            const iaUrl = pathToFileURL(`${dir}/tmp/${iaName}.js`);
            const ia = await import(iaUrl.toString());

            spinner.start('Loading interface asset metadata...');
            const schemas = buildSchemas(globalThisAny.intuiface_ifd_classes, buildType);
            spinner.succeed('Build Schema');
            const resources = buildResources(globalThisAny.intuiface_ifd_classes, buildType);
            spinner.succeed('Build Resources');
            globalThisAny.intuiface_ifd_file = buildIFDFile(iaName, buildType, schemas, resources);

            let iconName = '';
            if (icon || buildType === 'binding-converter')
            {
                // get the icon name from the icon path
                iconName = icon ? icon.substring(icon.lastIndexOf('/') + 1) : 'icon_converter_32.png';
                // add the icon to the ifd file
                globalThisAny.intuiface_ifd_file.icons = { x32: iconName };
                // If no icon provided for binding converter, use default one
                icon = icon ? icon : `icon_converter_32.png`;
            }

            spinner.start('Writing descriptor file...');
            // write the ifd file
            await writeIFDFile(iaName, globalThisAny.intuiface_ifd_file, spinner);

            // clean tmp
            if (fs.existsSync(`${dir}/tmp/`))
            {
                fs.removeSync(`${dir}/tmp/`);
            }

            spinner.start(`Building ${buildType}: ${iaName}...`);
            let webpackOutput;
            if (!debug)
            {
                webpackOutput = await execPromise(`npx webpack --config ${dir}/webpack.config.js`);
            }
            else
            {
                webpackOutput = await execPromise(`npx webpack --config ${dir}/webpack-debug.config.js`);
            }
            if(webpackOutput)
            {
                spinner.succeed();
                console.log();
                console.log(webpackOutput.stdout);
            }
            spinner.succeed(`${buildType} '${iaName}' successfully built.`);

            if(icon)
            {
                if (icon.startsWith('./'))
                {
                    icon = icon.substring(2);
                }
                spinner.start(`Copying icon ${iconName}...`);
                // copy the icon in dist folder
                await execPromise(`shx cp ${dir}/${icon} ${dir}/dist/${iaName}/${iconName}`);
                spinner.succeed(`Icon ${iconName} copied.`);
            }

            spinner.succeed(`Done! Your ${buildType} is in 'dist/${iaName}'.\nCopy this folder into "Documents\\Intuiface\\Interface Assets" to use it in Composer.`);
        }
        spinner.stop();
    }
    catch (e)
    {
        if(spinner.isSpinning)
        {
            spinner.fail(); // Force fail without text to let the current step text persist
        }

        if(isExecException(e))
        {
            // Format error from exec command
            let errorText = `Fail to execute command '${e.cmd}'.\n`;
            if(e.stderr)
            {
                errorText += `Error: ${e.stderr}\n`;
            }
            else if(e.stdout)
            {
                errorText += `Error: ${e.stdout}\n`;
            }
            spinner.fail(errorText);
        }
        else
        {
            spinner.fail(`Error: ${e.message}\n${e.stack}`);
        }
        cleanBuildFolders(dir, iaName);
        process.exit(-1);
    }
}

/**
 * Validates and normalizes the build type received from the CLI.
 * Falls back to `interface-asset` when the option is missing or empty.
 * @param buildType Raw build type coming from commander options.
 * @returns A supported build type used by the build pipeline.
 */
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

/**
 * Resolves the version written to generated descriptors.
 * Uses the workspace package version when available and falls back to a timestamp-based version.
 * @returns A version string prefixed with `v`.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getWorkspaceVersion(): string
{
    const packageJsonPath = `${process.cwd()}/package.json`;
    if (!fs.existsSync(packageJsonPath))
    {
        return `v1.0.${Date.now()}`;
    }

    const packageJson = fs.readJsonSync(packageJsonPath, { throws: false });
    if (packageJson?.version == null || packageJson.version === '')
    {
        return `v1.0.${Date.now()}`;
    }

    return packageJson.version.startsWith('v')
        ? packageJson.version
        : `v${packageJson.version}`;
}

/**
 * Resolves the category configured for the current workspace.
 * Binding converters can provide it from package.json instead of decorator metadata.
 * @returns The configured category, if any.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getWorkspaceCategory(): string | undefined
{
    const packageJsonPath = `${process.cwd()}/package.json`;
    if (!fs.existsSync(packageJsonPath))
    {
        return undefined;
    }

    const packageJson = fs.readJsonSync(packageJsonPath, { throws: false });
    const category = packageJson?.intuiface?.category;

    return typeof category === 'string' && category !== ''
        ? category
        : undefined;
}

/**
 * Builds the JSON schema section of the generated descriptor from collected class metadata.
 * Interface assets expose their decorated properties, while binding converters only expose a base object schema.
 * @param classNames Collected exported class names from the interface asset.
 * @param buildType Type of artifact currently being generated.
 * @returns A map of schema definitions indexed by class name.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function buildSchemas(classNames: string[], buildType: BuildType): Record<string, any>
{
    const schemas: Record<string, any> = {};

    for (const name of classNames)
    {
        const schema: Record<string, unknown> = {
            id: name,
            type: 'object',
            description: name
        };

        if (buildType === 'interface-asset')
        {
            schema.properties = globalThisAny.intuiface_ifd_properties[name];
        }

        schemas[name] = schema;
    }

    return schemas;
}

/**
 * Builds the resources section of the generated descriptor from collected actions and triggers.
 * Also marks the primary resource as the exported interface asset or binding converter entry point.
 * @param classNames Collected exported class names from the interface asset.
 * @param buildType Type of artifact currently being generated.
 * @returns A map of resource definitions indexed by class name.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function buildResources(classNames: string[], buildType: BuildType): Record<string, any>
{
    const resources: Record<string, any> = {};

    for (const name of classNames)
    {
        const methods = globalThisAny.intuiface_ifd_actions[name] ?? {};
        if (buildType === 'binding-converter')
        {
            for (const methodName of Object.keys(methods))
            {
                methods[methodName].id = `${name}.${methodName}`;
            }
        }

        const resource: Record<string, unknown> = {
            id: name,
            methods
        };

        if (buildType === 'interface-asset')
        {
            resource.events = globalThisAny.intuiface_ifd_triggers[name];
        }

        resources[name] = resource;
    }

    const primaryResourceName = resources[globalThisAny.intuiface_ifd_name]
        ? globalThisAny.intuiface_ifd_name
        : classNames[0];
    const primaryResource = primaryResourceName ? resources[primaryResourceName] : undefined;
    if (primaryResource)
    {
        primaryResource['if.interfaceAsset'] = true;
        if (buildType === 'interface-asset')
        {
            primaryResource.title = globalThisAny.iaTitle;
            primaryResource.description = globalThisAny.iaDescription;
        }
    }

    return resources;
}

/**
 * Creates the final descriptor payload written as `.ifd`.
 * The descriptor structure differs slightly between interface assets and binding converters.
 * @param iaName Name of the built asset.
 * @param buildType Type of artifact currently being generated.
 * @param schemas Generated schemas section.
 * @param resources Generated resources section.
 * @returns The descriptor object ready to be serialized.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function buildIFDFile(
    iaName: string,
    buildType: BuildType,
    schemas: Record<string, any>,
    resources: Record<string, any>
): Record<string, any>
{
    const category = buildType === 'binding-converter'
        ? getWorkspaceCategory() ?? globalThisAny.iaCategory
        : globalThisAny.iaCategory;

    if (buildType === 'binding-converter')
    {
        return {
            'kind': 'discovery#restDescription',
            'discoveryVersion': 'v1',
            'id': `${iaName}js:v1`,
            'name': iaName,
            'version': getWorkspaceVersion(),
            'if.category': category,
            'protocol': 'ts',
            'basePath': iaName,
            'if.dependencies': [
                `${iaName}.js`,
                `${iaName}.module.js`
            ],
            schemas,
            resources
        };
    }

    return {
        'version': `v1.0.${Date.now()}`,
        'name': iaName,
        'title': globalThisAny.iaTitle,
        'if.category': category,
        'protocol': 'ts',
        'basePath': iaName,
        'if.dependencies': [
            `${iaName}.js`,
            `${iaName}.module.js`
        ],
        schemas,
        resources
    };
}

/**
 * Write the ifd file
 * @param iaName 
 * @param ifd 
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function writeIFDFile(iaName: string, ifd: any, spinner: Ora): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        // write the ifd file
        fs.outputFile(`dist/${iaName}/${iaName}.ifd`, JSON.stringify(ifd, null, 2), 'utf8', (err: any) =>
        {
            if (err)
            {
                spinner.fail(`An error occurred while writing JSON Object to File.\n${err}`);
                reject(err);
                return;
            }

            spinner.succeed('Descriptor file (.ifd) has been saved.');
            resolve();
        });
    });
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function migrateProject(): void
{
    const dir = process.env.INIT_CWD;

    const spinner = ora({ text: 'Migrating project to Intuiface CLI...' }).start();
    // check for index_ifd.ts
    if (fs.existsSync(`${dir}/src/index_ifd.ts`))
    {
        spinner.info();
        try
        {
            // read index_ifd.ts to get ia name
            spinner.indent = 3;
            spinner.start('Extract information from current code');
            const indexIFD = fs.readFileSync(`${dir}/src/index_ifd.ts`);
            const regexp = /const ia = (await import\('.\/(?<importName>\w+).js'\))|(new (?<cstrName>\w+)\(\));/g;

            // get line with import of IA file
            if (indexIFD)
            {
                // get ia name with a regexp
                const match = regexp.exec(indexIFD);
                let iaName: string;
                if(match)
                {
                    iaName = match.groups.importName ?? match.groups.cstrName;
                }

                if(iaName == null || iaName === '')
                {
                    throw new Error('Can\'t find IA name from current workspace.');
                }
                spinner.succeed(`Information of Interface Asset '${iaName}' extracted`);

                spinner.start('Update package.json scripts');
                // read the package.json
                const packageJson = fs.readJsonSync(`${dir}/package.json`, { flag: 'r' });
                // edit script build
                packageJson.scripts.build = `npx intuiface-cli build -n ${iaName}`;
                packageJson.scripts['build:debug'] = `npx intuiface-cli build -n ${iaName} -d`;
                // remove old scripts
                delete packageJson.scripts.cleanDist;
                delete packageJson.scripts.cleanTmp;

                // write package.json
                fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2));
                spinner.succeed();

                spinner.start('Update tsconfig.json');
                // read the tsconfig.json
                // Read the tsconfig.json file as a string
                const tsconfigRaw = fs.readFileSync(`${dir}/tsconfig.json`, 'utf8');
                // Remove trailing commas
                const tsconfig = JSON.parse(tsconfigRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'));

                // update tsconfig to match new default
                tsconfig.compilerOptions.outDir = `./dist/${iaName}`;
                tsconfig.compilerOptions.target = 'ES2022';
                tsconfig.compilerOptions.useDefineForClassFields = false;
                tsconfig.include = ['**/src/**/*.ts'];
                // write tsconfig.json
                fs.writeFileSync(`${dir}/tsconfig.json`, JSON.stringify(tsconfig, null, 2));
                spinner.succeed();

                spinner.start('Update webpack.config.js');
                let webpackConfig: string = fs.readFileSync(`${dir}/webpack.config.js`, 'utf8');
                // inject require path
                webpackConfig = `const path = require('path');\n${webpackConfig}`;
                // update output path
                webpackConfig = webpackConfig.replace(/publicPath: "auto",?/g, `publicPath: "auto",\n\t\tpath: path.resolve(__dirname, 'dist/${iaName}')`);
                // Update entry
                webpackConfig = webpackConfig.replace(/entry: '.+'/g, `entry: './src/${iaName}.ts'`);
                // Write new webpack config
                fs.writeFileSync(`${dir}/webpack.config.js`, webpackConfig);
                spinner.succeed();

                spinner.start('Remove unused files');
                // remove index_ifd.ts
                fs.removeSync(`${dir}/src/index_ifd.ts`);
                fs.removeSync(`${dir}/src/index.js`);
                if(fs.existsSync(`${dir}/src/package.json`))
                {
                    fs.removeSync(`${dir}/src/package.json`);
                }
                // remove tsconfig.ifd.json
                fs.removeSync(`${dir}/tsconfig.ifd.json`);
                // clear dist folder
                fs.removeSync(`${dir}/dist`);

                spinner.succeed();

                spinner.indent = 0;
                spinner.succeed('Migration completed.\nRun: \'npm run build\' to build your interface asset with new CLI.');
            }
        } catch (error)
        {
            spinner.fail();
            spinner.fail(`Error: ${error.message}\n${error.stack}`);
            process.exit(-2);
        }
    }
    else
    {
        spinner.succeed('Migration was already done. You can now use the new CLI.');
    }

}

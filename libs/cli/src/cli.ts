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
    .option('-i, --icon [icon]', 'path to the icon of the IA displayed in Composer Interface Asset panel.')
    .option('-d, --debug', 'build in debug mode.')
    .addHelpText('afterAll', '\nExample:\n  intuiface-cli build --name MyCustomIA --icon ./icon.png\n')
    .action((options) =>
    {
        // Check parameters
        if (options.name != null)
        {
            // create object to store metadata
            globalThisAny.intuiface_ifd_name = options.name;
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

            return loadIA(options.name, options.icon, options.debug);
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
                            if (text.startsWith('./') || text.startsWith('../')) {
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
async function loadIA(iaName: string | undefined, icon: string | undefined, debug?: boolean): Promise<void>
{
    const spinner = ora({ text: `Build interface asset ${iaName}.` }).start();
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

            // copy package.json
            await execPromise(`shx cp ${dir}/src/package.json ${dir}/tmp/`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if(!fs.existsSync(`${dir}/tmp/${iaName}.js`))
            {
                spinner.fail(`Fail generating IFD file for ${iaName}. Please check the name is correct and try again`);
                process.exit(-3);
            }
            spinner.succeed('TypeScript compiled.');

            spinner.start('Loading interface asset...');
            // Convert IA path as full URI (with file://) to be able to load it with import
            const iaUrl = pathToFileURL(`${dir}/tmp/${iaName}.js`);
            const ia = await import(iaUrl.toString());

            spinner.start('Loading interface asset metadata...');
            const schemas: any = {};
            const resources: any = {};
            for (const name of globalThisAny.intuiface_ifd_classes)
            {
                schemas[name] = {
                    id: name,
                    type: 'object',
                    description: name,
                    properties: globalThisAny.intuiface_ifd_properties[name]
                };

                resources[name] = {
                    id: name,
                    methods: globalThisAny.intuiface_ifd_actions[name],
                    events: globalThisAny.intuiface_ifd_triggers[name]
                };
            }

            resources[iaName]['if.interfaceAsset'] = true;
            resources[iaName].title = globalThisAny.iaTitle;
            resources[iaName].description = globalThisAny.iaDescription;

            // create the ifd as json object
            // and add metadata filled from decorators
            globalThisAny.intuiface_ifd_file = {
                'version': `v1.0.${Date.now()}`,
                'name': iaName,
                'title': globalThisAny.iaTitle,
                'if.category': globalThisAny.iaCategory,
                'protocol': 'ts',
                'basePath': iaName,
                'if.dependencies': [
                    `${iaName}.js`,
                    `${iaName}.module.js`
                ],
                'schemas': schemas,
                'resources': resources
            };

            let iconName = '';
            if (icon)
            {
                // get the icon name from the icon path
                iconName = icon.substring(icon.lastIndexOf('/') + 1);
                // add the icon to the ifd file
                globalThisAny.intuiface_ifd_file.icons = { x32: iconName };
            }

            spinner.start('Writing descriptor file...');
            // write the ifd file
            await writeIFDFile(iaName, globalThisAny.intuiface_ifd_file, spinner);

            // clean tmp
            if (fs.existsSync(`${dir}/tmp/`))
            {
                fs.removeSync(`${dir}/tmp/`);
            }

            spinner.start(`Building interface asset: ${iaName}...`);
            if (!debug)
            {
                await execPromise(`npx webpack --config ${dir}/webpack.config.js`);
            }
            else
            {
                await execPromise(`npx webpack --config ${dir}/webpack-debug.config.js`);
            }
            spinner.succeed(`Interface asset '${iaName}' successfully built.`);

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

            spinner.succeed(`Done! Your interface asset is in 'dist/${iaName}'.\nCopy this folder into "Documents\\Intuiface\\Interface Assets" to use it in Composer.`);
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
            const regexp = /const ia = await import\('.\/(.*).js'\);/g;

            // get line with import of IA file
            if (indexIFD && indexIFD.includes('const ia = await import('))
            {
                // get ia name with a regexp
                const iaName = regexp.exec(indexIFD)[1];

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

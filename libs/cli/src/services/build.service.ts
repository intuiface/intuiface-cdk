/* eslint-disable camelcase */
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import path from 'path';
import ts from 'typescript';
import { BuildTarget, BuildType } from '../types.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function cleanBuildFolders(dir: string, outputDir: string | undefined): void
{
    if (outputDir)
    {
        const resolvedOutputDir = path.isAbsolute(outputDir)
            ? outputDir
            : path.join(dir, outputDir);

        if (fs.existsSync(resolvedOutputDir))
        {
            fs.removeSync(resolvedOutputDir);
        }
    }

    if (fs.existsSync(path.join(dir, 'tmp')))
    {
        fs.removeSync(path.join(dir, 'tmp'));
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function resetBuildMetadata(target: BuildTarget): void
{
    const globalThisAny = globalThis as any;
    globalThisAny.intuiface_ifd_name = target.name;
    globalThisAny.intuiface_build_type = target.buildType;
    globalThisAny.intuiface_ifd_classes = [];
    globalThisAny.intuiface_ifd_properties = {};
    globalThisAny.intuiface_ifd_actions = {};
    globalThisAny.intuiface_ifd_params = {};
    globalThisAny.intuiface_ifd_triggers = {};
    globalThisAny.iaTitle = undefined;
    globalThisAny.iaDescription = undefined;
    globalThisAny.iaCategory = undefined;

    globalThisAny.window = new JSDOM('', { url: 'https://web.intuiface.com/' }).window;
    for (const key in globalThisAny.window)
    {
        if (Object.prototype.hasOwnProperty.call(globalThisAny.window, key) && globalThisAny[key] === undefined)
        {
            globalThisAny[key] = globalThisAny.window[key];
        }
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function transpileTypeScript(tsConfigPath: string, outDir: string, spinner: any): void
{
    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    if (configFile.error)
    {
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
            (context): ts.Transformer<ts.SourceFile> =>
            {
                const visit = (node: ts.Node): ts.Node =>
                {
                    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node))
                    {
                        const moduleSpecifier = node.moduleSpecifier;
                        if (moduleSpecifier && ts.isStringLiteral(moduleSpecifier))
                        {
                            const text = moduleSpecifier.text;
                            if ((text.startsWith('./') || text.startsWith('../')) && !text.endsWith('.js') && !text.endsWith('.json'))
                            {
                                const updatedSpecifier = ts.factory.createStringLiteral(`${text}.js`);
                                if (ts.isImportDeclaration(node))
                                {
                                    return ts.factory.updateImportDeclaration(
                                        node,
                                        node.modifiers,
                                        node.importClause,
                                        updatedSpecifier,
                                        node.attributes
                                    );
                                }

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

                    return ts.visitEachChild(node, visit, context);
                };

                return (node: ts.SourceFile) => ts.visitNode(node, visit) as ts.SourceFile;
            }
        ]
    });

    const allDiagnostics = ts.getPreEmitDiagnostics(tsProgram).concat(emitResult.diagnostics);
    const hasErrors = allDiagnostics.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
    if (hasErrors)
    {
        spinner.fail();
        spinner.text = '';
    }

    spinner.indent = 3;
    allDiagnostics.forEach((diagnostic) =>
    {
        if (diagnostic.file)
        {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            spinner.fail(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else
        {
            spinner.fail(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    });
    spinner.indent = 0;

    if (hasErrors || emitResult.emitSkipped)
    {
        throw new Error('TypeScript compilation failed.');
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function resolveTranspiledEntryPath(entryFile: string): string
{
    const expectedPath = path.join(process.cwd(), 'tmp', entryFile.replace('src/', '').replace(/\.ts$/, '.js'));
    if (fs.existsSync(expectedPath))
    {
        return expectedPath;
    }

    // In workspace mode, TypeScript may emit directly under tmp/ using only filename.
    const flattenedPath = path.join(process.cwd(), 'tmp', path.basename(entryFile).replace(/\.ts$/, '.js'));
    return flattenedPath;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function resolveBuildIcon(buildType: BuildType, icon: string | undefined, dir: string): string | undefined
{
    if (icon)
    {
        return icon;
    }

    const defaultBindingConverterIcon = 'icon_converter_32.png';
    if (buildType === 'binding-converter' && fs.existsSync(path.join(dir, defaultBindingConverterIcon)))
    {
        return defaultBindingConverterIcon;
    }

    return undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeGeneratedWebpackConfig(target: BuildTarget, dir: string, tmpDir: string): string
{
    const webpackConfigPath = path.join(tmpDir, `webpack.${target.name}.cjs`);
    const outputPath = path.resolve(dir, target.outputDir);
    const entryPath = path.resolve(dir, target.entryFile);
    const webpackConfig = `const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;\n\nmodule.exports = {\n  mode: 'production',\n  module: {\n    rules: [{\n      test: /\\.tsx?$/,\n      use: 'ts-loader',\n      exclude: /node_modules/\n    }]\n  },\n  output: {\n    publicPath: 'auto',\n    path: ${JSON.stringify(outputPath)}\n  },\n  resolve: {\n    extensions: ['.tsx', '.ts', '.js']\n  },\n  plugins: [\n    new ModuleFederationPlugin({\n      name: ${JSON.stringify(target.name)},\n      filename: ${JSON.stringify(`${target.name}.js`)},\n      exposes: {\n        ${JSON.stringify(`./${target.name}`)}: {\n          import: ${JSON.stringify(entryPath)},\n          name: ${JSON.stringify(`${target.name}.module`)}\n        }\n      },\n      shared: {\n        '@intuiface/core': {\n          singleton: true,\n          strictVersion: false\n        }\n      }\n    })\n  ],\n  entry: ${JSON.stringify(entryPath)}\n};\n`;

    fs.writeFileSync(webpackConfigPath, webpackConfig, 'utf8');
    return webpackConfigPath;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeGeneratedWebpackDebugConfig(target: BuildTarget, dir: string, tmpDir: string): string
{
    const webpackConfigPath = path.join(tmpDir, `webpack-debug.${target.name}.cjs`);
    const outputPath = path.resolve(dir, target.outputDir);
    const entryPath = path.resolve(dir, target.entryFile);
    const webpackConfig = `const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;\n\nmodule.exports = {\n  mode: 'development',\n  devtool: 'inline-source-map',\n  module: {\n    rules: [{\n      test: /\\.tsx?$/,\n      use: 'ts-loader',\n      exclude: /node_modules/\n    }]\n  },\n  output: {\n    publicPath: 'auto',\n    path: ${JSON.stringify(outputPath)}\n  },\n  resolve: {\n    extensions: ['.tsx', '.ts', '.js']\n  },\n  plugins: [\n    new ModuleFederationPlugin({\n      name: ${JSON.stringify(target.name)},\n      filename: ${JSON.stringify(`${target.name}.js`)},\n      exposes: {\n        ${JSON.stringify(`./${target.name}`)}: {\n          import: ${JSON.stringify(entryPath)},\n          name: ${JSON.stringify(`${target.name}.module`)}\n        }\n      },\n      shared: {\n        '@intuiface/core': {\n          singleton: true,\n          strictVersion: false\n        }\n      }\n    })\n  ],\n  entry: ${JSON.stringify(entryPath)}\n};\n`;

    fs.writeFileSync(webpackConfigPath, webpackConfig, 'utf8');
    return webpackConfigPath;
}

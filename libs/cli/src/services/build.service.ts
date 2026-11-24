/* eslint-disable camelcase */
import fs from 'fs-extra';
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
export async function resetBuildMetadata(target: BuildTarget): Promise<void>
{
    // Loaded on demand: importing jsdom takes more than a second, and only builds need it (not init, add, help, ...)
    const { JSDOM } = await import('jsdom');

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

export interface GeneratedWebpackConfigOptions
{
    /** Debug build: development mode with inline source maps. */
    debug?: boolean;
    /** Workspace customisation (webpack.config.cjs) applied to the generated configuration. */
    customizationPath?: string;
}

/**
 * Write the webpack configuration of an item in `tmpDir`: production (`webpack.<name>.cjs`) or debug (`webpack-debug.<name>.cjs`).
 * With a customisation, the file exports a function that passes the generated configuration to it, and webpack builds
 * the configuration it returns.
 * @returns the path of the configuration file
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeGeneratedWebpackConfig(target: BuildTarget, dir: string, tmpDir: string, options: GeneratedWebpackConfigOptions = {}): string
{
    const debug = options.debug === true;
    const webpackConfigPath = path.join(tmpDir, `${debug ? 'webpack-debug' : 'webpack'}.${target.name}.cjs`);
    const outputPath = path.resolve(dir, target.outputDir);
    const entryPath = path.resolve(dir, target.entryFile);
    const lines = [
        `const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;`,
        '',
        'const config = {',
        `  mode: ${debug ? `'development'` : `'production'`},`,
        ...(debug ? [`  devtool: 'inline-source-map',`] : []),
        '  module: {',
        '    rules: [{',
        '      test: /\\.tsx?$/,',
        `      use: 'ts-loader',`,
        '      exclude: /node_modules/',
        '    }]',
        '  },',
        '  output: {',
        `    publicPath: 'auto',`,
        `    path: ${JSON.stringify(outputPath)}`,
        '  },',
        '  resolve: {',
        `    extensions: ['.tsx', '.ts', '.js']`,
        '  },',
        '  plugins: [',
        '    new ModuleFederationPlugin({',
        `      name: ${JSON.stringify(target.name)},`,
        `      filename: ${JSON.stringify(`${target.name}.js`)},`,
        '      exposes: {',
        `        ${JSON.stringify(`./${target.name}`)}: {`,
        `          import: ${JSON.stringify(entryPath)},`,
        `          name: ${JSON.stringify(`${target.name}.module`)}`,
        '        }',
        '      },',
        '      shared: {',
        `        '@intuiface/core': {`,
        '          singleton: true,',
        '          strictVersion: false',
        '        }',
        '      }',
        '    })',
        '  ],',
        `  entry: ${JSON.stringify(entryPath)}`,
        '};',
        '',
        ...(options.customizationPath
            ? createCustomizationExport(target, options.customizationPath, debug)
            : ['module.exports = config;']),
        ''
    ];

    fs.writeFileSync(webpackConfigPath, lines.join('\n'), 'utf8');
    return webpackConfigPath;
}

/**
 * Export of a generated webpack configuration customised by the workspace webpack.config.cjs:
 * `(config, { item, debug }) => config`, which may also change `config` in place or be async.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createCustomizationExport(target: BuildTarget, customizationPath: string, debug: boolean): string[]
{
    const item = { name: target.name, type: target.buildType, entry: target.entryFile.replace(/\\/g, '/') };
    const fileName = JSON.stringify(path.basename(customizationPath));
    return [
        `const customizationPath = ${JSON.stringify(customizationPath)};`,
        `const item = ${JSON.stringify(item)};`,
        '',
        'module.exports = async () =>',
        '{',
        '  const customize = require(customizationPath);',
        `  if (typeof customize !== 'function')`,
        '  {',
        `    throw new Error(${fileName} + ' must export a function: module.exports = (config, { item, debug }) => config;');`,
        '  }',
        '',
        `  const customized = await customize(config, { item: item, debug: ${debug} });`,
        '  const result = customized === undefined ? config : customized;',
        `  if (result === null || typeof result !== 'object' || Array.isArray(result))`,
        '  {',
        `    throw new Error('The function of ' + ${fileName} + ' must return the webpack configuration of ' + item.name + '.');`,
        '  }',
        '  return result;',
        '};'
    ];
}

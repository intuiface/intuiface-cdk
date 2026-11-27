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

/**
 * Folder of `tmp/` the JavaScript of an item is compiled to, for Node.js to load it and generate its descriptor.
 *
 * Each item has its own folder (review O16). Node.js caches ES modules by URL: with one folder for every item, a module
 * shared by two items of `build --all` (e.g. a class with `@Asset` used as `itemType`) was evaluated for the first item
 * only, and the next ones got it from the cache. Its decorators did not run again after {@link resetBuildMetadata}, so
 * the descriptor of the next items missed what it declares. Each item now loads its own copy, as its bundle has one.
 * @param tmpDir the `tmp/` folder of the workspace
 * @param itemName name of the item
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getItemModuleDir(tmpDir: string, itemName: string): string
{
    // Workspace item names are letters and digits; the name given to a build outside a workspace is not checked
    return path.join(tmpDir, itemName.replace(/[^A-Za-z0-9_-]/g, '_'));
}

/** Globals copied from a JSDOM window: the next build replaces them with those of its own window. */
const jsdomGlobalKeys = new Set<string>();

/**
 * Reset the globals of the build: the metadata the decorators fill, and a browser-like environment (a new JSDOM).
 *
 * The item is loaded in this process: `build --all` calls this before each item, so that no item sees the metadata
 * or the DOM of the previous one.
 * @param target item to build
 */
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

    // The previous window is not closed: a module of the previous item kept in the import cache may still use it.
    const jsdomWindow = new JSDOM('', { url: 'https://web.intuiface.com/' }).window;
    globalThisAny.window = jsdomWindow;
    for (const key in jsdomWindow)
    {
        // Node.js globals (console, setTimeout, crypto, ...) are kept; the globals of the previous window are replaced.
        if (Object.prototype.hasOwnProperty.call(jsdomWindow, key) && (jsdomGlobalKeys.has(key) || globalThisAny[key] === undefined))
        {
            globalThisAny[key] = jsdomWindow[key];
            jsdomGlobalKeys.add(key);
        }
    }
}

/**
 * Compile an item to JavaScript in `outDir`, for Node.js to load it and generate its descriptor.
 *
 * The program holds every file of tsconfig.json, as `tsc` does: the item sees the same declarations (global types,
 * ambient modules). But only the files of the item, its entry and the files it imports, are checked and emitted:
 * an error in another item of the workspace does not stop this one.
 * @param tsConfigPath tsconfig.json of the project
 * @param entryFile entry file of the item
 * @param outDir folder of the JavaScript files
 * @param spinner spinner reporting the TypeScript errors
 * @returns the JavaScript file of the entry, wherever tsconfig.json puts it (`rootDir`), or undefined when the entry
 * is not compiled (it does not exist, or tsconfig.json does not include it)
 * @throws when the item does not compile
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function transpileTypeScript(tsConfigPath: string, entryFile: string, outDir: string, spinner: any): string | undefined
{
    const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
    if (configFile.error)
    {
        throw new Error(`Error reading tsconfig.json: ${configFile.error.messageText}`);
    }

    // Without the tsconfig.json path, TypeScript 6 computes the default rootDir from the source files, as TypeScript 5 does:
    // 2.x projects without rootDir keep the same output layout.
    const parsedCommandLine = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        process.cwd()
    );

    const options: ts.CompilerOptions = {
        ...parsedCommandLine.options,
        outDir: outDir,
        skipLibCheck: true
    };
    const host = createCachingCompilerHost(options);
    const tsProgram = ts.createProgram({ rootNames: parsedCommandLine.fileNames, options: options, host: host });
    const entrySourceFile = tsProgram.getSourceFile(path.resolve(entryFile));
    const itemSourceFiles = entrySourceFile ? getItemSourceFiles(tsProgram, entrySourceFile, host) : [];

    let entryOutputPath: string | undefined;
    let emitSkipped = false;
    const diagnostics: ts.Diagnostic[] = [...tsProgram.getOptionsDiagnostics(), ...tsProgram.getGlobalDiagnostics()];
    const transformers: ts.CustomTransformers = { after: [addJsExtensionToRelativeImports] };
    for (const sourceFile of itemSourceFiles)
    {
        const writeFile: ts.WriteFileCallback = (fileName, text, writeByteOrderMark, onError, sourceFiles, data) =>
        {
            host.writeFile(fileName, text, writeByteOrderMark, onError, sourceFiles, data);
            if (sourceFile === entrySourceFile && /\.[cm]?jsx?$/.test(fileName))
            {
                entryOutputPath = path.normalize(fileName);
            }
        };
        const emitResult = tsProgram.emit(sourceFile, writeFile, undefined, false, transformers);
        emitSkipped ||= emitResult.emitSkipped;
        diagnostics.push(...ts.getPreEmitDiagnostics(tsProgram, sourceFile), ...emitResult.diagnostics);
    }

    const allDiagnostics = ts.sortAndDeduplicateDiagnostics(diagnostics);
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

    if (hasErrors || emitSkipped)
    {
        throw new TypeScriptCompilationError(allDiagnostics);
    }

    return entryOutputPath;
}

/**
 * Errors of a tsconfig.json written for TypeScript 5 (2.x projects) with TypeScript 6: deprecated or removed options
 * (5101, 5102, 5107, 5108), and Node.js types no longer loaded by default (2580, 2591).
 */
const TYPESCRIPT_6_CONFIGURATION_ERROR_CODES = [5101, 5102, 5107, 5108, 2580, 2591];

/**
 * Failure of {@link transpileTypeScript}, once its errors are reported.
 */
export class TypeScriptCompilationError extends Error
{
    public constructor(public readonly diagnostics: readonly ts.Diagnostic[])
    {
        super('TypeScript compilation failed.');
        this.name = 'TypeScriptCompilationError';
    }

    /** True when tsconfig.json needs changes to compile with TypeScript 6. */
    public get isTypeScript6ConfigurationError(): boolean
    {
        return this.diagnostics.some((diagnostic) => TYPESCRIPT_6_CONFIGURATION_ERROR_CODES.includes(diagnostic.code));
    }
}

/**
 * Compiler host that parses each file once, for the two programs of {@link transpileTypeScript}.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createCachingCompilerHost(options: ts.CompilerOptions): ts.CompilerHost
{
    const host = ts.createCompilerHost(options);
    const getSourceFile = host.getSourceFile.bind(host);
    const sourceFiles = new Map<string, ts.SourceFile | undefined>();
    host.getSourceFile = (fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile): ts.SourceFile | undefined =>
    {
        if (shouldCreateNewSourceFile || !sourceFiles.has(fileName))
        {
            sourceFiles.set(fileName, getSourceFile(fileName, languageVersionOrOptions, onError, shouldCreateNewSourceFile));
        }
        return sourceFiles.get(fileName);
    };
    return host;
}

/**
 * Source files of an item: its entry and the files it imports, directly or not, found by TypeScript in a program rooted
 * at the entry. Declaration files and packages are left out: they are not emitted.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getItemSourceFiles(tsProgram: ts.Program, entrySourceFile: ts.SourceFile, host: ts.CompilerHost): ts.SourceFile[]
{
    const itemProgram = ts.createProgram({ rootNames: [entrySourceFile.fileName], options: tsProgram.getCompilerOptions(), host: host });
    return itemProgram.getSourceFiles()
        .filter((sourceFile) => !sourceFile.isDeclarationFile && !itemProgram.isSourceFileFromExternalLibrary(sourceFile))
        .map((sourceFile) => tsProgram.getSourceFile(sourceFile.fileName))
        .filter((sourceFile): sourceFile is ts.SourceFile => sourceFile != null);
}

/**
 * Add `.js` to relative imports and exports of the emitted JavaScript: Node.js ESM requires the extension.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function addJsExtensionToRelativeImports(context: ts.TransformationContext): ts.Transformer<ts.SourceFile>
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
        '      // The CLI has type-checked the item: ts-loader only transpiles its files, so another item does not stop the build.',
        '      // The player does not read the decorator metadata (design:type, ...): without it, the file-by-file transpilation',
        '      // does not import the interfaces used in decorated members (webpack warning "export ... was not found").',
        '      use: {',
        `        loader: 'ts-loader',`,
        '        options: { transpileOnly: true, compilerOptions: { emitDecoratorMetadata: false } }',
        '      },',
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

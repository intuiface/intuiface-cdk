import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { isDeepStrictEqual } from 'util';
import { WorkspaceItem } from '../types.js';
import { DependencyUpdate, ensureMinimumDependencies } from '../utils/dependencies.js';
import { addMissingValues, appendMissingLines, mergeJsonText, parseJsonObject, stringifyJsonLike } from '../utils/merge.js';

/**
 * Minimum Node.js major version required by the Intuiface CLI and generated workspaces.
 * This is the single source of truth — it drives .nvmrc content, package.json engines,
 * and the startup version check in cli.ts.
 */
export const MIN_NODE_MAJOR = 22;

/**
 * Build toolchain of a workspace, aligned with the schematics templates.
 * Shared by `init` (new workspaces) and `migrate` (existing projects).
 */
export const WORKSPACE_BUILD_DEV_DEPENDENCIES: Readonly<Record<string, string>> = {
    'ts-loader': '^9.6.2',
    'typescript': '6.0.3',
    'webpack': '^5.109.2',
    'webpack-cli': '^7.2.2'
};

/**
 * Lint toolchain of a workspace (ESLint 9 flat config, see templates/workspace/eslint.config.mjs).
 */
export const WORKSPACE_LINT_DEV_DEPENDENCIES: Readonly<Record<string, string>> = {
    '@stylistic/eslint-plugin': '^5.10.0',
    '@typescript-eslint/eslint-plugin': '^8.66.0',
    '@typescript-eslint/parser': '^8.66.0',
    'eslint': '^9.39.5',
    'eslint-plugin-import': '^2.32.0',
    'eslint-plugin-prefer-arrow': '^1.2.3',
    'globals': '^17.9.0'
};

interface TemplateRenderContext
{
    [key: string]: string;
}

/**
 * What happened to a generated file: created, merged into an existing file, or existing file kept unchanged.
 */
export type GeneratedFileAction = 'create' | 'update' | 'keep';

export interface GeneratedTemplateFile
{
    relativePath: string;
    /** Size of the file on disk. */
    bytes: number;
    action: GeneratedFileAction;
}

export interface WorkspacePackageJsonFile extends GeneratedTemplateFile
{
    /** Dependencies added or raised in an existing package.json. */
    dependencyUpdates: DependencyUpdate[];
    /** Workspace scripts that an existing package.json defines differently (its own value is kept). */
    keptScripts: string[];
}

export interface WorkspacePackageJson
{
    name: string;
    version: string;
    private: boolean;
    engines: Record<string, string>;
    scripts: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}

type WrittenFile = Omit<GeneratedTemplateFile, 'relativePath'>;

type TemplateFileWriter = (destinationPath: string, content: string | Buffer) => WrittenFile;

interface WorkspaceItemTemplateOptions
{
    category?: string;
}

const TEXT_TEMPLATE_EXTENSIONS = new Set([
    '.ts',
    '.tsx',
    '.js',
    '.cjs',
    '.mjs',
    '.json',
    '.md',
    '.txt',
    '.yml',
    '.yaml',
    '.xml',
    '.html',
    '.css',
    '.scss'
]);

/**
 * Template files stored without their leading dot, renamed when copied:
 * npm never publishes `.gitignore` files, so the template would be missing from the CLI package.
 */
const DOTFILE_TEMPLATE_NAMES: Readonly<Record<string, string>> = {
    gitignore: '.gitignore'
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scaffoldWorkspaceItemFromTemplate(
    item: WorkspaceItem,
    destinationDir: string,
    options?: WorkspaceItemTemplateOptions
): GeneratedTemplateFile[]
{
    const templateDir = getWorkspaceItemTemplateDirectory(item.type);
    if (!fs.existsSync(templateDir))
    {
        throw new Error(`Workspace item template directory was not found for '${item.type}' at '${templateDir}'.`);
    }

    fs.ensureDirSync(destinationDir);
    return copyTemplateDirectory(templateDir, destinationDir, createWorkspaceItemTemplateContext(item, options), '', overwriteFile);
}

/**
 * Copy the workspace configuration files (ESLint, VS Code, .gitignore) without losing existing ones:
 * see {@link writeWorkspaceFile}.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scaffoldWorkspaceTemplate(workspaceName: string, destinationDir: string): GeneratedTemplateFile[]
{
    const templateDir = getWorkspaceTemplateDirectory();
    if (!fs.existsSync(templateDir))
    {
        throw new Error(`Workspace template directory was not found at '${templateDir}'.`);
    }

    fs.ensureDirSync(destinationDir);
    return copyTemplateDirectory(templateDir, destinationDir, createWorkspaceTemplateContext(workspaceName), '', writeWorkspaceFile);
}

/**
 * Write a workspace file and keep what the developer already has, as the former schematics did:
 * - a missing or blank file is written,
 * - an existing JSON file gets the template values it does not have (its own values win),
 * - an existing `.gitignore` gets the template entries it does not have,
 * - any other existing file is kept unchanged.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeWorkspaceFile(destinationPath: string, content: string | Buffer): WrittenFile
{
    if (!fs.existsSync(destinationPath))
    {
        return overwriteFile(destinationPath, content);
    }

    const existingContent = fs.readFileSync(destinationPath);
    if (existingContent.toString('utf8').trim() === '')
    {
        return overwriteFile(destinationPath, content);
    }

    const mergedText = typeof content === 'string'
        ? mergeTextFile(path.basename(destinationPath), existingContent.toString('utf8'), content)
        : undefined;
    if (mergedText == null)
    {
        return { action: 'keep', bytes: existingContent.length };
    }

    fs.writeFileSync(destinationPath, mergedText, 'utf8');
    return { action: 'update', bytes: Buffer.byteLength(mergedText, 'utf8') };
}

/**
 * Print a generated file as the schematics did, e.g. `CREATE .gitignore (52 bytes)`.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function logGeneratedFile(file: GeneratedTemplateFile): void
{
    const relativePath = file.relativePath.replace(/\\/g, '/');
    switch (file.action)
    {
        case 'create':
            console.log(`${chalk.green('CREATE')} ${relativePath} (${file.bytes} bytes)`);
            break;
        case 'update':
            console.log(`${chalk.blue('UPDATE')} ${relativePath} (${file.bytes} bytes)`);
            break;
        default:
            console.log(`${chalk.dim('SKIP')} ${relativePath} (existing file kept)`);
            break;
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function mergeTextFile(fileName: string, existingText: string, templateText: string): string | undefined
{
    if (fileName.toLowerCase().endsWith('.json'))
    {
        return mergeJsonText(existingText, templateText);
    }

    if (fileName === '.gitignore')
    {
        return appendMissingLines(existingText, templateText, '# Intuiface workspace');
    }

    return undefined;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function overwriteFile(destinationPath: string, content: string | Buffer): WrittenFile
{
    const action: GeneratedFileAction = fs.existsSync(destinationPath) ? 'update' : 'create';
    fs.writeFileSync(destinationPath, content);
    return {
        action: action,
        bytes: typeof content === 'string' ? Buffer.byteLength(content, 'utf8') : content.length
    };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function copyTemplateDirectory(
    sourceDir: string,
    destinationDir: string,
    context: TemplateRenderContext,
    relativeDir: string,
    writeFile: TemplateFileWriter
): GeneratedTemplateFile[]
{
    const generatedFiles: GeneratedTemplateFile[] = [];

    for (const sourceName of fs.readdirSync(sourceDir))
    {
        const renderedName = DOTFILE_TEMPLATE_NAMES[sourceName] ?? renderTemplateValue(sourceName, context);
        const sourcePath = path.join(sourceDir, sourceName);
        const relativePath = path.join(relativeDir, renderedName);
        const destinationPath = path.join(destinationDir, renderedName);

        if (fs.statSync(sourcePath).isDirectory())
        {
            fs.ensureDirSync(destinationPath);
            generatedFiles.push(...copyTemplateDirectory(sourcePath, destinationPath, context, relativePath, writeFile));
            continue;
        }

        const content = isTextTemplateFile(sourcePath)
            ? renderTemplateValue(fs.readFileSync(sourcePath, 'utf8'), context)
            : fs.readFileSync(sourcePath);
        generatedFiles.push({ relativePath, ...writeFile(destinationPath, content) });
    }

    return generatedFiles;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createWorkspaceItemTemplateContext(item: WorkspaceItem, options?: WorkspaceItemTemplateOptions): TemplateRenderContext
{
    return {
        ITEM_NAME: item.name,
        // Member names must be camelCase (workspace lint rule), e.g. a converter method named after its class
        ITEM_NAME_CAMEL: `${item.name.charAt(0).toLowerCase()}${item.name.slice(1)}`,
        // Free text inserted between single quotes in the item templates
        ITEM_CATEGORY: escapeSingleQuotedString(options?.category ?? 'Custom')
    };
}

/**
 * Escape a value so it can be inserted in a single-quoted string of a generated TypeScript file
 * (e.g. a category `Bob's tools` would otherwise produce invalid code).
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function escapeSingleQuotedString(value: string): string
{
    return value
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\\'')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createWorkspaceTemplateContext(workspaceName: string): TemplateRenderContext
{
    return {
        WORKSPACE_NAME: workspaceName,
        NODE_VERSION: getWorkspaceNodeVersion(),
        NODE_ENGINE_RANGE: getWorkspaceNodeEngineRange()
    };
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getWorkspaceItemTemplateDirectory(itemType: WorkspaceItem['type']): string
{
    const serviceDirectory = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(serviceDirectory, '..', 'templates', 'workspace-items', itemType);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function getWorkspaceTemplateDirectory(): string
{
    const serviceDirectory = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(serviceDirectory, '..', 'templates', 'workspace');
}

/**
 * @param relativePath path of a file in templates/workspace, e.g. `webpack.config.cjs`
 * @returns the content of the template file (it has no placeholder)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function readWorkspaceTemplateFile(relativePath: string): string
{
    return fs.readFileSync(path.join(getWorkspaceTemplateDirectory(), relativePath), 'utf8');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function isTextTemplateFile(sourcePath: string): boolean
{
    const extension = path.extname(sourcePath).toLowerCase();
    return TEXT_TEMPLATE_EXTENSIONS.has(extension) || Object.keys(DOTFILE_TEMPLATE_NAMES).includes(path.basename(sourcePath));
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function renderTemplateValue(value: string, context: TemplateRenderContext): string
{
    let renderedValue = value;

    for (const [key, replacement] of Object.entries(context))
    {
        renderedValue = renderedValue.replace(new RegExp(`__${key}__`, 'g'), replacement);
    }

    return renderedValue;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function buildWorkspaceTsConfig(): string
{
    return `${JSON.stringify({
        compileOnSave: false,
        compilerOptions: {
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            rootDir: './src',
            outDir: './dist',
            noImplicitAny: true,
            target: 'ES2022',
            useDefineForClassFields: false,
            module: 'es2020',
            lib: ['es2020', 'dom'],
            // TypeScript 6 loads no @types package by default: Node.js modules (e.g. `fs`, made webpack externals) need these types
            types: ['node'],
            allowJs: true,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            declaration: false,
            moduleResolution: 'bundler',
            importHelpers: true
        },
        exclude: ['node_modules'],
        include: ['**/src/**/*.ts']
    }, null, 2)}\n`;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getPublishedPackageVersion(): string
{
    const packageJsonPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath, { throws: false });
    const version = packageJson?.version;

    return typeof version === 'string' && version !== ''
        ? version
        : 'latest';
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getWorkspaceNodeVersion(): string
{
    // Returns the pinned minimum major version so generated .nvmrc is stable
    // regardless of which Node the developer happened to run the CLI with.
    return `${MIN_NODE_MAJOR}`;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getWorkspaceNodeEngineRange(): string
{
    return `>=${MIN_NODE_MAJOR}`;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function createWorkspacePackageJson(workspaceName: string): WorkspacePackageJson
{
    const version = getPublishedPackageVersion();
    return {
        name: workspaceName,
        version: '1.0.0',
        private: true,
        engines: {
            node: getWorkspaceNodeEngineRange()
        },
        scripts: {
            'build': 'npx intuiface-cli build --all',
            'build:debug': 'npx intuiface-cli build --all --debug',
            'lint': 'npx eslint .'
        },
        dependencies: {
            '@intuiface/cli': version,
            '@intuiface/core': version,
            'tslib': '^2.6.2'
        },
        devDependencies: {
            '@types/node': '^24.13.3',
            ...WORKSPACE_LINT_DEV_DEPENDENCIES,
            ...WORKSPACE_BUILD_DEV_DEPENDENCIES
        }
    };
}

/**
 * Write the package.json of a new workspace, or complete the one already in the folder:
 * - its values are kept, scripts included, and the missing workspace values are added,
 * - dependencies are added, or raised when lower than the workspace ones, and never downgraded.
 * @throws when the existing package.json is not a JSON object (nothing is written)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeWorkspacePackageJson(dir: string, workspaceName: string): WorkspacePackageJsonFile
{
    const packageJsonPath = path.join(dir, 'package.json');
    const { dependencies, devDependencies, ...settings } = createWorkspacePackageJson(workspaceName);
    const isExisting = fs.existsSync(packageJsonPath);
    const existingText = isExisting ? fs.readFileSync(packageJsonPath, 'utf8') : '';
    const existing = existingText.trim() === '' ? {} : parseJsonObject(existingText);
    if (!existing)
    {
        throw new Error(`Cannot update '${packageJsonPath}': it is not a valid JSON object.`);
    }

    const packageJson = addMissingValues(existing, settings);
    const dependencyUpdates = [
        ...ensureMinimumDependencies(packageJson, 'dependencies', dependencies),
        ...ensureMinimumDependencies(packageJson, 'devDependencies', devDependencies)
    ];
    const scripts = packageJson.scripts as Record<string, unknown>;
    const keptScripts = Object.keys(settings.scripts).filter((name) => scripts[name] !== settings.scripts[name]);

    if (isExisting && isDeepStrictEqual(packageJson, existing))
    {
        return { relativePath: 'package.json', bytes: Buffer.byteLength(existingText, 'utf8'), action: 'keep', dependencyUpdates: [], keptScripts: keptScripts };
    }

    const text = existingText.trim() === ''
        ? `${JSON.stringify(packageJson, null, 2)}\n`
        : stringifyJsonLike(packageJson, existingText);
    fs.writeFileSync(packageJsonPath, text, 'utf8');

    return {
        relativePath: 'package.json',
        bytes: Buffer.byteLength(text, 'utf8'),
        action: isExisting ? 'update' : 'create',
        dependencyUpdates: existingText.trim() === '' ? [] : dependencyUpdates,
        keptScripts: keptScripts
    };
}

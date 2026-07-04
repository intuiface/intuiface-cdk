import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { WorkspaceItem } from '../types.js';

/**
 * Minimum Node.js major version required by the Intuiface CLI and generated workspaces.
 * This is the single source of truth — it drives .nvmrc content, package.json engines,
 * and the startup version check in cli.ts.
 */
export const MIN_NODE_MAJOR = 22;

interface TemplateRenderContext
{
    [key: string]: string;
}

interface GeneratedTemplateFile
{
    relativePath: string;
    bytes: number;
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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scaffoldWorkspaceItemFromTemplate(item: WorkspaceItem, destinationDir: string): GeneratedTemplateFile[]
{
    const templateDir = getWorkspaceItemTemplateDirectory(item.type);
    if (!fs.existsSync(templateDir))
    {
        throw new Error(`Workspace item template directory was not found for '${item.type}' at '${templateDir}'.`);
    }

    fs.ensureDirSync(destinationDir);
    return copyTemplateDirectory(templateDir, destinationDir, createWorkspaceItemTemplateContext(item), '');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scaffoldWorkspaceTemplate(workspaceName: string, destinationDir: string): GeneratedTemplateFile[]
{
    const templateDir = getWorkspaceTemplateDirectory();
    if (!fs.existsSync(templateDir))
    {
        throw new Error(`Workspace template directory was not found at '${templateDir}'.`);
    }

    fs.ensureDirSync(destinationDir);
    return copyTemplateDirectory(templateDir, destinationDir, createWorkspaceTemplateContext(workspaceName), '');
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function copyTemplateDirectory(
    sourceDir: string,
    destinationDir: string,
    context: TemplateRenderContext,
    relativeDir: string
): GeneratedTemplateFile[]
{
    const generatedFiles: GeneratedTemplateFile[] = [];

    for (const sourceName of fs.readdirSync(sourceDir))
    {
        const renderedName = renderTemplateValue(sourceName, context);
        const sourcePath = path.join(sourceDir, sourceName);
        const relativePath = path.join(relativeDir, renderedName);
        const destinationPath = path.join(destinationDir, renderedName);

        if (fs.statSync(sourcePath).isDirectory())
        {
            fs.ensureDirSync(destinationPath);
            generatedFiles.push(...copyTemplateDirectory(sourcePath, destinationPath, context, relativePath));
            continue;
        }

        if (isTextTemplateFile(sourcePath))
        {
            const sourceText = fs.readFileSync(sourcePath, 'utf8');
            const renderedText = renderTemplateValue(sourceText, context);
            fs.writeFileSync(destinationPath, renderedText, 'utf8');
            generatedFiles.push({
                relativePath: relativePath,
                bytes: Buffer.byteLength(renderedText, 'utf8')
            });
            continue;
        }

        fs.copyFileSync(sourcePath, destinationPath);
        generatedFiles.push({
            relativePath: relativePath,
            bytes: fs.statSync(destinationPath).size
        });
    }

    return generatedFiles;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createWorkspaceItemTemplateContext(item: WorkspaceItem): TemplateRenderContext
{
    return {
        ITEM_NAME: item.name,
        ITEM_CATEGORY: item.category ?? ''
    };
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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function isTextTemplateFile(sourcePath: string): boolean
{
    const extension = path.extname(sourcePath).toLowerCase();
    return TEXT_TEMPLATE_EXTENSIONS.has(extension);
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
            lib: ['es2018', 'dom'],
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
export function createWorkspacePackageJson(workspaceName: string): Record<string, unknown>
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
            'lint': 'npx eslint -c .eslintrc.cjs --ext .ts . --ignore-pattern node_modules --ignore-pattern dist'
        },
        dependencies: {
            '@intuiface/cli': version,
            '@intuiface/core': version,
            'tslib': '^2.6.2'
        },
        devDependencies: {
            '@stylistic/eslint-plugin': '^1.8.1',
            '@typescript-eslint/eslint-plugin': '^8.61.1',
            '@typescript-eslint/parser': '^8.61.1',
            '@types/node': '^22.10.1',
            'eslint': '^8.57.0',
            'eslint-plugin-import': '^2.32.0',
            'eslint-plugin-prefer-arrow': '^1.2.3',
            'ts-loader': '^9.5.1',
            'typescript': '^5.8.0',
            'webpack': '^5.99.0',
            'webpack-cli': '^6.0.1'
        }
    };
}

import fs from 'fs-extra';
import path from 'path';
import ts from 'typescript';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    buildWorkspaceTsConfig,
    createWorkspacePackageJson,
    getPublishedPackageVersion,
    getWorkspaceNodeEngineRange,
    getWorkspaceNodeVersion,
    MIN_NODE_MAJOR,
    scaffoldWorkspaceItemFromTemplate,
    scaffoldWorkspaceTemplate,
    WORKSPACE_BUILD_DEV_DEPENDENCIES,
    WORKSPACE_LINT_DEV_DEPENDENCIES
} from '../../src/services/generator.service.js';
import { cliRoot, createTempDir, removeTempDir } from '../helpers/test-utils.js';

const cliPackageVersion: string = fs.readJsonSync(path.join(cliRoot, 'package.json')).version;

/**
 * Parse a generated TypeScript file and return its syntax errors.
 */
const getSyntaxErrors = (fileName: string, code: string): string[] =>
{
    const output = ts.transpileModule(code, {
        fileName: fileName,
        reportDiagnostics: true,
        compilerOptions: { experimentalDecorators: true, target: ts.ScriptTarget.ES2022 }
    });
    return (output.diagnostics ?? []).map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
};

describe('generator.service', () =>
{
    describe('workspace toolchain', () =>
    {
        it('requires Node.js 22 or later', () =>
        {
            expect(MIN_NODE_MAJOR).toBe(22);
            expect(getWorkspaceNodeVersion()).toBe('22');
            expect(getWorkspaceNodeEngineRange()).toBe('>=22');
        });

        it('publishes the workspace with the CLI version', () =>
        {
            expect(getPublishedPackageVersion()).toBe(cliPackageVersion);
        });

        it('aligns the build toolchain with the repository', () =>
        {
            const rootPackageJson = fs.readJsonSync(path.join(cliRoot, '..', '..', 'package.json'));
            expect(WORKSPACE_BUILD_DEV_DEPENDENCIES.typescript).toBe(rootPackageJson.devDependencies.typescript);
            expect(Object.keys(WORKSPACE_BUILD_DEV_DEPENDENCIES).sort()).toEqual(['ts-loader', 'typescript', 'webpack', 'webpack-cli']);
        });
    });

    describe('createWorkspacePackageJson', () =>
    {
        it('creates a private package with build and lint scripts', () =>
        {
            const packageJson = createWorkspacePackageJson('my-workspace');

            expect(packageJson).toMatchObject({
                name: 'my-workspace',
                version: '1.0.0',
                private: true,
                engines: { node: '>=22' },
                scripts: {
                    'build': 'npx intuiface-cli build --all',
                    'build:debug': 'npx intuiface-cli build --all --debug',
                    'lint': 'npx eslint .'
                }
            });
        });

        it('depends on the CLI and core packages of the same version', () =>
        {
            const packageJson = createWorkspacePackageJson('my-workspace');

            expect(packageJson.dependencies).toEqual({
                '@intuiface/cli': cliPackageVersion,
                '@intuiface/core': cliPackageVersion,
                'tslib': '^2.6.2'
            });
        });

        it('installs the build and lint toolchains', () =>
        {
            const devDependencies = createWorkspacePackageJson('my-workspace').devDependencies as Record<string, string>;

            expect(devDependencies).toMatchObject(WORKSPACE_BUILD_DEV_DEPENDENCIES);
            expect(devDependencies).toMatchObject(WORKSPACE_LINT_DEV_DEPENDENCIES);
            expect(devDependencies['@types/node']).toBeDefined();
        });
    });

    describe('buildWorkspaceTsConfig', () =>
    {
        it('generates a valid tsconfig rooted at ./src', () =>
        {
            const tsconfigText = buildWorkspaceTsConfig();
            const tsconfig = JSON.parse(tsconfigText);

            expect(tsconfigText.endsWith('\n')).toBe(true);
            expect(tsconfig.compilerOptions).toMatchObject({
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                rootDir: './src',
                useDefineForClassFields: false,
                moduleResolution: 'bundler',
                importHelpers: true,
                // TypeScript 6 no longer loads @types/node by default (installed in every workspace)
                types: ['node']
            });
            expect(tsconfig.include).toEqual(['**/src/**/*.ts']);
        });

        it('is accepted by TypeScript without errors', () =>
        {
            const parsed = ts.parseJsonConfigFileContent(JSON.parse(buildWorkspaceTsConfig()), ts.sys, cliRoot);

            expect(parsed.errors.filter((error) => error.code !== 18003)).toEqual([]); // 18003: no input files in cliRoot
        });
    });

    describe('scaffoldWorkspaceTemplate', () =>
    {
        let dir: string;

        beforeEach(() =>
        {
            dir = createTempDir('cli-generator');
        });

        afterEach(() =>
        {
            removeTempDir(dir);
        });

        it('copies the workspace files and reports their sizes', () =>
        {
            const generatedFiles = scaffoldWorkspaceTemplate('my-workspace', dir);
            const relativePaths = generatedFiles.map((file) => file.relativePath.replace(/\\/g, '/')).sort();

            expect(relativePaths).toEqual([
                '.gitignore',
                '.vscode/extensions.json',
                '.vscode/settings.json',
                'eslint.config.mjs',
                'webpack.config.cjs'
            ]);
            for (const file of generatedFiles)
            {
                expect(fs.statSync(path.join(dir, file.relativePath)).size).toBe(file.bytes);
            }
        });

        it('creates the files once and keeps them on a second run', () =>
        {
            expect(scaffoldWorkspaceTemplate('my-workspace', dir).map((file) => file.action)).toEqual(['create', 'create', 'create', 'create', 'create']);
            const firstRun = fs.readFileSync(path.join(dir, '.vscode', 'settings.json'), 'utf8');

            expect(scaffoldWorkspaceTemplate('my-workspace', dir).map((file) => file.action)).toEqual(['keep', 'keep', 'keep', 'keep', 'keep']);
            expect(fs.readFileSync(path.join(dir, '.vscode', 'settings.json'), 'utf8')).toBe(firstRun);
        });

        it('renames the gitignore template to .gitignore (npm never publishes .gitignore files)', () =>
        {
            scaffoldWorkspaceTemplate('my-workspace', dir);

            expect(fs.existsSync(path.join(dir, '.gitignore'))).toBe(true);
            expect(fs.existsSync(path.join(dir, 'gitignore'))).toBe(false);

            const gitignore = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
            expect(gitignore).toMatch(/node_modules/);
            expect(gitignore).toMatch(/dist/);
        });

        it('ships the gitignore template without a leading dot', () =>
        {
            const templateDir = path.join(cliRoot, 'src', 'templates', 'workspace');

            expect(fs.existsSync(path.join(templateDir, 'gitignore'))).toBe(true);
            expect(fs.existsSync(path.join(templateDir, '.gitignore'))).toBe(false);
        });

        it('creates the destination folder when needed', () =>
        {
            const nestedDir = path.join(dir, 'nested', 'workspace');

            scaffoldWorkspaceTemplate('my-workspace', nestedDir);

            expect(fs.existsSync(path.join(nestedDir, 'eslint.config.mjs'))).toBe(true);
        });
    });

    describe('scaffoldWorkspaceItemFromTemplate', () =>
    {
        let dir: string;

        beforeEach(() =>
        {
            dir = createTempDir('cli-generator-item');
        });

        afterEach(() =>
        {
            removeTempDir(dir);
        });

        it('renders an interface asset named after the item', () =>
        {
            const generatedFiles = scaffoldWorkspaceItemFromTemplate(
                { name: 'MyAsset', type: 'interface-asset', entry: '' },
                dir,
                { category: 'My Category' }
            );

            expect(generatedFiles.map((file) => file.relativePath)).toEqual(['MyAsset.ts']);

            const code = fs.readFileSync(path.join(dir, 'MyAsset.ts'), 'utf8');
            expect(code).toContain('export class MyAsset extends IntuifaceElement');
            expect(code).toContain(`name: 'MyAsset'`);
            expect(code).toContain(`category: 'My Category'`);
            expect(code).not.toMatch(/__[A-Z_]+__/);
            expect(getSyntaxErrors('MyAsset.ts', code)).toEqual([]);
        });

        it('renders a binding converter with a camelCase method and its default icon', () =>
        {
            const generatedFiles = scaffoldWorkspaceItemFromTemplate(
                { name: 'TextTools', type: 'binding-converter', entry: '' },
                dir,
                { category: 'Text' }
            );

            expect(generatedFiles.map((file) => file.relativePath).sort()).toEqual(['TextTools.ts', 'icon_converter_32.png']);

            const code = fs.readFileSync(path.join(dir, 'TextTools.ts'), 'utf8');
            expect(code).toContain('export class TextTools');
            expect(code).toContain('public static textTools(');
            expect(code).toContain(`displayName: 'TextTools'`);
            expect(code).toContain(`category: 'Text'`);
            expect(code).not.toMatch(/__[A-Z_]+__/);
            expect(getSyntaxErrors('TextTools.ts', code)).toEqual([]);
        });

        it('copies the binary icon unchanged', () =>
        {
            scaffoldWorkspaceItemFromTemplate({ name: 'Conv', type: 'binding-converter', entry: '' }, dir);

            const templateIcon = path.join(cliRoot, 'src', 'templates', 'workspace-items', 'binding-converter', 'icon_converter_32.png');
            expect(fs.readFileSync(path.join(dir, 'icon_converter_32.png')).equals(fs.readFileSync(templateIcon))).toBe(true);
        });

        it('uses the Custom category by default', () =>
        {
            scaffoldWorkspaceItemFromTemplate({ name: 'MyAsset', type: 'interface-asset', entry: '' }, dir);

            expect(fs.readFileSync(path.join(dir, 'MyAsset.ts'), 'utf8')).toContain(`category: 'Custom'`);
        });

        it.each([
            ['an apostrophe', `Bob's tools`, `'Bob\\'s tools'`],
            ['a backslash', 'C:\\tools', `'C:\\\\tools'`],
            ['a line break', 'two\nlines', `'two\\nlines'`],
            ['a carriage return', 'two\r\nlines', `'two\\r\\nlines'`]
        ])('escapes a category with %s', (label, category, expectedLiteral) =>
        {
            scaffoldWorkspaceItemFromTemplate({ name: 'MyAsset', type: 'interface-asset', entry: '' }, dir, { category });

            const code = fs.readFileSync(path.join(dir, 'MyAsset.ts'), 'utf8');
            expect(code).toContain(`category: ${expectedLiteral}`);
            expect(getSyntaxErrors('MyAsset.ts', code)).toEqual([]);
        });

        it('escapes the category of a binding converter', () =>
        {
            scaffoldWorkspaceItemFromTemplate({ name: 'Conv', type: 'binding-converter', entry: '' }, dir, { category: `Bob's tools` });

            const code = fs.readFileSync(path.join(dir, 'Conv.ts'), 'utf8');
            expect(code).toContain(`category: 'Bob\\'s tools'`);
            expect(getSyntaxErrors('Conv.ts', code)).toEqual([]);
        });

        // Known bug B6 (PR #119 review): String.replace() expands `$&` in a string replacement.
        // Remove `.fails` once renderTemplateValue uses a replacer function.
        it.fails('keeps a category with replacement patterns verbatim', () =>
        {
            scaffoldWorkspaceItemFromTemplate({ name: 'MyAsset', type: 'interface-asset', entry: '' }, dir, { category: 'Price $& more' });

            expect(fs.readFileSync(path.join(dir, 'MyAsset.ts'), 'utf8')).toContain(`category: 'Price $& more'`);
        });
    });
});

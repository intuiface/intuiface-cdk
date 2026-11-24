import fs from 'fs-extra';
import { createRequire } from 'module';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    cleanBuildFolders,
    resetBuildMetadata,
    resolveBuildIcon,
    resolveTranspiledEntryPath,
    transpileTypeScript,
    writeGeneratedWebpackConfig
} from '../../src/services/build.service.js';
import { buildWorkspaceTsConfig } from '../../src/services/generator.service.js';
import { BuildTarget } from '../../src/types.js';
import { createTempDir, removeTempDir, repoRoot, useCwd, writeFiles } from '../helpers/test-utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThisAny = globalThis as any;

const createSpinner = (): { fail: ReturnType<typeof vi.fn>; text: string; indent: number } => ({ fail: vi.fn(), text: '', indent: 0 });

/**
 * tsconfig of a workspace. The tests run in the OS temp folder: its `types` (`node`) are found in the repository node_modules.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workspaceTsConfig = (): any =>
{
    const tsconfig = JSON.parse(buildWorkspaceTsConfig());
    tsconfig.compilerOptions.typeRoots = [path.join(repoRoot, 'node_modules', '@types')];
    return tsconfig;
};

/**
 * Evaluate a generated webpack config (CommonJS) with a stubbed `webpack` module.
 * The workspace customisation (an absolute path to webpack.config.cjs) is really required.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadWebpackConfig = (configPath: string): any =>
{
    class ModuleFederationPlugin
    {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        public constructor(public options: any)
        {
        }
    }

    const nodeRequire = createRequire(configPath);
    const stubRequire = (id: string): unknown =>
    {
        if (path.isAbsolute(id) && path.basename(id) === 'webpack.config.cjs')
        {
            return nodeRequire(id);
        }
        if (id !== 'webpack')
        {
            throw new Error(`Unexpected require('${id}')`);
        }
        return { container: { ModuleFederationPlugin } };
    };
    const module = { exports: {} };
    new Function('require', 'module', 'exports', fs.readFileSync(configPath, 'utf8'))(stubRequire, module, module.exports);
    return module.exports;
};

/**
 * The configuration webpack builds: webpack-cli calls an exported function, and waits for its promise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveWebpackConfig = async (configPath: string): Promise<any> =>
{
    const exported = loadWebpackConfig(configPath);
    return typeof exported === 'function' ? await exported({ WEBPACK_BUILD: true }, {}) : exported;
};

describe('build.service', () =>
{
    let dir: string;
    let restoreCwd: () => void;

    beforeEach(() =>
    {
        dir = createTempDir('cli-build-service');
        restoreCwd = useCwd(dir);
    });

    afterEach(() =>
    {
        restoreCwd();
        removeTempDir(dir);
    });

    describe('cleanBuildFolders', () =>
    {
        beforeEach(() =>
        {
            writeFiles(dir, {
                'dist/Alpha/Alpha.ifd': '{}',
                'dist/Beta/Beta.ifd': '{}',
                'tmp/Alpha.js': ''
            });
        });

        it('removes the item output folder and tmp/, and keeps the other items', () =>
        {
            cleanBuildFolders(dir, path.join('dist', 'Alpha'));

            expect(fs.existsSync(path.join(dir, 'dist', 'Alpha'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist', 'Beta', 'Beta.ifd'))).toBe(true);
        });

        it('accepts an absolute output folder', () =>
        {
            cleanBuildFolders(dir, path.join(dir, 'dist', 'Beta'));

            expect(fs.existsSync(path.join(dir, 'dist', 'Beta'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist', 'Alpha'))).toBe(true);
        });

        it('only removes tmp/ without an output folder', () =>
        {
            cleanBuildFolders(dir, undefined);

            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist', 'Alpha'))).toBe(true);
        });

        it('does nothing when the folders do not exist', () =>
        {
            fs.removeSync(path.join(dir, 'tmp'));

            expect(() => cleanBuildFolders(dir, path.join('dist', 'Missing'))).not.toThrow();
        });
    });

    describe('resetBuildMetadata', () =>
    {
        it('resets the globals filled by the decorators', async () =>
        {
            Object.assign(globalThisAny, {
                // eslint-disable-next-line camelcase
                intuiface_ifd_classes: ['Previous'],
                // eslint-disable-next-line camelcase
                intuiface_ifd_actions: { Previous: {} },
                iaTitle: 'Previous title',
                iaCategory: 'Previous category'
            });

            await resetBuildMetadata({ name: 'Next', buildType: 'binding-converter', entryFile: '', outputDir: '', useGeneratedWebpackConfig: true });

            expect(globalThisAny.intuiface_ifd_name).toBe('Next');
            expect(globalThisAny.intuiface_build_type).toBe('binding-converter');
            expect(globalThisAny.intuiface_ifd_classes).toEqual([]);
            expect(globalThisAny.intuiface_ifd_properties).toEqual({});
            expect(globalThisAny.intuiface_ifd_actions).toEqual({});
            expect(globalThisAny.intuiface_ifd_params).toEqual({});
            expect(globalThisAny.intuiface_ifd_triggers).toEqual({});
            expect(globalThisAny.iaTitle).toBeUndefined();
            expect(globalThisAny.iaDescription).toBeUndefined();
            expect(globalThisAny.iaCategory).toBeUndefined();
        });

        it('provides a browser-like window to the loaded item', async () =>
        {
            await resetBuildMetadata({ name: 'Next', buildType: 'interface-asset', entryFile: '', outputDir: '', useGeneratedWebpackConfig: true });

            expect(globalThisAny.window.location.href).toBe('https://web.intuiface.com/');
            expect(globalThisAny.window.document).toBeDefined();
        });
    });

    describe('transpileTypeScript', () =>
    {
        beforeEach(() =>
        {
            writeFiles(dir, { 'tsconfig.json': workspaceTsConfig() });
        });

        it('transpiles the workspace into the output folder, keeping the src/ layout', () =>
        {
            writeFiles(dir, {
                'src/interface-assets/Alpha/Alpha.ts': `export const alpha = (): number => 1;\n`,
                'src/binding-converters/Beta/Beta.ts': `export const beta = (): number => 2;\n`
            });

            transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, 'tmp'), createSpinner());

            expect(fs.existsSync(path.join(dir, 'tmp', 'interface-assets', 'Alpha', 'Alpha.js'))).toBe(true);
            expect(fs.existsSync(path.join(dir, 'tmp', 'binding-converters', 'Beta', 'Beta.js'))).toBe(true);
        });

        it('adds the .js extension to relative imports and exports (required by Node.js ESM)', () =>
        {
            writeFiles(dir, {
                'src/interface-assets/Alpha/Alpha.ts': [
                    `import { helper } from './helper';`,
                    `import { shared } from '../../shared/shared';`,
                    `import { already } from './already.js';`,
                    `import data from './data.json';`,
                    `export * from './helper';`,
                    `export { shared as reexported } from '../../shared/shared';`,
                    `export const value = helper() + shared() + already() + data.count;`,
                    ''
                ].join('\n'),
                'src/interface-assets/Alpha/helper.ts': `export const helper = (): number => 1;\n`,
                'src/interface-assets/Alpha/already.ts': `export const already = (): number => 1;\n`,
                'src/interface-assets/Alpha/data.json': `{ "count": 1 }\n`,
                'src/shared/shared.ts': `export const shared = (): number => 1;\n`
            });
            const tsconfig = workspaceTsConfig();
            tsconfig.compilerOptions.resolveJsonModule = true;
            writeFiles(dir, { 'tsconfig.json': tsconfig });

            transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, 'tmp'), createSpinner());

            const output = fs.readFileSync(path.join(dir, 'tmp', 'interface-assets', 'Alpha', 'Alpha.js'), 'utf8');
            expect(output).toMatch(/import \{ helper \} from ["']\.\/helper\.js["']/);
            expect(output).toMatch(/import \{ shared \} from ["']\.\.\/\.\.\/shared\/shared\.js["']/);
            expect(output).toMatch(/import \{ already \} from ["']\.\/already\.js["']/);
            expect(output).not.toContain('already.js.js');
            expect(output).toMatch(/import data from ["']\.\/data\.json["']/);
            expect(output).toMatch(/export \* from ["']\.\/helper\.js["']/);
            expect(output).toMatch(/export \{ shared as reexported \} from ["']\.\.\/\.\.\/shared\/shared\.js["']/);
        });

        it('leaves package imports unchanged', () =>
        {
            writeFiles(dir, {
                'src/Alpha.ts': `import path from 'path';\nexport const sep = path.sep;\n`
            });
            const tsconfig = workspaceTsConfig();
            tsconfig.compilerOptions.types = [];
            tsconfig.compilerOptions.noImplicitAny = false;
            writeFiles(dir, { 'tsconfig.json': tsconfig });

            const spinner = createSpinner();
            try
            {
                transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, 'tmp'), spinner);
            }
            catch (_error)
            {
                // 'path' has no type declaration here: only the emitted import matters
            }

            expect(fs.readFileSync(path.join(dir, 'tmp', 'Alpha.js'), 'utf8')).toContain(`from 'path'`);
        });

        it('reports type errors with their location and fails', () =>
        {
            writeFiles(dir, { 'src/Alpha.ts': `export const alpha: number = 'not a number';\n` });
            const spinner = createSpinner();

            expect(() => transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, 'tmp'), spinner)).toThrow('TypeScript compilation failed.');

            const messages = spinner.fail.mock.calls.map((call) => String(call[0] ?? ''));
            expect(messages.some((message) => /Alpha\.ts \(1,14\): Type 'string' is not assignable to type 'number'\./.test(message))).toBe(true);
            expect(spinner.indent).toBe(0);
        });

        it('fails when an error in another item breaks the workspace (one program for all items)', () =>
        {
            writeFiles(dir, {
                'src/interface-assets/Alpha/Alpha.ts': `export const alpha = 1;\n`,
                'src/interface-assets/Broken/Broken.ts': `export const broken: number = '';\n`
            });

            expect(() => transpileTypeScript(path.join(dir, 'tsconfig.json'), path.join(dir, 'tmp'), createSpinner())).toThrow('TypeScript compilation failed.');
        });

        it('reports an invalid tsconfig.json', () =>
        {
            expect(() => transpileTypeScript(path.join(dir, 'missing-tsconfig.json'), path.join(dir, 'tmp'), createSpinner()))
                .toThrow(/^Error reading tsconfig\.json:/);
        });
    });

    describe('resolveTranspiledEntryPath', () =>
    {
        it('maps a workspace entry under src/ to tmp/', () =>
        {
            writeFiles(dir, { 'tmp/interface-assets/Alpha/Alpha.js': '' });

            expect(resolveTranspiledEntryPath('src/interface-assets/Alpha/Alpha.ts')).toBe(path.join(dir, 'tmp', 'interface-assets', 'Alpha', 'Alpha.js'));
        });

        it('maps a legacy entry src/<name>.ts to tmp/<name>.js', () =>
        {
            expect(resolveTranspiledEntryPath('src/Alpha.ts')).toBe(path.join(dir, 'tmp', 'Alpha.js'));
        });

        it('falls back to tmp/<file name>.js when TypeScript flattened the output', () =>
        {
            writeFiles(dir, { 'tmp/Alpha.js': '' });

            expect(resolveTranspiledEntryPath('src/interface-assets/Alpha/Alpha.ts')).toBe(path.join(dir, 'tmp', 'Alpha.js'));
        });

        // Known limitation O10 (PR #119 review): a tsconfig with `rootDir: "."` emits tmp/src/<entry>.js.
        it.fails('finds the entry emitted with rootDir "."', () =>
        {
            writeFiles(dir, { 'tmp/src/interface-assets/Alpha/Alpha.js': '' });

            expect(resolveTranspiledEntryPath('src/interface-assets/Alpha/Alpha.ts')).toBe(path.join(dir, 'tmp', 'src', 'interface-assets', 'Alpha', 'Alpha.js'));
        });
    });

    describe('resolveBuildIcon', () =>
    {
        it('returns the configured icon', () =>
        {
            expect(resolveBuildIcon('interface-asset', 'icons/a.png', dir)).toBe('icons/a.png');
            expect(resolveBuildIcon('binding-converter', 'icons/b.png', dir)).toBe('icons/b.png');
        });

        it('returns no icon for an interface asset without icon', () =>
        {
            writeFiles(dir, { 'icon_converter_32.png': 'png' });

            expect(resolveBuildIcon('interface-asset', undefined, dir)).toBeUndefined();
        });

        it('uses icon_converter_32.png at the root for a binding converter without icon (legacy projects)', () =>
        {
            expect(resolveBuildIcon('binding-converter', undefined, dir)).toBeUndefined();

            writeFiles(dir, { 'icon_converter_32.png': 'png' });

            expect(resolveBuildIcon('binding-converter', undefined, dir)).toBe('icon_converter_32.png');
        });
    });

    describe('generated webpack config', () =>
    {
        const target: BuildTarget = {
            name: 'Alpha',
            buildType: 'interface-asset',
            entryFile: 'src/interface-assets/Alpha/Alpha.ts',
            outputDir: path.join('dist', 'Alpha'),
            useGeneratedWebpackConfig: true
        };

        beforeEach(() =>
        {
            fs.ensureDirSync(path.join(dir, 'tmp'));
        });

        it('writes a production config exposing the item through Module Federation', () =>
        {
            const configPath = writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'));
            const config = loadWebpackConfig(configPath);
            const entryPath = path.resolve(dir, target.entryFile);

            expect(configPath).toBe(path.join(dir, 'tmp', 'webpack.Alpha.cjs'));
            expect(config.mode).toBe('production');
            expect(config.devtool).toBeUndefined();
            expect(config.entry).toBe(entryPath);
            expect(config.output).toEqual({ publicPath: 'auto', path: path.resolve(dir, 'dist', 'Alpha') });
            expect(config.module.rules[0]).toMatchObject({ use: 'ts-loader', exclude: /node_modules/ });
            expect(config.module.rules[0].test.test('Alpha.ts')).toBe(true);
            expect(config.plugins).toHaveLength(1);
            expect(config.plugins[0].options).toEqual({
                name: 'Alpha',
                filename: 'Alpha.js',
                exposes: { './Alpha': { import: entryPath, name: 'Alpha.module' } },
                shared: { '@intuiface/core': { singleton: true, strictVersion: false } }
            });
        });

        it('writes a debug config with inline source maps', () =>
        {
            const configPath = writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { debug: true });
            const config = loadWebpackConfig(configPath);

            expect(configPath).toBe(path.join(dir, 'tmp', 'webpack-debug.Alpha.cjs'));
            expect(config.mode).toBe('development');
            expect(config.devtool).toBe('inline-source-map');
            expect(config.plugins[0].options.exposes['./Alpha'].name).toBe('Alpha.module');
        });

        describe('customised by webpack.config.cjs (review O1)', () =>
        {
            const writeCustomization = (code: string): string =>
            {
                writeFiles(dir, { 'webpack.config.cjs': code });
                return path.join(dir, 'webpack.config.cjs');
            };

            it('passes the generated configuration, the item and the build mode, and builds what the function returns', async () =>
            {
                const customizationPath = writeCustomization([
                    'module.exports = (config, { item, debug }) => ({',
                    '    ...config,',
                    `    externals: { fs: 'commonjs fs' },`,
                    '    received: { mode: config.mode, entry: config.entry, plugins: config.plugins.length, item, debug }',
                    '});'
                ].join('\n'));

                const production = await resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { customizationPath }));
                const debug = await resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { debug: true, customizationPath: customizationPath }));

                expect(production.externals).toEqual({ fs: 'commonjs fs' });
                expect(production.output).toEqual({ publicPath: 'auto', path: path.resolve(dir, 'dist', 'Alpha') });
                expect(production.received).toEqual({
                    mode: 'production',
                    entry: path.resolve(dir, target.entryFile),
                    plugins: 1,
                    item: { name: 'Alpha', type: 'interface-asset', entry: 'src/interface-assets/Alpha/Alpha.ts' },
                    debug: false
                });
                expect(debug.received).toMatchObject({ mode: 'development', debug: true });
            });

            it('builds the configuration changed in place when the function returns nothing', async () =>
            {
                const customizationPath = writeCustomization(`module.exports = (config) => { config.target = 'electron-renderer'; };\n`);

                const config = await resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { customizationPath }));

                expect(config.target).toBe('electron-renderer');
                expect(config.mode).toBe('production');
            });

            it('waits for an async function', async () =>
            {
                const customizationPath = writeCustomization(`module.exports = async (config) => ({ ...config, externalsPresets: { node: true } });\n`);

                const config = await resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { customizationPath }));

                expect(config.externalsPresets).toEqual({ node: true });
            });

            it('rejects a file that does not export a function', async () =>
            {
                const customizationPath = writeCustomization(`module.exports = { externals: { fs: 'commonjs fs' } };\n`);

                await expect(resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { customizationPath })))
                    .rejects.toThrow('webpack.config.cjs must export a function: module.exports = (config, { item, debug }) => config;');
            });

            it('rejects a function that does not return a configuration', async () =>
            {
                const customizationPath = writeCustomization('module.exports = () => 42;\n');

                await expect(resolveWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp'), { customizationPath })))
                    .rejects.toThrow('The function of webpack.config.cjs must return the webpack configuration of Alpha.');
            });

            it('exports the generated configuration as is without customisation', () =>
            {
                expect(typeof loadWebpackConfig(writeGeneratedWebpackConfig(target, dir, path.join(dir, 'tmp')))).toBe('object');
            });
        });

        it('escapes paths with spaces, apostrophes and backslashes', () =>
        {
            const oddDir = path.join(dir, `it's a {dir}`);
            fs.ensureDirSync(path.join(oddDir, 'tmp'));

            const config = loadWebpackConfig(writeGeneratedWebpackConfig(target, oddDir, path.join(oddDir, 'tmp')));

            expect(config.output.path).toBe(path.resolve(oddDir, 'dist', 'Alpha'));
            expect(config.entry).toBe(path.resolve(oddDir, target.entryFile));
        });
    });
});

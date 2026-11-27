import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { repoRoot } from '../helpers/test-utils.js';
import { assertBuiltPackages, createE2EDir, readIfd, removeE2EDir, runCli, withoutVersion } from './e2e-utils.js';

type Schematic = 'binding-converter' | 'interface-asset';

/**
 * Create a project as the 2.x binding-converter or interface-asset schematic does (EJS placeholders rendered by hand).
 */
const scaffoldSchematicProject = (dir: string, name: string, category: string, schematic: Schematic = 'binding-converter'): void =>
{
    const schematicFiles = path.join(repoRoot, 'libs', 'tools', 'schematics', `${schematic}-schematics`, 'src', 'create', 'files');
    const render = (text: string): string => text
        .replace(/<%= camelize\(bindingConverterName\) %>/g, `${name.charAt(0).toLowerCase()}${name.slice(1)}`)
        .replace(/<%= (bindingConverterName|IAName) %>/g, name)
        .replace(/<%= (bindingConverterCategory|IACategory) %>/g, category);

    for (const file of ['package.json', 'tsconfig.json', 'webpack.config.js', 'webpack-debug.config.js'])
    {
        fs.writeFileSync(path.join(dir, file), render(fs.readFileSync(path.join(schematicFiles, file), 'utf8')));
    }
    fs.ensureDirSync(path.join(dir, 'src'));
    fs.writeFileSync(
        path.join(dir, 'src', `${name}.ts`),
        render(fs.readFileSync(path.join(schematicFiles, 'src', schematic === 'binding-converter' ? '__bindingConverterName__.ts' : '__IAName__.ts'), 'utf8'))
    );
    if (schematic === 'binding-converter')
    {
        fs.copySync(path.join(schematicFiles, 'icon_converter_32.png'), path.join(dir, 'icon_converter_32.png'));
    }
};

/**
 * A 2.x interface asset project built without migrating: `build -n <name>` compiles it with the CLI TypeScript
 * (tmp/<name>.js, for the descriptor), and bundles it with the project webpack.config.js (review O2, O10).
 */
describe('2.x interface asset project', () =>
{
    let dir: string;

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('legacy-asset');
        scaffoldSchematicProject(dir, 'LegacyAsset', 'Legacy Assets', 'interface-asset');

        // The entry imports a file of a sub folder, emitted next to it in tmp/
        fs.outputFileSync(path.join(dir, 'src', 'utils', 'defaults.ts'), 'export const DEFAULT_EXAMPLE = 5;\n');
        const entryPath = path.join(dir, 'src', 'LegacyAsset.ts');
        const entry = fs.readFileSync(entryPath, 'utf8');
        fs.writeFileSync(entryPath, `import { DEFAULT_EXAMPLE } from './utils/defaults';\n${entry.replace('defaultValue: 0,', 'defaultValue: DEFAULT_EXAMPLE,')}`);
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('builds without migrating (legacy mode, project webpack config)', () =>
    {
        const result = runCli(dir, 'build', '-n', 'LegacyAsset');

        expect(result.status, result.output).toBe(0);
        expect(result.output).not.toContain('webpack.config.cjs');
        const ifd = readIfd(dir, 'LegacyAsset');
        expect(ifd).toMatchObject({
            'name': 'LegacyAsset',
            'if.category': 'Legacy Assets',
            'if.dependencies': ['LegacyAsset.js', 'LegacyAsset.module.js']
        });
        expect(ifd.schemas.LegacyAsset.properties.propertyExample).toMatchObject({ type: 'number', default: 5 });
        expect(ifd.resources.LegacyAsset.methods.actionExample.id).toBe('LegacyAsset.actionExample');
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyAsset', 'LegacyAsset.js'))).toBe(true);
        expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
    });

    it('builds in debug mode with webpack-debug.config.js', () =>
    {
        const result = runCli(dir, 'build', '-n', 'LegacyAsset', '--debug');

        expect(result.status, result.output).toBe(0);
        const remoteEntry = fs.readFileSync(path.join(dir, 'dist', 'LegacyAsset', 'LegacyAsset.js'), 'utf8');
        expect(remoteEntry).toContain('sourceMappingURL=data:application/json');
    });

    it('still type-checks the whole project with the ts-loader of webpack.config.js', () =>
    {
        const unusedPath = path.join(dir, 'src', 'unused.ts');
        fs.writeFileSync(unusedPath, `export const unused: number = 'not a number';\n`);
        try
        {
            const result = runCli(dir, 'build', '-n', 'LegacyAsset');

            // The CLI compiles the item only; the project ts-loader, left as is, reports the error
            expect(result.status).not.toBe(0);
            expect(result.output).toContain('TypeScript compiled.');
            expect(result.output).toMatch(/unused\.ts[\s\S]*Type 'string' is not assignable to type 'number'/);
        }
        finally
        {
            fs.removeSync(unusedPath);
        }
    });
});

describe('2.x binding converter project', () =>
{
    let dir: string;
    let legacyIfd: Record<string, unknown>;

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('migrate');
        scaffoldSchematicProject(dir, 'LegacyConverter', 'Legacy Tools');
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('still builds without migrating (legacy mode, project webpack config)', () =>
    {
        const result = runCli(dir, 'build', '-n', 'LegacyConverter', '-t', 'binding-converter');

        expect(result.status, result.output).toBe(0);
        legacyIfd = readIfd(dir, 'LegacyConverter');
        expect(legacyIfd).toMatchObject({
            'name': 'LegacyConverter',
            'if.category': 'Legacy Tools',
            'icons': { x32: 'icon_converter_32.png' },
            'resources': { LegacyConverter: { methods: { legacyConverter: { id: 'LegacyConverter.legacyConverter' } } } }
        });
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'LegacyConverter.js'))).toBe(true);
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'icon_converter_32.png'))).toBe(true);
        expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
    });

    it('migrates to a workspace', () =>
    {
        const result = runCli(dir, 'migrate');

        expect(result.status, result.output).toBe(0);
        expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual({
            version: 1,
            name: 'LegacyConverter',
            items: [{ name: 'LegacyConverter', type: 'binding-converter', entry: 'src/LegacyConverter.ts', icon: 'icon_converter_32.png' }]
        });
        expect(fs.readJsonSync(path.join(dir, 'package.json')).scripts.build).toBe('npx intuiface-cli build --all');
        expect(fs.existsSync(path.join(dir, 'webpack.config.js'))).toBe(false);
        expect(fs.existsSync(path.join(dir, 'webpack-debug.config.js'))).toBe(false);
    });

    it('builds the same descriptor once migrated', () =>
    {
        const result = runCli(dir, 'build', '--all');

        expect(result.status, result.output).toBe(0);
        expect(withoutVersion(readIfd(dir, 'LegacyConverter'))).toEqual(withoutVersion(legacyIfd));
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'LegacyConverter.js'))).toBe(true);
    });

    it('reports that a workspace needs no migration', () =>
    {
        const result = runCli(dir, 'migrate');

        expect(result.status).toBe(0);
        expect(result.output).toContain('Already using workspace mode. No migration needed.');
    });
});

/**
 * A 2.x project created before 2.3 (tsconfig.json for TypeScript 5), whose webpack.config.js keeps a Node.js module
 * out of the bundle (review O1).
 */
describe('2.x project with externals in webpack.config.js, created before 2.3', () =>
{
    let dir: string;
    let tsconfigBefore23: string;

    /** Changes of tsconfig.json the build lists to compile with TypeScript 6. */
    const tsconfigChanges = [
        'add "rootDir": "./src"',
        'replace "moduleResolution": "node" with "moduleResolution": "bundler"',
        'remove "downlevelIteration"',
        'add "types": ["node"]'
    ];

    /** Built JavaScript of an item, all chunks together. */
    const readBundle = (name: string): string => fs.readdirSync(path.join(dir, 'dist', name))
        .filter((file) => file.endsWith('.js'))
        .map((file) => fs.readFileSync(path.join(dir, 'dist', name, file), 'utf8'))
        .join('\n');

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('migrate-externals');
        scaffoldSchematicProject(dir, 'FileConverter', 'Files');

        const webpackConfigPath = path.join(dir, 'webpack.config.js');
        const webpackConfig = fs.readFileSync(webpackConfigPath, 'utf8').replace(/\r\n/g, '\n');
        fs.writeFileSync(webpackConfigPath, webpackConfig.replace(
            `entry: './src/FileConverter.ts'`,
            `entry: './src/FileConverter.ts',\n    // Provided by the player\n    externals: {\n        fs: 'commonjs fs'\n    }`
        ));
        const sourcePath = path.join(dir, 'src', 'FileConverter.ts');
        const source = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(sourcePath, `import fs from 'fs';\n${source.replace(/return .*;/, `return fs.existsSync(String(input)) ? 'yes' : 'no';`)}`);

        // tsconfig.json of the schematics before 2.3
        const tsconfigPath = path.join(dir, 'tsconfig.json');
        const tsconfig = fs.readJsonSync(tsconfigPath);
        delete tsconfig.compilerOptions.rootDir;
        Object.assign(tsconfig.compilerOptions, { moduleResolution: 'node', downlevelIteration: true });
        tsconfigBefore23 = `${JSON.stringify(tsconfig, null, 2)}\n`;
        fs.writeFileSync(tsconfigPath, tsconfigBefore23);
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('does not compile with the TypeScript 6 of the CLI, which invites to migrate or lists the tsconfig.json changes', () =>
    {
        const result = runCli(dir, 'build', '-n', 'FileConverter', '-t', 'binding-converter');

        expect(result.status).not.toBe(0);
        // TypeScript 6 deprecates options, and no longer loads @types/node by default
        expect(result.output).toContain(`Option 'downlevelIteration' is deprecated`);
        expect(result.output).toContain(`Cannot find name 'fs'`);
        expect(result.output).toContain('This project was created with an older version of the Intuiface CDK.');
        // The commands to migrate, each on its own line
        expect(result.output).toMatch(/run these commands one after the other:\n\n {6}npx intuiface-cli migrate\n {6}npm install\n {6}npm run build\n/);
        expect(result.output).toContain('Or, to keep the project as it is, make these changes in tsconfig.json, then run the build again:');
        for (const change of tsconfigChanges)
        {
            expect(result.output).toContain(`      - ${change}\n`);
        }
        expect(result.output).not.toMatch(/^\s+at /m);
    });

    it('builds without migrating once tsconfig.json has the listed changes', () =>
    {
        // The changes made by hand
        const tsconfigPath = path.join(dir, 'tsconfig.json');
        const tsconfig = fs.readJsonSync(tsconfigPath);
        delete tsconfig.compilerOptions.downlevelIteration;
        Object.assign(tsconfig.compilerOptions, { rootDir: './src', moduleResolution: 'bundler', types: ['node'] });
        fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
        try
        {
            const result = runCli(dir, 'build', '-n', 'FileConverter', '-t', 'binding-converter');

            expect(result.status, result.output).toBe(0);
            expect(readBundle('FileConverter')).toContain('require("fs")');
        }
        finally
        {
            fs.writeFileSync(tsconfigPath, tsconfigBefore23);
            fs.removeSync(path.join(dir, 'dist'));
        }
    });

    it('moves the externals to webpack.config.cjs', () =>
    {
        const result = runCli(dir, 'migrate');

        expect(result.status, result.output).toBe(0);
        expect(result.output).toContain('webpack.config.cjs created, with `externals` (webpack.config.js and webpack-debug.config.js removed)');
        expect(fs.existsSync(path.join(dir, 'webpack.config.js'))).toBe(false);
        expect(fs.existsSync(path.join(dir, 'webpack-debug.config.js'))).toBe(false);
        expect(fs.readFileSync(path.join(dir, 'webpack.config.cjs'), 'utf8').replace(/\r\n/g, '\n')).toContain([
            '    // Moved from webpack.config.js by intuiface-cli migrate',
            '    // Provided by the player',
            '    config.externals = {',
            `        fs: 'commonjs fs'`,
            '    };'
        ].join('\n'));
        expect(fs.readJsonSync(path.join(dir, 'tsconfig.json')).compilerOptions).toMatchObject({ rootDir: './src', moduleResolution: 'bundler', types: ['node'] });
        expect(fs.readJsonSync(path.join(dir, 'tsconfig.json')).compilerOptions).not.toHaveProperty('downlevelIteration');
    });

    it('builds the same bundle once migrated', () =>
    {
        const result = runCli(dir, 'build', '--all');

        expect(result.status, result.output).toBe(0);
        expect(result.output).toContain('(customised by webpack.config.cjs)');
        expect(result.output).not.toContain('is not used to build a workspace');
        expect(readBundle('FileConverter')).toContain('require("fs")');
    });
});

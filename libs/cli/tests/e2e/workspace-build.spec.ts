import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cliRoot, fixturesDir, PNG_SIGNATURE } from '../helpers/test-utils.js';
import { assertBuiltPackages, CliResult, createE2EDir, readIfd, removeE2EDir, runCli, runCliOrThrow, withoutVersion } from './e2e-utils.js';
import { openPlayerHost, PlayerHost, PlayerHostLoad } from './player-host.js';

const converterIconTemplate = path.join(cliRoot, 'src', 'templates', 'workspace-items', 'binding-converter', 'icon_converter_32.png');

/**
 * A workspace with the two item templates and two richer fixtures, built once with `build --all`.
 */
describe('workspace build (init → add → build --all)', () =>
{
    let dir: string;
    let buildAll: CliResult;

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('build');

        runCliOrThrow(dir, 'init', '-n', 'e2e-workspace');

        fs.copySync(converterIconTemplate, path.join(dir, 'icons', 'gauge.png'));
        runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'Gauge', '-c', `Bob's tools`, '-i', 'icons/gauge.png');
        runCliOrThrow(dir, 'add', 'binding-converter', '-n', 'TextTools', '-c', 'Text Tools');

        runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'Thermostat', '-c', 'Home');
        fs.copySync(path.join(fixturesDir, 'thermostat'), path.join(dir, 'src', 'interface-assets', 'Thermostat'), { overwrite: true });

        runCliOrThrow(dir, 'add', 'binding-converter', '-n', 'TextConverters', '-c', 'Text');
        fs.copySync(path.join(fixturesDir, 'text-converters'), path.join(dir, 'src', 'binding-converters', 'TextConverters'), { overwrite: true });

        // Imported by Thermostat and TextConverters
        fs.copySync(path.join(fixturesDir, 'shared'), path.join(dir, 'src', 'shared'));

        buildAll = runCli(dir, 'build', '--all');
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('builds every item', () =>
    {
        expect(buildAll.status, buildAll.output).toBe(0);

        for (const name of ['Gauge', 'TextConverters', 'TextTools', 'Thermostat'])
        {
            expect(fs.existsSync(path.join(dir, 'dist', name, `${name}.ifd`)), `${name}.ifd`).toBe(true);
            expect(fs.existsSync(path.join(dir, 'dist', name, `${name}.js`)), `${name}.js`).toBe(true);
        }
    });

    it('removes tmp/ after the build', () =>
    {
        expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
    });

    describe('interface asset template', () =>
    {
        it('describes the asset', () =>
        {
            const ifd = readIfd(dir, 'Gauge');

            expect(ifd.version).toMatch(/^v1\.0\.\d+$/);
            expect(ifd).toMatchObject({
                'name': 'Gauge',
                'if.category': `Bob's tools`,
                'protocol': 'ts',
                'basePath': 'Gauge',
                'if.dependencies': ['Gauge.js', 'Gauge.module.js']
            });
        });

        it('describes the example property, action and trigger', () =>
        {
            const ifd = readIfd(dir, 'Gauge');

            expect(ifd.schemas.Gauge).toMatchObject({
                id: 'Gauge',
                type: 'object',
                properties: {
                    propertyExample: { type: 'number', title: 'propertyExample', default: 0 }
                }
            });
            expect(ifd.resources.Gauge).toMatchObject({
                'id': 'Gauge',
                'if.interfaceAsset': true,
                'methods': {
                    actionExample: {
                        id: 'Gauge.actionExample',
                        title: 'Action Example',
                        parameters: { actionParam: { type: 'number', title: 'Action parameter', default: 1 } }
                    }
                },
                'events': {
                    exampleTrigger: {
                        id: 'exampleTrigger',
                        title: 'A Trigger Example',
                        properties: { triggerParam: { type: 'string', title: 'Trigger parameter' } }
                    }
                }
            });
        });

        it('references and copies the icon given to add', () =>
        {
            expect(readIfd(dir, 'Gauge').icons).toEqual({ x32: 'gauge.png' });
            expect(fs.existsSync(path.join(dir, 'dist', 'Gauge', 'gauge.png'))).toBe(true);
        });
    });

    describe('binding converter template', () =>
    {
        it('describes the converter with its category and a camelCase id', () =>
        {
            const ifd = readIfd(dir, 'TextTools');

            expect(ifd).toMatchObject({
                'name': 'TextTools',
                'if.category': 'Text Tools',
                'if.dependencies': ['TextTools.js', 'TextTools.module.js']
            });
            expect(ifd.schemas).toEqual({ TextTools: { id: 'TextTools', type: 'object', description: 'TextTools' } });
            expect(ifd.resources.TextTools).toMatchObject({
                'id': 'TextTools',
                'if.interfaceAsset': true,
                'methods': {
                    textTools: {
                        'id': 'TextTools.textTools',
                        'if.converter': true,
                        'title': 'TextTools',
                        'path': 'textTools',
                        'parameters': { input: { type: 'string', title: 'Input' } },
                        'response': { $ref: 'string' }
                    }
                }
            });
        });

        it('references and copies the default converter icon', () =>
        {
            expect(readIfd(dir, 'TextTools').icons).toEqual({ x32: 'icon_converter_32.png' });
            const builtIcon = fs.readFileSync(path.join(dir, 'dist', 'TextTools', 'icon_converter_32.png'));
            expect(builtIcon.equals(fs.readFileSync(converterIconTemplate))).toBe(true);
            // A Git LFS pointer instead of the image when the checkout does not fetch LFS files (review R2)
            expect(builtIcon.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)).toBe(true);
        });
    });

    describe('interface asset with several members', () =>
    {
        it('uses the @Asset display name, description and category', () =>
        {
            const ifd = readIfd(dir, 'Thermostat');

            expect(ifd.title).toBe('Smart thermostat');
            expect(ifd['if.category']).toBe('Home');
            expect(ifd.resources.Thermostat).toMatchObject({ title: 'Smart thermostat', description: 'Controls the room temperature.' });
            expect(ifd.icons).toBeUndefined();
        });

        it('describes every property with its type', () =>
        {
            const properties = readIfd(dir, 'Thermostat').schemas.Thermostat.properties;

            expect(properties.target).toMatchObject({ type: 'number', title: 'Target temperature', description: 'Temperature to reach.', default: 20 });
            expect(properties.unit).toMatchObject({ type: 'string', title: 'Unit', default: 'C' });
            expect(properties.heating).toMatchObject({ type: 'boolean', title: 'Heating', default: false, readonly: true });
            expect(properties.displayText).toMatchObject({ type: 'string', title: 'Display text', readonly: true });
        });

        it('describes the action parameters in declaration order', () =>
        {
            const setTarget = readIfd(dir, 'Thermostat').resources.Thermostat.methods.setTarget;

            expect(setTarget).toMatchObject({ id: 'Thermostat.setTarget', title: 'Set target', description: 'Change the target temperature.' });
            expect(Object.keys(setTarget.parameters)).toEqual(['value', 'unit']);
            expect(setTarget.parameters.value).toMatchObject({ type: 'number', title: 'Value', default: 20 });
            expect(setTarget.parameters.unit).toMatchObject({ type: 'string', title: 'Unit', default: 'C' });
        });

        it('describes the trigger and its parameter', () =>
        {
            const targetReached = readIfd(dir, 'Thermostat').resources.Thermostat.events.targetReached;

            expect(targetReached).toMatchObject({
                id: 'targetReached',
                title: 'Target reached',
                description: 'Raised when the room reaches the target temperature.',
                properties: { temperature: { type: 'number', title: 'Temperature' } }
            });
        });

        it('bundles the relatively imported module', () =>
        {
            const bundle = fs.readdirSync(path.join(dir, 'dist', 'Thermostat'))
                .filter((file) => file.endsWith('.js'))
                .map((file) => fs.readFileSync(path.join(dir, 'dist', 'Thermostat', file), 'utf8'))
                .join('\n');

            expect(bundle).toContain('°');
        });
    });

    describe('binding converter class with several converters', () =>
    {
        it('describes every converter with its parameters and return type', () =>
        {
            const methods = readIfd(dir, 'TextConverters').resources.TextConverters.methods;

            expect(Object.keys(methods).sort()).toEqual(['repeat', 'textLength', 'toUpper']);
            expect(methods.toUpper).toMatchObject({ 'id': 'TextConverters.toUpper', 'if.converter': true, 'title': 'Upper case', 'response': { $ref: 'string' } });
            expect(methods.repeat).toMatchObject({ id: 'TextConverters.repeat', title: 'Repeat', response: { $ref: 'string' } });
            expect(Object.keys(methods.repeat.parameters)).toEqual(['input', 'count']);
            expect(methods.repeat.parameters.count).toMatchObject({ type: 'number', default: 2 });
            expect(methods.textLength).toMatchObject({ id: 'TextConverters.textLength', title: 'Text length', response: { $ref: 'number' } });
        });

        it('takes the category of the first converter that declares one', () =>
        {
            expect(readIfd(dir, 'TextConverters')['if.category']).toBe('Text');
        });
    });

    describe('module shared by two items', () =>
    {
        it('is compiled and bundled with each item that imports it', () =>
        {
            // Thermostat and TextConverters import src/shared/categories.ts. build --all loads every item in one Node.js
            // process: the item built second gets the shared module from the module cache, with the same values.
            // `build --name Thermostat` below builds it alone, and must give the same descriptor.
            expect(readIfd(dir, 'Thermostat')['if.category']).toBe('Home');
            expect(readIfd(dir, 'TextConverters')['if.category']).toBe('Text');
            expect(fs.existsSync(path.join(dir, 'dist', 'shared'))).toBe(false);
        });
    });

    /**
     * The built items, loaded as the Intuiface Player loads them: with its Module Federation runtime, and the
     * @intuiface/core the host shares (see player-host/player-host.mjs). Only the Player itself can check its own core.
     */
    describe('in a Player-like host', () =>
    {
        const names = ['Gauge', 'TextConverters', 'TextTools', 'Thermostat'];
        let host: PlayerHost;
        let loaded: PlayerHostLoad;

        beforeAll(async () =>
        {
            host = await openPlayerHost(dir);
            loaded = await host.loadItems(names);
        });

        afterAll(async () =>
        {
            await host?.close();
        });

        it('loads every item from its remote entry, <name>.js', () =>
        {
            for (const name of names)
            {
                expect(host.requestedPaths).toContain(`/dist/${name}/${name}.js`);
                expect(typeof loaded.modules[name][name], name).toBe('function');
            }
            expect(host.errors).toEqual([]);
        });

        it('uses the @intuiface/core of the host, never the copy each item carries in case the host has none', () =>
        {
            expect(loaded.usedExports).toEqual(expect.arrayContaining(['Asset', 'Property', 'Action', 'Trigger', 'Parameter', 'Converter', 'IntuifaceElement']));
            for (const name of names)
            {
                const coreChunks = fs.readdirSync(path.join(dir, 'dist', name))
                    .filter((file) => file.endsWith('.js') && fs.readFileSync(path.join(dir, 'dist', name, file), 'utf8').includes('intuiface_ifd_classes'));

                expect(coreChunks.length, `${name}: chunk with the copy of the core`).toBeGreaterThan(0);
                for (const chunk of coreChunks)
                {
                    expect(host.requestedPaths, `${name}: ${chunk} must not be loaded`).not.toContain(`/dist/${name}/${chunk}`);
                }
            }
        });

        it('runs the items with the classes of the host core', () =>
        {
            const gauge = new loaded.modules.Gauge.Gauge();
            expect(gauge).toBeInstanceOf(loaded.core.IntuifaceElement);
            gauge.actionExample(7);
            expect(gauge.propertyExample).toBe(7);

            // Relative import, and module shared with TextConverters
            const thermostat = new loaded.modules.Thermostat.Thermostat();
            thermostat.setTarget(5, 'C');
            expect(thermostat.displayText).toBe('5°C');

            expect(loaded.modules.TextConverters.TextConverters.toUpper('abc')).toBe('ABC');
            expect(loaded.modules.TextTools.TextTools.textTools(42)).toBe('42');
        });

        it('declares triggers whose parameters the Player can read', () =>
        {
            // The Player reads the parameter names of a trigger in its source, `(a, b) {`, and maps them by position
            // to the parameters of the descriptor (`@Parameter` names)
            for (const name of ['Gauge', 'Thermostat'])
            {
                const events: Record<string, { properties?: object }> = readIfd(dir, name).resources[name].events;
                for (const [trigger, event] of Object.entries(events))
                {
                    const source: string = loaded.modules[name][name].prototype[trigger].toString();
                    const parameters = source.substring(source.indexOf('(') + 1, source.indexOf(')')).split(',')
                        .map((parameter) => parameter.trim())
                        .filter((parameter) => parameter !== '');

                    expect(parameters.length, `${name}.${trigger}`).toBe(Object.keys(event.properties ?? {}).length);
                }
            }
        });
    });

    describe('build --name', () =>
    {
        it('builds the same descriptor as build --all, and only that item', () =>
        {
            const ifdFromAll = readIfd(dir, 'Thermostat');
            const otherItemMarker = path.join(dir, 'dist', 'Gauge', 'marker.txt');
            fs.writeFileSync(otherItemMarker, 'kept');

            const result = runCli(dir, 'build', '--name', 'Thermostat');

            expect(result.status, result.output).toBe(0);
            expect(withoutVersion(readIfd(dir, 'Thermostat'))).toEqual(withoutVersion(ifdFromAll));
            expect(fs.existsSync(otherItemMarker)).toBe(true);
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
        });

        it('builds only the named item when --all is also given, as `npm run build -- -n X` does (review O8)', () =>
        {
            const otherItemMarker = path.join(dir, 'dist', 'Gauge', 'marker-o8.txt');
            fs.writeFileSync(otherItemMarker, 'kept');

            const result = runCli(dir, 'build', '--all', '--name', 'TextTools');

            expect(result.status, result.output).toBe(0);
            expect(result.output.match(/successfully built\./g), result.output).toEqual([`successfully built.`]);
            expect(result.output).toContain(`binding-converter 'TextTools' successfully built.`);
            expect(fs.existsSync(otherItemMarker)).toBe(true);
        });

        it('builds a converter in debug mode with inline source maps', () =>
        {
            const result = runCli(dir, 'build', '-n', 'TextTools', '--debug');

            expect(result.status, result.output).toBe(0);
            const remoteEntry = fs.readFileSync(path.join(dir, 'dist', 'TextTools', 'TextTools.js'), 'utf8');
            expect(remoteEntry).toContain('sourceMappingURL=data:application/json');
            expect(readIfd(dir, 'TextTools')['if.category']).toBe('Text Tools');
        });
    });
});

/**
 * Each item is compiled on its own: the CLI type-checks the item files, and ts-loader only transpiles them (review O2).
 */
describe('TypeScript compilation of an item', () =>
{
    let dir: string;

    /** Built JavaScript of an item, all chunks together. */
    const readBundle = (name: string): string => fs.readdirSync(path.join(dir, 'dist', name))
        .filter((file) => file.endsWith('.js'))
        .map((file) => fs.readFileSync(path.join(dir, 'dist', name, file), 'utf8'))
        .join('\n');

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('compile');

        runCliOrThrow(dir, 'init', '-n', 'compile-workspace');
        runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'Shapes', '-c', 'Geometry');
        runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'Broken', '-c', 'Geometry');

        // An interface, imported without `import type`, typing a decorated property
        const shapesDir = path.join(dir, 'src', 'interface-assets', 'Shapes');
        fs.writeFileSync(path.join(shapesDir, 'shape.ts'), 'export interface IShape\n{\n    sides: number;\n}\n');
        const entryPath = path.join(shapesDir, 'Shapes.ts');
        const entry = fs.readFileSync(entryPath, 'utf8');
        fs.writeFileSync(entryPath, `import { IShape } from './shape';\n${entry.replace(
            '    public propertyExample: number = 0;',
            `    public propertyExample: number = 0;\n\n    @Property({ displayName: 'Shape', type: Object })\n    public shape: IShape = { sides: 3 };`
        )}`);

        fs.appendFileSync(path.join(dir, 'src', 'interface-assets', 'Broken', 'Broken.ts'), `\nexport const broken: number = 'not a number';\n`);
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('builds an item while another item has a TypeScript error', () =>
    {
        const result = runCli(dir, 'build', '-n', 'Shapes');

        expect(result.status, result.output).toBe(0);
        expect(readIfd(dir, 'Shapes').schemas.Shapes.properties.shape).toMatchObject({ type: 'object', title: 'Shape' });
        expect(fs.existsSync(path.join(dir, 'dist', 'Shapes', 'Shapes.js'))).toBe(true);
    });

    it('bundles without decorator metadata, so an interface typing a decorated member raises no webpack warning', () =>
    {
        const result = runCli(dir, 'build', '-n', 'Shapes');

        expect(result.status, result.output).toBe(0);
        expect(result.output).not.toContain('WARNING');
        expect(readBundle('Shapes')).not.toContain('design:type');
    });

    it('reports the error when building the item that has it', () =>
    {
        const result = runCli(dir, 'build', '-n', 'Broken');

        expect(result.status).not.toBe(0);
        expect(result.output).toMatch(/Broken\.ts \(\d+,\d+\): Type 'string' is not assignable to type 'number'\./);
        expect(result.output).not.toMatch(/Shapes\.ts \(\d+,\d+\)/);
        expect(fs.existsSync(path.join(dir, 'dist', 'Broken'))).toBe(false);
    });

    it('fails build --all on the item with the error, and only reports that error', () =>
    {
        const result = runCli(dir, 'build', '--all');

        expect(result.status).not.toBe(0);
        expect(result.output).toMatch(/Broken\.ts \(\d+,\d+\): Type 'string' is not assignable to type 'number'\./);
        expect(result.output).not.toMatch(/Shapes\.ts \(\d+,\d+\)/);
        expect(fs.existsSync(path.join(dir, 'dist', 'Broken'))).toBe(false);
    });

    it('finds the compiled entry whatever the rootDir of tsconfig.json (review O10)', () =>
    {
        const tsconfigPath = path.join(dir, 'tsconfig.json');
        const tsconfig = fs.readJsonSync(tsconfigPath);
        tsconfig.compilerOptions.rootDir = '.';
        fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });

        const result = runCli(dir, 'build', '-n', 'Shapes');

        expect(result.status, result.output).toBe(0);
        expect(readIfd(dir, 'Shapes').schemas.Shapes.properties.shape).toMatchObject({ type: 'object' });
    });
});

/**
 * Items that use modules the player provides (Node.js, Electron, BrightSign) need webpack `externals` (review O1).
 */
describe('webpack.config.cjs', () =>
{
    let dir: string;

    /** Built JavaScript of an item, all chunks together. */
    const readBundle = (name: string): string => fs.readdirSync(path.join(dir, 'dist', name))
        .filter((file) => file.endsWith('.js'))
        .map((file) => fs.readFileSync(path.join(dir, 'dist', name, file), 'utf8'))
        .join('\n');

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('webpack');

        runCliOrThrow(dir, 'init', '-n', 'webpack-workspace');
        runCliOrThrow(dir, 'add', 'binding-converter', '-n', 'FileTools', '-c', 'Files');
        const sourcePath = path.join(dir, 'src', 'binding-converters', 'FileTools', 'FileTools.ts');
        const source = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(sourcePath, `import fs from 'fs';\n${source.replace(`return input?.toString() ?? '';`, `return fs.existsSync(input) ? 'yes' : 'no';`)}`);
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('is created by init, and changes nothing until it is edited', () =>
    {
        expect(fs.readFileSync(path.join(dir, 'webpack.config.cjs'), 'utf8')).toContain('module.exports = (config, { item, debug }) =>');

        const result = runCli(dir, 'build', '--all');

        // webpack 5 does not bundle Node.js modules for the web
        expect(result.status, result.output).not.toBe(0);
        expect(result.output).toContain(`Can't resolve 'fs'`);
        expect(result.output).toContain('(customised by webpack.config.cjs)');
    });

    it('builds with the externals it sets, for production and debug builds', () =>
    {
        fs.writeFileSync(path.join(dir, 'webpack.config.cjs'), [
            'module.exports = (config, { item, debug }) =>',
            '{',
            `    config.externals = { fs: 'commonjs fs' };`,
            '    if (debug)',
            '    {',
            `        config.devtool = 'source-map';`,
            '    }',
            '    return config;',
            '};',
            ''
        ].join('\n'));

        const production = runCli(dir, 'build', '--all');

        expect(production.status, production.output).toBe(0);
        expect(readBundle('FileTools')).toContain('require("fs")');
        expect(readIfd(dir, 'FileTools')['if.category']).toBe('Files');
        expect(fs.readdirSync(path.join(dir, 'dist', 'FileTools')).some((file) => file.endsWith('.js.map'))).toBe(false);

        const debug = runCli(dir, 'build', '--all', '--debug');

        expect(debug.status, debug.output).toBe(0);
        expect(readBundle('FileTools')).toContain('require("fs")');
        expect(fs.readdirSync(path.join(dir, 'dist', 'FileTools')).some((file) => file.endsWith('.js.map'))).toBe(true);
    });

    it('reports a file that does not export a function', () =>
    {
        fs.writeFileSync(path.join(dir, 'webpack.config.cjs'), `module.exports = { externals: { fs: 'commonjs fs' } };\n`);

        const result = runCli(dir, 'build', '--all');

        expect(result.status).not.toBe(0);
        expect(result.output).toContain('webpack.config.cjs must export a function: module.exports = (config, { item, debug }) => config;');
        expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
    });
});

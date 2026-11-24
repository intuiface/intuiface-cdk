import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cliRoot, fixturesDir } from '../helpers/test-utils.js';
import { assertBuiltPackages, CliResult, createE2EDir, readIfd, removeE2EDir, runCli, runCliOrThrow, withoutVersion } from './e2e-utils.js';

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
            expect(fs.readFileSync(path.join(dir, 'dist', 'TextTools', 'icon_converter_32.png')).equals(fs.readFileSync(converterIconTemplate))).toBe(true);
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

import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildIFDFile, buildResources, buildSchemas, getWorkspaceCategory, writeIFDFile } from '../../src/services/descriptor.service.js';
import { createTempDir, removeTempDir, resetIfdGlobals, useCwd, writeFiles } from '../helpers/test-utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThisAny = globalThis as any;

/**
 * Metadata written by the `@Asset`, `@Property`, `@Action` and `@Trigger` decorators for an asset `Gauge`
 * using a helper class `GaugeItem`.
 */
const declareInterfaceAsset = (): void =>
{
    resetIfdGlobals('Gauge', 'interface-asset');
    Object.assign(globalThisAny, {
        iaTitle: 'Gauge title',
        iaDescription: 'A gauge',
        iaCategory: 'Dataviz'
    });
    globalThisAny.intuiface_ifd_classes.push('GaugeItem', 'Gauge');
    globalThisAny.intuiface_ifd_properties.Gauge = { value: { type: 'number', default: 0 } };
    globalThisAny.intuiface_ifd_properties.GaugeItem = { label: { type: 'string' } };
    globalThisAny.intuiface_ifd_actions.Gauge = { reset: { id: 'Gauge.reset', title: 'Reset' } };
    globalThisAny.intuiface_ifd_triggers.Gauge = { changed: { title: 'Changed' } };
};

/**
 * Metadata written by `@Converter` for two converter classes.
 */
const declareBindingConverters = (category?: string): void =>
{
    resetIfdGlobals('TextTools', 'binding-converter');
    globalThisAny.iaCategory = category;
    globalThisAny.intuiface_ifd_classes.push('TextTools', 'MathTools');
    globalThisAny.intuiface_ifd_properties.TextTools = {};
    globalThisAny.intuiface_ifd_properties.MathTools = {};
    globalThisAny.intuiface_ifd_actions.TextTools = {
        upper: { 'id': 'stale', 'if.converter': true, 'title': 'Upper' },
        lower: { 'if.converter': true, 'title': 'Lower' }
    };
    globalThisAny.intuiface_ifd_actions.MathTools = {
        round: { 'if.converter': true, 'title': 'Round' }
    };
};

describe('descriptor.service', () =>
{
    let dir: string;
    let restoreCwd: () => void;

    beforeEach(() =>
    {
        dir = createTempDir('cli-descriptor');
        restoreCwd = useCwd(dir);
    });

    afterEach(() =>
    {
        restoreCwd();
        removeTempDir(dir);
    });

    describe('interface asset', () =>
    {
        beforeEach(() =>
        {
            declareInterfaceAsset();
        });

        it('builds one schema per class with its properties', () =>
        {
            expect(buildSchemas(globalThisAny.intuiface_ifd_classes, 'interface-asset')).toEqual({
                GaugeItem: { id: 'GaugeItem', type: 'object', description: 'GaugeItem', properties: { label: { type: 'string' } } },
                Gauge: { id: 'Gauge', type: 'object', description: 'Gauge', properties: { value: { type: 'number', default: 0 } } }
            });
        });

        it('builds one resource per class with methods and events', () =>
        {
            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset');

            expect(Object.keys(resources)).toEqual(['GaugeItem', 'Gauge']);
            expect(resources.GaugeItem).toEqual({ id: 'GaugeItem', methods: {}, events: undefined });
            expect(resources.Gauge).toMatchObject({
                id: 'Gauge',
                methods: { reset: { id: 'Gauge.reset', title: 'Reset' } },
                events: { changed: { title: 'Changed' } }
            });
        });

        it('marks the class named after the item as the interface asset, with its title and description', () =>
        {
            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset');

            expect(resources.Gauge).toMatchObject({ 'if.interfaceAsset': true, 'title': 'Gauge title', 'description': 'A gauge' });
            expect(resources.GaugeItem['if.interfaceAsset']).toBeUndefined();
        });

        it('marks the first class as the interface asset when no class is named after the item', () =>
        {
            // eslint-disable-next-line camelcase
            globalThisAny.intuiface_ifd_name = 'OtherName';

            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset');

            expect(resources.GaugeItem['if.interfaceAsset']).toBe(true);
            expect(resources.Gauge['if.interfaceAsset']).toBeUndefined();
        });

        it('builds the descriptor file', () =>
        {
            vi.spyOn(Date, 'now').mockReturnValue(1234);
            const schemas = buildSchemas(globalThisAny.intuiface_ifd_classes, 'interface-asset');
            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset');

            expect(buildIFDFile('Gauge', 'interface-asset', schemas, resources)).toEqual({
                'version': 'v1.0.1234',
                'name': 'Gauge',
                'title': 'Gauge title',
                'if.category': 'Dataviz',
                'protocol': 'ts',
                'basePath': 'Gauge',
                'if.dependencies': ['Gauge.js', 'Gauge.module.js'],
                'schemas': schemas,
                'resources': resources
            });
        });

        it('ignores the package.json category of an interface asset', () =>
        {
            writeFiles(dir, { 'package.json': { name: 'ws', intuiface: { category: 'Legacy' } } });

            expect(buildIFDFile('Gauge', 'interface-asset', {}, {})['if.category']).toBe('Dataviz');
        });
    });

    describe('binding converter', () =>
    {
        it('builds schemas without properties', () =>
        {
            declareBindingConverters('Text');

            expect(buildSchemas(globalThisAny.intuiface_ifd_classes, 'binding-converter')).toEqual({
                TextTools: { id: 'TextTools', type: 'object', description: 'TextTools' },
                MathTools: { id: 'MathTools', type: 'object', description: 'MathTools' }
            });
        });

        it('identifies each converter method as <Class>.<method>', () =>
        {
            declareBindingConverters('Text');

            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'binding-converter');

            expect(resources.TextTools.methods.upper.id).toBe('TextTools.upper');
            expect(resources.TextTools.methods.lower.id).toBe('TextTools.lower');
            expect(resources.MathTools.methods.round.id).toBe('MathTools.round');
        });

        it('adds neither events nor title to converter resources', () =>
        {
            declareBindingConverters('Text');

            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'binding-converter');

            expect(resources.TextTools).not.toHaveProperty('events');
            expect(resources.TextTools).not.toHaveProperty('title');
            expect(resources.TextTools['if.interfaceAsset']).toBe(true);
            expect(resources.MathTools['if.interfaceAsset']).toBeUndefined();
        });

        it('uses the @Converter category', () =>
        {
            declareBindingConverters('Text Tools');

            expect(buildIFDFile('TextTools', 'binding-converter', {}, {})['if.category']).toBe('Text Tools');
        });

        it('falls back to the package.json category (projects created by the former schematic)', () =>
        {
            declareBindingConverters(undefined);
            writeFiles(dir, { 'package.json': { name: 'ws', intuiface: { category: 'Legacy' } } });

            expect(buildIFDFile('TextTools', 'binding-converter', {}, {})['if.category']).toBe('Legacy');
        });

        it('prefers the @Converter category over the package.json one', () =>
        {
            declareBindingConverters('Text Tools');
            writeFiles(dir, { 'package.json': { name: 'ws', intuiface: { category: 'Legacy' } } });

            expect(buildIFDFile('TextTools', 'binding-converter', {}, {})['if.category']).toBe('Text Tools');
        });
    });

    describe('getWorkspaceCategory', () =>
    {
        it('returns undefined without package.json', () =>
        {
            expect(getWorkspaceCategory()).toBeUndefined();
        });

        it.each([
            ['no intuiface section', { name: 'ws' }],
            ['an empty category', { name: 'ws', intuiface: { category: '' } }],
            ['a category that is not a string', { name: 'ws', intuiface: { category: 42 } }]
        ])('returns undefined for %s', (label, packageJson) =>
        {
            writeFiles(dir, { 'package.json': packageJson });

            expect(getWorkspaceCategory()).toBeUndefined();
        });

        it('returns undefined for an invalid package.json', () =>
        {
            writeFiles(dir, { 'package.json': '{ invalid' });

            expect(getWorkspaceCategory()).toBeUndefined();
        });
    });

    describe('writeIFDFile', () =>
    {
        it('writes <name>.ifd in the output folder, creating it', async () =>
        {
            const spinner = { succeed: vi.fn(), fail: vi.fn() };
            const ifd = { name: 'Gauge', resources: {} };

            await writeIFDFile('Gauge', path.join('dist', 'Gauge'), ifd, spinner);

            const ifdPath = path.join(dir, 'dist', 'Gauge', 'Gauge.ifd');
            expect(fs.readJsonSync(ifdPath)).toEqual(ifd);
            expect(fs.readFileSync(ifdPath, 'utf8')).toBe(JSON.stringify(ifd, null, 2));
            expect(spinner.succeed).toHaveBeenCalledWith('Descriptor file (.ifd) has been saved.');
        });

        it('reports write errors', async () =>
        {
            const spinner = { succeed: vi.fn(), fail: vi.fn() };
            writeFiles(dir, { dist: 'a file, not a folder' });

            await expect(writeIFDFile('Gauge', path.join('dist', 'Gauge'), {}, spinner)).rejects.toThrow();
            expect(spinner.fail).toHaveBeenCalled();
        });
    });
});

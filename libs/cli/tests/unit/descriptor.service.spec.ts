/* eslint-disable max-classes-per-file -- a class hierarchy is the input of addInheritedMembers */
import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    addInheritedMembers,
    addReferencedClasses,
    buildIFDFile,
    buildResources,
    buildSchemas,
    getWorkspaceCategory,
    useItemClassDetails,
    writeIFDFile
} from '../../src/services/descriptor.service.js';
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

    describe('members inherited from parent classes', () =>
    {
        // The member decorators file each member under the class that declares it (`target.constructor.name`)
        class Device {}
        class Sensor extends Device {}
        class Barometer extends Sensor {}

        beforeEach(() =>
        {
            resetIfdGlobals('Barometer', 'interface-asset');
            Object.assign(globalThisAny.intuiface_ifd_properties, {
                Device: { serial: { title: 'Serial' }, unit: { title: 'Device unit' } },
                Sensor: { unit: { title: 'Sensor unit' }, value: { title: 'Value' } },
                Barometer: { pressure: { title: 'Pressure' }, value: { title: 'Pressure value' } }
            });
            Object.assign(globalThisAny.intuiface_ifd_actions, {
                Device: { restart: { id: 'Barometer.restart', title: 'Restart' } },
                Barometer: {}
            });
            Object.assign(globalThisAny.intuiface_ifd_triggers, {
                Sensor: { changed: { id: 'changed', title: 'Changed' } },
                Barometer: {}
            });
            globalThisAny.intuiface_ifd_classes.push('Barometer');
            // Recorded by @Asset
            globalThisAny.intuiface_ifd_element_classes.Barometer = Barometer;
        });

        it('lists the properties, actions and triggers of every parent class (Player behavior)', () =>
        {
            addInheritedMembers();

            const schema = buildSchemas(globalThisAny.intuiface_ifd_classes, 'interface-asset').Barometer as { properties: object };
            const resource = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset').Barometer;
            expect(Object.keys(schema.properties)).toEqual(['pressure', 'value', 'unit', 'serial']);
            expect(resource.methods).toEqual({ restart: { id: 'Barometer.restart', title: 'Restart' } });
            expect(resource.events).toEqual({ changed: { id: 'changed', title: 'Changed' } });
        });

        it('keeps the member a class declares over the one of a parent, and a parent over a farther one', () =>
        {
            addInheritedMembers();

            expect(globalThisAny.intuiface_ifd_properties.Barometer.value).toEqual({ title: 'Pressure value' });
            expect(globalThisAny.intuiface_ifd_properties.Barometer.unit).toEqual({ title: 'Sensor unit' });
        });

        it('lists a parent that is itself an element with its own members and those of its parents only', () =>
        {
            globalThisAny.intuiface_ifd_classes.push('Sensor');
            globalThisAny.intuiface_ifd_element_classes.Sensor = Sensor;

            addInheritedMembers();

            expect(Object.keys(globalThisAny.intuiface_ifd_properties.Sensor)).toEqual(['unit', 'value', 'serial']);
            expect(Object.keys(globalThisAny.intuiface_ifd_properties.Barometer)).toEqual(['pressure', 'value', 'unit', 'serial']);
        });

        it('reads the members of a class registered with another name', () =>
        {
            // @Asset({ name: 'MyBarometer' }) on class Barometer: the member decorators use the class name
            delete globalThisAny.intuiface_ifd_element_classes.Barometer;
            globalThisAny.intuiface_ifd_element_classes.MyBarometer = Barometer;
            globalThisAny.intuiface_ifd_properties.MyBarometer = {};

            addInheritedMembers();

            expect(Object.keys(globalThisAny.intuiface_ifd_properties.MyBarometer)).toEqual(['pressure', 'value', 'unit', 'serial']);
        });

        it('changes nothing without the classes an older @intuiface/core does not record', () =>
        {
            delete globalThisAny.intuiface_ifd_element_classes;
            const before = structuredClone(globalThisAny.intuiface_ifd_properties);

            addInheritedMembers();

            expect(globalThisAny.intuiface_ifd_properties).toEqual(before);
        });
    });

    describe('classes used as type or itemType of a property', () =>
    {
        // Watchable classes, recorded by @Property when used as its `type` or `itemType` (`registerReferencedClass`)
        class Watchable {}
        class PointLabel extends Watchable {}
        class Point extends Watchable {}
        class GeoPoint extends Point {}
        class Unused extends Watchable {}
        class Tracker extends Watchable {}

        /** An interface asset Tracker with `track` (itemType GeoPoint) and `origin` (type Point), none of them with @Asset. */
        const declareTracker = (): void =>
        {
            resetIfdGlobals('Tracker', 'interface-asset');
            Object.assign(globalThisAny.intuiface_ifd_properties, {
                PointLabel: { text: { type: 'string', title: 'Text' } },
                Point: { x: { type: 'number', title: 'X' }, y: { type: 'number', title: 'Y' }, label: { title: 'Label', extends: { $ref: 'PointLabel' } } },
                GeoPoint: { altitude: { type: 'number', title: 'Altitude' } },
                Unused: { value: { type: 'string', title: 'Value' } },
                Tracker: {
                    track: { type: 'array', title: 'Track', readonly: true, items: { $ref: 'GeoPoint' } },
                    origin: { title: 'Origin', extends: { $ref: 'Point' } },
                    count: { type: 'number', title: 'Count' }
                }
            });
            Object.assign(globalThisAny.intuiface_ifd_actions, { Point: { reset: { id: 'Tracker.reset', title: 'Reset' } }, Tracker: {} });
            Object.assign(globalThisAny.intuiface_ifd_triggers, { Tracker: {} });
            globalThisAny.intuiface_ifd_classes.push('Tracker');
            globalThisAny.intuiface_ifd_element_classes.Tracker = Tracker;
            Object.assign(globalThisAny.intuiface_ifd_referenced_classes, { PointLabel, Point, GeoPoint, Unused });
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- descriptor entries, read field by field
        const describeClasses = (): { schemas: Record<string, any>; resources: Record<string, any> } =>
        {
            addInheritedMembers();
            addReferencedClasses();
            return {
                schemas: buildSchemas(globalThisAny.intuiface_ifd_classes, 'interface-asset'),
                resources: buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset')
            };
        };

        it('describes the classes referenced with itemType and type, with the members of their parent classes', () =>
        {
            declareTracker();

            const { schemas, resources } = describeClasses();

            expect(schemas.GeoPoint).toEqual({
                id: 'GeoPoint',
                type: 'object',
                description: 'GeoPoint',
                properties: {
                    altitude: { type: 'number', title: 'Altitude' },
                    x: { type: 'number', title: 'X' },
                    y: { type: 'number', title: 'Y' },
                    label: { title: 'Label', extends: { $ref: 'PointLabel' } }
                }
            });
            expect(resources.GeoPoint).toEqual({ id: 'GeoPoint', methods: { reset: { id: 'Tracker.reset', title: 'Reset' } }, events: {} });
            expect(Object.keys(schemas.Point.properties)).toEqual(['x', 'y', 'label']);
        });

        it('follows the references of a referenced class, and describes each class once', () =>
        {
            declareTracker();

            const { schemas, resources } = describeClasses();

            // GeoPoint and Point reference PointLabel; Unused is recorded, but no described class references it
            expect(globalThisAny.intuiface_ifd_classes).toEqual(['Tracker', 'GeoPoint', 'Point', 'PointLabel']);
            expect(schemas.PointLabel).toEqual({ id: 'PointLabel', type: 'object', description: 'PointLabel', properties: { text: { type: 'string', title: 'Text' } } });
            expect(resources.PointLabel).toEqual({ id: 'PointLabel', methods: {}, events: {} });
            // The class of the item stays the interface asset
            expect(resources.Tracker['if.interfaceAsset']).toBe(true);
            expect(resources.Point['if.interfaceAsset']).toBeUndefined();
        });

        it('gives a class without @Asset the entries @Asset gives it, and leaves a class with @Asset unchanged', () =>
        {
            declareTracker();
            const withoutAsset = describeClasses();

            // Point with @Asset: decorated before Tracker, which imports it, so first in the classes
            declareTracker();
            globalThisAny.intuiface_ifd_classes.unshift('Point');
            globalThisAny.intuiface_ifd_element_classes.Point = Point;
            globalThisAny.intuiface_ifd_triggers.Point = {};
            const withAsset = describeClasses();

            expect(withAsset.schemas.Point).toEqual(withoutAsset.schemas.Point);
            expect(withAsset.resources.Point).toEqual(withoutAsset.resources.Point);
            expect(globalThisAny.intuiface_ifd_classes).toEqual(['Point', 'Tracker', 'PointLabel', 'GeoPoint']);
        });

        it('changes nothing without the classes an older @intuiface/core does not record', () =>
        {
            declareTracker();
            delete globalThisAny.intuiface_ifd_referenced_classes;

            const { schemas } = describeClasses();

            expect(Object.keys(schemas)).toEqual(['Tracker']);
            expect(schemas.Tracker.properties.track.items).toEqual({ $ref: 'GeoPoint' });
        });
    });

    describe('title, description and category of the descriptor', () =>
    {
        /** @Asset Gauge, then an @Asset class declared after it in the same file: its decorator runs last. */
        const declareAssetThenItemClass = (): void =>
        {
            declareInterfaceAsset();
            Object.assign(globalThisAny.intuiface_ifd_element_details, {
                Gauge: { displayName: 'Gauge title', category: 'Dataviz' },
                GaugeItem: { displayName: 'Gauge item', description: 'An item', category: 'Items' }
            });
            // What the decorator of GaugeItem left in the globals
            Object.assign(globalThisAny, { iaTitle: 'Gauge item', iaDescription: 'An item', iaCategory: 'Items' });
        };

        it('takes them from the class of the item, whatever the order the decorators ran in', () =>
        {
            declareAssetThenItemClass();

            useItemClassDetails();

            const resources = buildResources(globalThisAny.intuiface_ifd_classes, 'interface-asset');
            const ifd = buildIFDFile('Gauge', 'interface-asset', {}, resources);
            expect(ifd).toMatchObject({ 'title': 'Gauge title', 'if.category': 'Dataviz' });
            expect(resources.Gauge).toMatchObject({ title: 'Gauge title', description: undefined });
        });

        it('keeps the globals without the details an older @intuiface/core does not record', () =>
        {
            declareAssetThenItemClass();
            delete globalThisAny.intuiface_ifd_element_details;

            useItemClassDetails();

            expect(globalThisAny).toMatchObject({ iaTitle: 'Gauge item', iaDescription: 'An item', iaCategory: 'Items' });
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

import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    getRequiredWorkspaceItem,
    getWorkspaceConfigFileName,
    readWorkspaceConfig,
    tryReadWorkspaceConfig,
    writeWorkspaceConfig
} from '../../src/services/workspace.service.js';
import { WorkspaceConfig } from '../../src/types.js';
import { createTempDir, removeTempDir, writeFiles } from '../helpers/test-utils.js';

const sampleConfig: WorkspaceConfig = {
    version: 1,
    name: 'sample',
    items: [
        { name: 'Alpha', type: 'interface-asset', entry: 'src/interface-assets/Alpha/Alpha.ts' },
        { name: 'Beta', type: 'binding-converter', entry: 'src/binding-converters/Beta/Beta.ts', icon: 'src/binding-converters/Beta/icon_converter_32.png' }
    ]
};

describe('workspace.service', () =>
{
    let dir: string;

    beforeEach(() =>
    {
        dir = createTempDir('cli-workspace');
    });

    afterEach(() =>
    {
        removeTempDir(dir);
    });

    it('uses intuiface.workspace.json as workspace file', () =>
    {
        expect(getWorkspaceConfigFileName()).toBe('intuiface.workspace.json');
    });

    it('returns undefined outside a workspace', () =>
    {
        expect(tryReadWorkspaceConfig(dir)).toBeUndefined();
    });

    it('asks to run init when reading a missing workspace', () =>
    {
        expect(() => readWorkspaceConfig(dir)).toThrow(`Cannot find intuiface.workspace.json in '${dir}'. Run 'intuiface-cli init' first.`);
    });

    it('writes and reads back a workspace configuration', () =>
    {
        writeWorkspaceConfig(dir, sampleConfig);

        expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual(sampleConfig);
        expect(readWorkspaceConfig(dir)).toEqual(sampleConfig);
        expect(tryReadWorkspaceConfig(dir)).toEqual(sampleConfig);
    });

    it('rejects a workspace file without an items array', () =>
    {
        writeFiles(dir, { 'intuiface.workspace.json': { version: 1, name: 'broken' } });

        expect(() => readWorkspaceConfig(dir)).toThrow(`Invalid workspace configuration in 'intuiface.workspace.json'.`);
        expect(() => tryReadWorkspaceConfig(dir)).toThrow('Invalid workspace configuration');
    });

    describe('items edited by hand (review R9)', () =>
    {
        const writeItems = (items: unknown[]): void =>
        {
            writeFiles(dir, { 'intuiface.workspace.json': { version: 1, name: 'ws', items } });
        };
        const alpha = sampleConfig.items[0];

        it.each([
            ['an empty name (would build into dist/ itself)', [{ ...alpha, name: '' }], `Invalid item #1 in 'intuiface.workspace.json': Invalid name ''. Use alphanumeric characters only and start with a letter.`],
            ['a name webpack cannot use', [alpha, { ...alpha, name: 'My-Asset' }], `Invalid item 'My-Asset' in 'intuiface.workspace.json': Invalid name 'My-Asset'.`],
            ['no name', [{ type: 'interface-asset', entry: 'src/A.ts' }], `Invalid item #1 in 'intuiface.workspace.json': "name" is missing.`],
            ['an unknown type', [{ ...alpha, type: 'converter' }], `Invalid item 'Alpha' in 'intuiface.workspace.json': "type" must be 'interface-asset' or 'binding-converter', not "converter".`],
            ['no type', [{ name: 'Alpha', entry: 'src/A.ts' }], `"type" must be 'interface-asset' or 'binding-converter', not null.`],
            ['an empty entry', [{ ...alpha, entry: ' ' }], `Invalid item 'Alpha' in 'intuiface.workspace.json': "entry" must be the path of the item's TypeScript file`],
            ['an icon that is not a path', [{ ...alpha, icon: 32 }], `"icon" must be the path of an image file, or be left out.`],
            ['an item that is not an object', ['Alpha'], `Invalid item #1 in 'intuiface.workspace.json': an item is an object with a name, a type and an entry.`],
            ['two names that only differ by case', [alpha, { ...alpha, name: 'ALPHA' }], `Invalid item 'ALPHA' in 'intuiface.workspace.json': 'Alpha' has the same name.`]
        ])('rejects %s', (description, items, message) =>
        {
            writeItems(items);

            expect(() => readWorkspaceConfig(dir)).toThrow(message);
        });

        it('accepts an item without icon, and an empty workspace', () =>
        {
            writeItems([alpha]);
            expect(readWorkspaceConfig(dir).items).toEqual([alpha]);

            writeItems([]);
            expect(readWorkspaceConfig(dir).items).toEqual([]);
        });
    });

    it('rejects a workspace file that is not valid JSON', () =>
    {
        writeFiles(dir, { 'intuiface.workspace.json': '{ not json' });

        expect(() => readWorkspaceConfig(dir)).toThrow();
    });

    it('finds an item by name', () =>
    {
        expect(getRequiredWorkspaceItem(sampleConfig, 'Beta')).toBe(sampleConfig.items[1]);
    });

    it('reports an unknown item', () =>
    {
        expect(() => getRequiredWorkspaceItem(sampleConfig, 'Gamma')).toThrow(`Cannot find workspace item 'Gamma'.`);
    });

    it('matches item names case-sensitively', () =>
    {
        expect(() => getRequiredWorkspaceItem(sampleConfig, 'alpha')).toThrow(`Cannot find workspace item 'alpha'.`);
    });
});

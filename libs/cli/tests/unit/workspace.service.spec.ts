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

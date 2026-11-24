import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addBindingConverter, addInterfaceAsset } from '../../src/commands/add.command.js';
import { readWorkspaceConfig, writeWorkspaceConfig } from '../../src/services/workspace.service.js';
import { createTempDir, removeTempDir, silenceConsole, useCwd, writeFiles } from '../helpers/test-utils.js';

describe('add command', () =>
{
    let dir: string;
    let restoreCwd: () => void;
    let consoleLog: ReturnType<typeof silenceConsole>;

    beforeEach(() =>
    {
        dir = createTempDir('cli-add');
        restoreCwd = useCwd(dir);
        consoleLog = silenceConsole();
        writeWorkspaceConfig(dir, { version: 1, name: 'ws', items: [] });
    });

    afterEach(() =>
    {
        restoreCwd();
        removeTempDir(dir);
    });

    describe('interface-asset', () =>
    {
        it('generates the asset under src/interface-assets and registers it', () =>
        {
            addInterfaceAsset({ name: 'MyAsset', category: 'Tools' });

            expect(fs.existsSync(path.join(dir, 'src', 'interface-assets', 'MyAsset', 'MyAsset.ts'))).toBe(true);
            expect(readWorkspaceConfig(dir).items).toEqual([
                { name: 'MyAsset', type: 'interface-asset', entry: 'src/interface-assets/MyAsset/MyAsset.ts' }
            ]);
        });

        it('stores the icon given with --icon', () =>
        {
            writeFiles(dir, { 'icons/asset.png': 'png' });

            addInterfaceAsset({ name: 'MyAsset', category: 'Tools', icon: 'icons/asset.png' });

            expect(readWorkspaceConfig(dir).items[0].icon).toBe('icons/asset.png');
        });

        it('writes the category in the generated code', () =>
        {
            addInterfaceAsset({ name: 'MyAsset', category: `Bob's tools` });

            const code = fs.readFileSync(path.join(dir, 'src', 'interface-assets', 'MyAsset', 'MyAsset.ts'), 'utf8');
            expect(code).toContain(`category: 'Bob\\'s tools'`);
        });

        it('logs the created and updated files', () =>
        {
            addInterfaceAsset({ name: 'MyAsset', category: 'Tools' });

            const output = consoleLog.mock.calls.map((call) => String(call[0])).join('\n');
            expect(output).toMatch(/CREATE.*src\/interface-assets\/MyAsset\/MyAsset\.ts \(\d+ bytes\)/);
            expect(output).toMatch(/UPDATE.*intuiface\.workspace\.json/);
        });
    });

    describe('binding-converter', () =>
    {
        it('generates the converter under src/binding-converters with its default icon', () =>
        {
            addBindingConverter({ name: 'Beta', category: 'Text Tools' });

            const itemDir = path.join(dir, 'src', 'binding-converters', 'Beta');
            expect(fs.existsSync(path.join(itemDir, 'Beta.ts'))).toBe(true);
            expect(fs.existsSync(path.join(itemDir, 'icon_converter_32.png'))).toBe(true);
            expect(readWorkspaceConfig(dir).items).toEqual([
                {
                    name: 'Beta',
                    type: 'binding-converter',
                    entry: 'src/binding-converters/Beta/Beta.ts',
                    icon: 'src/binding-converters/Beta/icon_converter_32.png'
                }
            ]);
        });

        it('keeps the icon given with --icon instead of the default one', () =>
        {
            writeFiles(dir, { 'icons/converter.png': 'png' });

            addBindingConverter({ name: 'Beta', category: 'Text Tools', icon: 'icons/converter.png' });

            expect(readWorkspaceConfig(dir).items[0].icon).toBe('icons/converter.png');
        });

        it('names the converter method in camelCase', () =>
        {
            addBindingConverter({ name: 'TextUpper', category: 'Text' });

            const code = fs.readFileSync(path.join(dir, 'src', 'binding-converters', 'TextUpper', 'TextUpper.ts'), 'utf8');
            expect(code).toContain('public static textUpper(');
        });
    });

    it('keeps the items sorted by name', () =>
    {
        addInterfaceAsset({ name: 'Zeta', category: 'Tools' });
        addBindingConverter({ name: 'Alpha', category: 'Tools' });
        addInterfaceAsset({ name: 'Mid', category: 'Tools' });

        expect(readWorkspaceConfig(dir).items.map((item) => item.name)).toEqual(['Alpha', 'Mid', 'Zeta']);
    });

    it('keeps the other workspace settings', () =>
    {
        addInterfaceAsset({ name: 'MyAsset', category: 'Tools' });

        expect(readWorkspaceConfig(dir)).toMatchObject({ version: 1, name: 'ws' });
    });

    it('rejects an item name that already exists, whatever its type', () =>
    {
        addInterfaceAsset({ name: 'Shared', category: 'Tools' });

        expect(() => addBindingConverter({ name: 'Shared', category: 'Tools' })).toThrow(`A workspace item named 'Shared' already exists.`);
        expect(fs.existsSync(path.join(dir, 'src', 'binding-converters', 'Shared'))).toBe(false);
        expect(readWorkspaceConfig(dir).items).toHaveLength(1);
    });

    it.each(['my-asset', '1Asset', 'My Asset', '../Escape'])('rejects the invalid name %s without writing anything', (name) =>
    {
        expect(() => addInterfaceAsset({ name: name, category: 'Tools' })).toThrow(`Invalid name '${name}'`);
        expect(fs.existsSync(path.join(dir, 'src'))).toBe(false);
        expect(readWorkspaceConfig(dir).items).toEqual([]);
    });

    describe('icon (review O6)', () =>
    {
        it('rejects a missing icon without writing anything', () =>
        {
            expect(() => addInterfaceAsset({ name: 'MyAsset', category: 'Tools', icon: 'icons/missing.png' }))
                .toThrow(`Cannot find the icon 'icons/missing.png': there is no file at '${path.join(dir, 'icons', 'missing.png')}'.`);
            expect(() => addBindingConverter({ name: 'Beta', category: 'Tools', icon: 'icons/missing.png' })).toThrow(`Cannot find the icon 'icons/missing.png'`);
            expect(fs.existsSync(path.join(dir, 'src'))).toBe(false);
            expect(readWorkspaceConfig(dir).items).toEqual([]);
        });

        it('rejects a folder', () =>
        {
            fs.ensureDirSync(path.join(dir, 'icons'));

            expect(() => addInterfaceAsset({ name: 'MyAsset', category: 'Tools', icon: 'icons' })).toThrow(`Cannot find the icon 'icons'`);
        });

        it('accepts an icon given with ./ or an absolute path', () =>
        {
            writeFiles(dir, { 'icons/asset.png': 'png' });

            addInterfaceAsset({ name: 'Relative', category: 'Tools', icon: './icons/asset.png' });
            addInterfaceAsset({ name: 'Absolute', category: 'Tools', icon: path.join(dir, 'icons', 'asset.png') });

            expect(readWorkspaceConfig(dir).items.map((item) => item.icon)).toEqual([path.join(dir, 'icons', 'asset.png'), './icons/asset.png']);
        });
    });

    it('fails outside a workspace', () =>
    {
        fs.removeSync(path.join(dir, 'intuiface.workspace.json'));

        expect(() => addInterfaceAsset({ name: 'MyAsset', category: 'Tools' })).toThrow(/Cannot find intuiface\.workspace\.json .* Run 'intuiface-cli init' first\./);
    });
});

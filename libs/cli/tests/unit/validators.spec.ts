import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { validateGeneratedName, validateIconPath } from '../../src/utils/validators.js';
import { createTempDir, removeTempDir, writeFiles } from '../helpers/test-utils.js';

describe('validateGeneratedName', () =>
{
    it.each(['A', 'MyAsset', 'myAsset', 'Asset2', 'a1b2c3'])('accepts %s', (name) =>
    {
        expect(() => validateGeneratedName(name)).not.toThrow();
    });

    it.each([
        ['an empty name', ''],
        ['a leading digit', '2Asset'],
        ['a dash', 'My-Asset'],
        ['an underscore', 'My_Asset'],
        ['a space', 'My Asset'],
        ['a dot', 'My.Asset'],
        ['a path separator', '../Asset'],
        ['an accented letter', 'Café']
    ])('rejects a name with %s', (label, name) =>
    {
        expect(() => validateGeneratedName(name)).toThrow(`Invalid name '${name}'. Use alphanumeric characters only and start with a letter.`);
    });
});

describe('validateIconPath', () =>
{
    let dir: string;

    beforeEach(() =>
    {
        dir = createTempDir('cli-validators');
        writeFiles(dir, { 'icons/icon.png': 'png' });
    });

    afterEach(() =>
    {
        removeTempDir(dir);
    });

    it.each(['icons/icon.png', './icons/icon.png', 'other/../icons/icon.png'])('accepts %s, relative to the folder', (icon) =>
    {
        expect(() => validateIconPath(icon, dir)).not.toThrow();
    });

    it('accepts an absolute path', () =>
    {
        expect(() => validateIconPath(path.join(dir, 'icons', 'icon.png'), os.tmpdir())).not.toThrow();
    });

    it('rejects a missing file and gives the path it looked for', () =>
    {
        expect(() => validateIconPath('icons/other.png', dir)).toThrow(`Cannot find the icon 'icons/other.png': there is no file at '${path.join(dir, 'icons', 'other.png')}'.`);
    });

    it('rejects a folder', () =>
    {
        expect(fs.statSync(path.join(dir, 'icons')).isDirectory()).toBe(true);
        expect(() => validateIconPath('icons', dir)).toThrow(`Cannot find the icon 'icons'`);
    });

    it('names the item in the message', () =>
    {
        expect(() => validateIconPath('missing.png', dir, 'Gauge')).toThrow(`Cannot find the icon 'missing.png' of 'Gauge':`);
    });
});

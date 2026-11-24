import { describe, expect, it } from 'vitest';
import { validateGeneratedName } from '../../src/utils/validators.js';

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

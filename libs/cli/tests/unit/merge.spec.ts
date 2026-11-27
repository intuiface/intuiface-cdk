import { describe, expect, it } from 'vitest';
import { addMissingValues, appendMissingLines, mergeJsonText, parseJsonObject } from '../../src/utils/merge.js';

describe('merge', () =>
{
    describe('parseJsonObject', () =>
    {
        it('parses a JSON object', () =>
        {
            expect(parseJsonObject('{ "a": 1 }')).toEqual({ a: 1 });
        });

        it.each([
            ['invalid JSON', '{ a: 1 }'],
            ['JSON with comments', '{\n  // comment\n  "a": 1\n}'],
            ['an array', '[1, 2]'],
            ['a string', '"text"'],
            ['null', 'null']
        ])('rejects %s', (label, text) =>
        {
            expect(parseJsonObject(text)).toBeUndefined();
        });
    });

    describe('addMissingValues', () =>
    {
        it('keeps the existing values and adds the missing ones', () =>
        {
            const target = { a: 'mine', nested: { x: 'mine', list: [1] } };

            const merged = addMissingValues(target, { a: 'default', b: 'default', nested: { x: 'default', y: 'default', list: [2, 3] } });

            expect(merged).toEqual({ a: 'mine', nested: { x: 'mine', list: [1], y: 'default' }, b: 'default' });
            expect(target).toEqual({ a: 'mine', nested: { x: 'mine', list: [1] } });
        });

        it('keeps the key order of the existing object', () =>
        {
            const merged = addMissingValues({ z: 1, a: 1 }, { b: 2, a: 2, c: 2 });

            expect(Object.keys(merged)).toEqual(['z', 'a', 'b', 'c']);
        });

        it('keeps an existing value of another type', () =>
        {
            expect(addMissingValues({ a: 'text', b: null }, { a: { x: 1 }, b: { x: 1 } })).toEqual({ a: 'text', b: null });
        });
    });

    describe('mergeJsonText', () =>
    {
        it('returns undefined when nothing is missing', () =>
        {
            expect(mergeJsonText('{ "a": 1, "b": 2 }', '{ "a": 3 }')).toBeUndefined();
        });

        it('returns undefined when the existing file is not plain JSON', () =>
        {
            expect(mergeJsonText('{\n  // comment\n  "a": 1\n}', '{ "b": 2 }')).toBeUndefined();
        });

        it('keeps the indentation of the existing file', () =>
        {
            expect(mergeJsonText('{\n    "a": 1\n}\n', '{ "b": 2 }')).toBe('{\n    "a": 1,\n    "b": 2\n}\n');
            expect(mergeJsonText('{\n\t"a": 1\n}', '{ "b": 2 }')).toBe('{\n\t"a": 1,\n\t"b": 2\n}\n');
        });

        it('keeps CRLF line endings', () =>
        {
            expect(mergeJsonText('{\r\n  "a": 1\r\n}\r\n', '{ "b": 2 }')).toBe('{\r\n  "a": 1,\r\n  "b": 2\r\n}\r\n');
        });
    });

    describe('appendMissingLines', () =>
    {
        const template = '# compiled output\n/dist\n\n# temp build output\n/tmp\n\n# dependencies\nnode_modules/\n';

        it('appends the missing entries under a header', () =>
        {
            expect(appendMissingLines('node_modules\n.env\n', template, '# Intuiface workspace'))
                .toBe('node_modules\n.env\n\n# Intuiface workspace\n/dist\n/tmp\n');
        });

        it('treats /dist, dist and dist/ as the same entry', () =>
        {
            expect(appendMissingLines('dist/\ntmp\n/node_modules\n', template, '# header')).toBeUndefined();
        });

        it('ignores the comments of both files', () =>
        {
            expect(appendMissingLines('# /dist\n', '# comment\n/dist\n', '# header')).toBe('# /dist\n\n# header\n/dist\n');
        });

        it('adds a line break after a last line without one', () =>
        {
            expect(appendMissingLines('.env', '/dist\n', '# header')).toBe('.env\n\n# header\n/dist\n');
        });

        it('keeps CRLF line endings', () =>
        {
            expect(appendMissingLines('.env\r\n', '/dist\r\n', '# header')).toBe('.env\r\n\r\n# header\r\n/dist\r\n');
        });
    });
});

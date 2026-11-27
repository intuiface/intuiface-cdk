import { describe, expect, it } from 'vitest';
import { ensureMinimumDependencies, formatDependencyUpdates, isLowerVersionRange } from '../../src/utils/dependencies.js';

describe('dependencies', () =>
{
    describe('isLowerVersionRange', () =>
    {
        it.each([
            ['~5.4.0', '6.0.3'],
            ['^5.8.0', '6.0.3'],
            ['^9.4.2', '^9.6.2'],
            ['^7.2.1', '^7.2.2'],
            ['5', '6.0.3'],
            ['6.x', '6.0.3'],
            ['2.1.0', '2.3.0'],
            ['>=1.2.0', '^2.0.0'],
            ['6.0.3-beta.1', '6.0.3'],
            ['v6.0.2', '6.0.3']
        ])('%s is lower than %s', (range, required) =>
        {
            expect(isLowerVersionRange(range, required)).toBe(true);
        });

        it.each([
            ['6.0.3', '6.0.3'],
            ['^6.0.3', '6.0.3'],
            ['~6.1.0', '6.0.3'],
            ['^99.0.0', '^5.109.2'],
            ['^7.2.2', '^7.2.2'],
            ['6.0.3', '6.0.3-beta.1']
        ])('%s is not lower than %s', (range, required) =>
        {
            expect(isLowerVersionRange(range, required)).toBe(false);
        });

        it.each([
            'latest',
            '*',
            'x',
            '',
            '>=5 <7',
            '^5.0.0 || ^6.0.0',
            '1.0.0 - 2.0.0',
            '<6.0.0',
            'github:microsoft/TypeScript',
            'file:../typescript',
            'npm:typescript@5'
        ])('leaves the unrecognized range "%s" to the developer', (range) =>
        {
            expect(isLowerVersionRange(range, '6.0.3')).toBe(false);
        });

        it('never asks to change a dependency for an unrecognized required version', () =>
        {
            expect(isLowerVersionRange('2.1.0', 'latest')).toBe(false);
        });
    });

    describe('ensureMinimumDependencies', () =>
    {
        it('adds the missing dependencies to the given section', () =>
        {
            const packageJson: Record<string, unknown> = { name: 'project' };

            const updates = ensureMinimumDependencies(packageJson, 'devDependencies', { typescript: '6.0.3' });

            expect(packageJson).toEqual({ name: 'project', devDependencies: { typescript: '6.0.3' } });
            expect(updates).toEqual([{ name: 'typescript', from: undefined, to: '6.0.3' }]);
        });

        it('raises lower versions and keeps equal, newer and unrecognized ones', () =>
        {
            const packageJson: Record<string, unknown> = {
                devDependencies: { 'typescript': '~5.4.0', 'webpack': '^99.0.0', 'webpack-cli': '^7.2.2', 'ts-loader': 'github:me/ts-loader' }
            };

            const updates = ensureMinimumDependencies(packageJson, 'devDependencies', {
                'typescript': '6.0.3',
                'webpack': '^5.109.2',
                'webpack-cli': '^7.2.2',
                'ts-loader': '^9.6.2'
            });

            expect(packageJson.devDependencies).toEqual({
                'typescript': '6.0.3',
                'webpack': '^99.0.0',
                'webpack-cli': '^7.2.2',
                'ts-loader': 'github:me/ts-loader'
            });
            expect(updates).toEqual([{ name: 'typescript', from: '~5.4.0', to: '6.0.3' }]);
        });

        it('updates a dependency where it is declared', () =>
        {
            const packageJson: Record<string, unknown> = { dependencies: { typescript: '~5.4.0' }, devDependencies: {} };

            ensureMinimumDependencies(packageJson, 'devDependencies', { typescript: '6.0.3' });

            expect(packageJson).toEqual({ dependencies: { typescript: '6.0.3' }, devDependencies: {} });
        });

        it('keeps the key order of the section', () =>
        {
            const packageJson: Record<string, unknown> = { dependencies: { b: '1.0.0', a: '1.0.0' } };

            ensureMinimumDependencies(packageJson, 'dependencies', { a: '2.0.0', c: '1.0.0' });

            expect(Object.keys(packageJson.dependencies as object)).toEqual(['b', 'a', 'c']);
        });
    });

    describe('formatDependencyUpdates', () =>
    {
        it('lists raised and added dependencies', () =>
        {
            expect(formatDependencyUpdates([
                { name: 'typescript', from: '~5.4.0', to: '6.0.3' },
                { name: 'webpack-cli', to: '^7.2.2' }
            ])).toBe('typescript ~5.4.0 → 6.0.3, webpack-cli ^7.2.2 (added)');
        });
    });
});

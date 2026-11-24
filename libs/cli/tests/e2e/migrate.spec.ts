import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { repoRoot } from '../helpers/test-utils.js';
import { assertBuiltPackages, createE2EDir, readIfd, removeE2EDir, runCli, withoutVersion } from './e2e-utils.js';

const bindingConverterSchematicFiles = path.join(repoRoot, 'libs', 'tools', 'schematics', 'binding-converter-schematics', 'src', 'create', 'files');

/**
 * Create a project as the 2.x binding-converter schematic does (EJS placeholders rendered by hand).
 */
const scaffoldSchematicProject = (dir: string, name: string, category: string): void =>
{
    const render = (text: string): string => text
        .replace(/<%= camelize\(bindingConverterName\) %>/g, `${name.charAt(0).toLowerCase()}${name.slice(1)}`)
        .replace(/<%= bindingConverterName %>/g, name)
        .replace(/<%= bindingConverterCategory %>/g, category);

    for (const file of ['package.json', 'tsconfig.json', 'webpack.config.js', 'webpack-debug.config.js'])
    {
        fs.writeFileSync(path.join(dir, file), render(fs.readFileSync(path.join(bindingConverterSchematicFiles, file), 'utf8')));
    }
    fs.ensureDirSync(path.join(dir, 'src'));
    fs.writeFileSync(
        path.join(dir, 'src', `${name}.ts`),
        render(fs.readFileSync(path.join(bindingConverterSchematicFiles, 'src', '__bindingConverterName__.ts'), 'utf8'))
    );
    fs.copySync(path.join(bindingConverterSchematicFiles, 'icon_converter_32.png'), path.join(dir, 'icon_converter_32.png'));
};

describe('2.x binding converter project', () =>
{
    let dir: string;
    let legacyIfd: Record<string, unknown>;

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('migrate');
        scaffoldSchematicProject(dir, 'LegacyConverter', 'Legacy Tools');
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('still builds without migrating (legacy mode, project webpack config)', () =>
    {
        const result = runCli(dir, 'build', '-n', 'LegacyConverter', '-t', 'binding-converter');

        expect(result.status, result.output).toBe(0);
        legacyIfd = readIfd(dir, 'LegacyConverter');
        expect(legacyIfd).toMatchObject({
            'name': 'LegacyConverter',
            'if.category': 'Legacy Tools',
            'icons': { x32: 'icon_converter_32.png' },
            'resources': { LegacyConverter: { methods: { legacyConverter: { id: 'LegacyConverter.legacyConverter' } } } }
        });
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'LegacyConverter.js'))).toBe(true);
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'icon_converter_32.png'))).toBe(true);
        expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
    });

    it('migrates to a workspace', () =>
    {
        const result = runCli(dir, 'migrate');

        expect(result.status, result.output).toBe(0);
        expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual({
            version: 1,
            name: 'LegacyConverter',
            items: [{ name: 'LegacyConverter', type: 'binding-converter', entry: 'src/LegacyConverter.ts', icon: 'icon_converter_32.png' }]
        });
        expect(fs.readJsonSync(path.join(dir, 'package.json')).scripts.build).toBe('npx intuiface-cli build --all');
        expect(fs.existsSync(path.join(dir, 'webpack.config.js'))).toBe(false);
        expect(fs.existsSync(path.join(dir, 'webpack-debug.config.js'))).toBe(false);
    });

    it('builds the same descriptor once migrated', () =>
    {
        const result = runCli(dir, 'build', '--all');

        expect(result.status, result.output).toBe(0);
        expect(withoutVersion(readIfd(dir, 'LegacyConverter'))).toEqual(withoutVersion(legacyIfd));
        expect(fs.existsSync(path.join(dir, 'dist', 'LegacyConverter', 'LegacyConverter.js'))).toBe(true);
    });

    it('reports that a workspace needs no migration', () =>
    {
        const result = runCli(dir, 'migrate');

        expect(result.status).toBe(0);
        expect(result.output).toContain('Already using workspace mode. No migration needed.');
    });
});

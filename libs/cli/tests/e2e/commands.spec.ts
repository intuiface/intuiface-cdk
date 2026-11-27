import fs from 'fs-extra';
import path from 'path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { assertBuiltPackages, CliResult, createE2EDir, removeE2EDir, runBin, runCli, runCliOrThrow, runCliWithPreload } from './e2e-utils.js';

/**
 * Expect a failure reported as `✖ <message>`, with exit code 1 and no stack trace.
 */
const expectUserError = (result: CliResult, message: string): void =>
{
    expect(result.status, result.output).toBe(1);
    expect(result.stderr).toContain(`✖ ${message}`);
    expect(result.stderr).not.toMatch(/^\s+at /m);
};

describe('CLI commands', () =>
{
    let dir: string;

    beforeAll(() =>
    {
        assertBuiltPackages();
    });

    beforeEach(() =>
    {
        dir = createE2EDir('commands');
    });

    afterEach(() =>
    {
        removeE2EDir(dir);
    });

    describe('help', () =>
    {
        it('lists the commands', () =>
        {
            const result = runCli(dir, '--help');

            expect(result.status).toBe(0);
            for (const command of ['build', 'init', 'add', 'migrate'])
            {
                expect(result.stdout).toMatch(new RegExp(`^\\s+${command}\\b`, 'm'));
            }
        });

        it('lists the item types of add', () =>
        {
            const result = runCli(dir, 'add', '--help');

            expect(result.status).toBe(0);
            expect(result.stdout).toContain('interface-asset');
            expect(result.stdout).toContain('binding-converter');
        });

        it('documents the build options', () =>
        {
            const result = runCli(dir, 'build', '--help');

            expect(result.status).toBe(0);
            for (const option of ['--name <name>', '--all', '--debug', '--type <type>', '--icon <icon>'])
            {
                expect(result.stdout).toContain(option);
            }
        });

        it('rejects an unknown command', () =>
        {
            const result = runCli(dir, 'deploy');

            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain(`unknown command 'deploy'`);
        });
    });

    describe('startup', () =>
    {
        const forbidJsdom = path.join(import.meta.dirname, 'forbid-jsdom.mjs');

        it('does not load jsdom outside build (review O12: importing it takes more than a second)', () =>
        {
            for (const args of [
                ['--help'],
                ['init'],
                ['add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom'],
                ['add', 'binding-converter', '-n', 'MyConverter', '-c', 'Custom'],
                ['build']
            ])
            {
                const result = runCliWithPreload(dir, forbidJsdom, ...args);
                expect(result.output, args.join(' ')).not.toContain('jsdom must only be loaded by build');
            }
        });

        it('checks the Node.js version before loading any package (review R10)', () =>
        {
            const result = runCliWithPreload(dir, path.join(import.meta.dirname, 'old-node.mjs'), '--help');

            expect(result.status, result.output).toBe(1);
            expect(result.stderr).toBe('Error: Intuiface CLI requires Node.js >= 22. Currently running v18.20.0.\n');
        });

        it('loads jsdom to build (checks the guard of the previous test)', () =>
        {
            runCliOrThrow(dir, 'init');
            runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom');

            const result = runCliWithPreload(dir, forbidJsdom, 'build', '-n', 'MyAsset');

            expect(result.status).not.toBe(0);
            expect(result.output).toContain('jsdom must only be loaded by build');
        });
    });

    describe('init', () =>
    {
        it('creates a workspace without asking questions when stdin is not a terminal', () =>
        {
            const result = runCliOrThrow(dir, 'init', '-n', 'my-workspace');

            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual({ version: 1, name: 'my-workspace', items: [] });
            expect(result.stdout).toMatch(/CREATE \.gitignore/);
            expect(result.stdout).toMatch(/CREATE eslint\.config\.mjs/);
            expect(fs.existsSync(path.join(dir, '.gitignore'))).toBe(true);
        });

        it('ends with the next steps, as it neither adds an item nor installs dependencies (review O4)', () =>
        {
            const result = runCliOrThrow(dir, 'init');

            expect(result.stdout).toMatch(/Next steps:\n.*\n\s+npm install\n/);
            expect(result.stdout).toContain('npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom');
            expect(result.stdout).toMatch(/^\s+npm run build$/m);
        });

        it('refuses to run twice', () =>
        {
            runCliOrThrow(dir, 'init');

            expectUserError(runCli(dir, 'init'), `An Intuiface workspace already exists in '${dir}'.`);
        });
    });

    describe('add', () =>
    {
        it('fails outside a workspace', () =>
        {
            expectUserError(runCli(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom'), 'Cannot find intuiface.workspace.json');
        });

        it('rejects an invalid name', () =>
        {
            runCliOrThrow(dir, 'init');

            expectUserError(runCli(dir, 'add', 'interface-asset', '-n', 'my-asset', '-c', 'Custom'), `Invalid name 'my-asset'.`);
        });

        it('rejects a duplicate item', () =>
        {
            runCliOrThrow(dir, 'init');
            runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom');

            expectUserError(runCli(dir, 'add', 'binding-converter', '-n', 'MyAsset', '-c', 'Custom'), `A workspace item named 'MyAsset' already exists.`);
        });

        it('rejects a missing icon without writing anything (review O6)', () =>
        {
            runCliOrThrow(dir, 'init');

            expectUserError(runCli(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom', '-i', 'icons/missing.png'), `Cannot find the icon 'icons/missing.png'`);
            expect(fs.existsSync(path.join(dir, 'src', 'interface-assets', 'MyAsset'))).toBe(false);
            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json')).items).toEqual([]);
        });

        it('requires a category', () =>
        {
            runCliOrThrow(dir, 'init');

            const result = runCli(dir, 'add', 'interface-asset', '-n', 'MyAsset');

            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain(`required option '-c, --category <category>' not specified`);
        });
    });

    describe('build errors', () =>
    {
        beforeEach(() =>
        {
            runCliOrThrow(dir, 'init');
        });

        it('requires --name or --all in a workspace', () =>
        {
            expectUserError(runCli(dir, 'build'), `Workspace build requires either '--name <name>' or '--all'.`);
        });

        it('rejects an unknown item', () =>
        {
            expectUserError(runCli(dir, 'build', '-n', 'Unknown'), `Cannot find workspace item 'Unknown'.`);
        });

        it('warns that an empty workspace has nothing to build (review O9)', () =>
        {
            const result = runCliOrThrow(dir, 'build', '--all');

            expect(result.stdout).toContain('Nothing to build: intuiface.workspace.json has no items yet.');
            expect(result.stdout).toContain('npx intuiface-cli add interface-asset');
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist'))).toBe(false);
        });

        it('requires a value for --icon (review O7)', () =>
        {
            const result = runCli(dir, 'build', '-n', 'Unknown', '-i');

            expect(result.status).not.toBe(0);
            expect(result.stderr).toContain(`option '-i, --icon <icon>' argument missing`);
        });

        it('rejects --icon when building every item (review O7)', () =>
        {
            expectUserError(runCli(dir, 'build', '--all', '-i', 'icon.png'), `'--icon' cannot be used to build every item.`);
        });

        it('reports a missing icon before compiling (review O6)', () =>
        {
            runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', 'Custom');

            const result = runCli(dir, 'build', '-n', 'MyAsset', '-i', 'icons/missing.png');

            expectUserError(result, `Cannot find the icon 'icons/missing.png' of 'MyAsset'`);
            expect(result.output).not.toContain('Compiling TypeScript');
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
        });

        it('requires --name outside a workspace', () =>
        {
            fs.removeSync(path.join(dir, 'intuiface.workspace.json'));

            expectUserError(runCli(dir, 'build'), `Legacy build mode requires '--name <name>'.`);
        });

        it('reports TypeScript errors with their location and cleans up', () =>
        {
            runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'Broken', '-c', 'Custom');
            const entry = path.join(dir, 'src', 'interface-assets', 'Broken', 'Broken.ts');
            fs.appendFileSync(entry, `\nexport const broken: number = 'not a number';\n`);

            const result = runCli(dir, 'build', '-n', 'Broken');

            expect(result.status).not.toBe(0);
            expect(result.output).toMatch(/Broken\.ts \(\d+,\d+\): Type 'string' is not assignable to type 'number'\./);
            expect(result.output).toContain('TypeScript compilation failed.');
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist', 'Broken'))).toBe(false);
        });
    });
});

describe('generated workspace', () =>
{
    let dir: string;

    beforeAll(() =>
    {
        assertBuiltPackages();
        dir = createE2EDir('lint');
        runCliOrThrow(dir, 'init');
        runCliOrThrow(dir, 'add', 'interface-asset', '-n', 'MyAsset', '-c', `Bob's tools`);
        runCliOrThrow(dir, 'add', 'binding-converter', '-n', 'MyConverter', '-c', 'Custom');
    });

    afterAll(() =>
    {
        removeE2EDir(dir);
    });

    it('passes its own lint rules', () =>
    {
        const result = runBin(dir, 'eslint', 'eslint', '.');

        expect(result.status, result.output).toBe(0);
    });

    it('type-checks with the workspace tsconfig', () =>
    {
        const result = runBin(dir, 'typescript', 'tsc', '--noEmit', '-p', 'tsconfig.json');

        expect(result.status, result.output).toBe(0);
    });
});

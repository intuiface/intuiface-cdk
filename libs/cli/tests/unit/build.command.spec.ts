import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { runBuildCommand } from '../../src/commands/build.command.js';
import { writeWorkspaceConfig } from '../../src/services/workspace.service.js';
import { createTempDir, getConsoleOutput, removeTempDir, silenceConsole, useCwd } from '../helpers/test-utils.js';

/** Messages given to a method of the (silent) ora spinners, e.g. `warn`. */
const spinnerMessages = (method: 'warn'): string[] => vi.mocked(ora).mock.results
    .flatMap((result) => (result.value as Record<string, Mock>)[method].mock.calls.map((call) => String(call[0] ?? '')));

/**
 * Option validation of `build`. Builds themselves are covered by the end-to-end tests.
 */
describe('build command options', () =>
{
    let dir: string;
    let restoreCwd: () => void;

    beforeEach(() =>
    {
        dir = createTempDir('cli-build-command');
        restoreCwd = useCwd(dir);
        vi.mocked(ora).mockClear();
    });

    afterEach(() =>
    {
        restoreCwd();
        removeTempDir(dir);
    });

    describe('in a workspace', () =>
    {
        beforeEach(() =>
        {
            writeWorkspaceConfig(dir, {
                version: 1,
                name: 'ws',
                items: [{ name: 'Alpha', type: 'interface-asset', entry: 'src/interface-assets/Alpha/Alpha.ts' }]
            });
        });

        it('requires --name or --all', async () =>
        {
            await expect(runBuildCommand({})).rejects.toThrow(`Workspace build requires either '--name <name>' or '--all'.`);
            await expect(runBuildCommand({ name: '' })).rejects.toThrow(`Workspace build requires either '--name <name>' or '--all'.`);
        });

        it('rejects an item that is not in the workspace', async () =>
        {
            await expect(runBuildCommand({ name: 'Unknown' })).rejects.toThrow(`Cannot find workspace item 'Unknown'.`);
        });

        it('ignores --type (read from intuiface.workspace.json)', async () =>
        {
            await expect(runBuildCommand({ name: 'Unknown', type: 'not-a-type' })).rejects.toThrow(`Cannot find workspace item 'Unknown'.`);
        });

        it('gives --name priority over --all, so that `npm run build -- -n X` builds X only (review O8)', async () =>
        {
            // The generated `build` script passes --all: the name given after `--` must still select the item
            await expect(runBuildCommand({ all: true, name: 'Unknown' })).rejects.toThrow(`Cannot find workspace item 'Unknown'.`);
        });

        it('rejects --icon when building every item (review O7)', async () =>
        {
            await expect(runBuildCommand({ all: true, icon: 'icon.png' }))
                .rejects.toThrow(`'--icon' cannot be used to build every item. Set the icon of each item in intuiface.workspace.json, or build one item with '--name <name> --icon <icon>'.`);
        });

        it('accepts --icon for the item selected with --name, even with --all', async () =>
        {
            // Rejected for the missing file, not for the option: the icon applies to Alpha only
            await expect(runBuildCommand({ all: true, name: 'Alpha', icon: 'missing.png' })).rejects.toThrow(`Cannot find the icon 'missing.png' of 'Alpha'`);
        });

        it('checks the item icons before building anything (review O6)', async () =>
        {
            writeWorkspaceConfig(dir, {
                version: 1,
                name: 'ws',
                items: [
                    { name: 'Alpha', type: 'interface-asset', entry: 'src/interface-assets/Alpha/Alpha.ts' },
                    { name: 'Beta', type: 'interface-asset', entry: 'src/interface-assets/Beta/Beta.ts', icon: 'icons/beta.png' }
                ]
            });

            await expect(runBuildCommand({ all: true }))
                .rejects.toThrow(`Cannot find the icon 'icons/beta.png' of 'Beta': there is no file at '${path.join(dir, 'icons', 'beta.png')}'.`);
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist'))).toBe(false);
        });

        it('warns and points to add when there is no item to build (review O9)', async () =>
        {
            writeWorkspaceConfig(dir, { version: 1, name: 'ws', items: [] });
            const log = silenceConsole();

            await expect(runBuildCommand({ all: true })).resolves.toBeUndefined();

            const output = getConsoleOutput(log);
            expect(output).toContain('⚠ Nothing to build: intuiface.workspace.json has no items yet. Add one with:');
            expect(output).toContain('npx intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom');
            expect(output).toContain('npx intuiface-cli add binding-converter -n MyBindingConverter -c Custom');
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist'))).toBe(false);
        });

        it('warns that webpack.config.js is not used in a workspace (review O1)', async () =>
        {
            writeWorkspaceConfig(dir, { version: 1, name: 'ws', items: [] });
            fs.writeFileSync(path.join(dir, 'webpack.config.js'), 'module.exports = {};\n');
            silenceConsole();

            await runBuildCommand({ all: true });

            expect(spinnerMessages('warn')).toEqual(['webpack.config.js is not used to build a workspace. Move its changes to webpack.config.cjs, then delete it.']);
        });

        it('does not warn without legacy webpack config', async () =>
        {
            writeWorkspaceConfig(dir, { version: 1, name: 'ws', items: [] });
            silenceConsole();

            await runBuildCommand({ all: true });

            expect(spinnerMessages('warn')).toEqual([]);
        });

        it('reports an invalid workspace file', async () =>
        {
            writeWorkspaceConfig(dir, { version: 1, name: 'ws' } as never);

            await expect(runBuildCommand({ all: true })).rejects.toThrow('Invalid workspace configuration');
        });
    });

    describe('outside a workspace (legacy projects)', () =>
    {
        it('requires --name', async () =>
        {
            await expect(runBuildCommand({})).rejects.toThrow(`Legacy build mode requires '--name <name>'.`);
            await expect(runBuildCommand({ all: true })).rejects.toThrow(`Legacy build mode requires '--name <name>'.`);
        });

        it('checks the --icon file before building', async () =>
        {
            await expect(runBuildCommand({ name: 'Alpha', icon: './missing.png' })).rejects.toThrow(`Cannot find the icon './missing.png' of 'Alpha'`);
            expect(fs.existsSync(path.join(dir, 'tmp'))).toBe(false);
            expect(fs.existsSync(path.join(dir, 'dist'))).toBe(false);
        });

        it('rejects an unknown --type', async () =>
        {
            await expect(runBuildCommand({ name: 'Alpha', type: 'custom-asset' }))
                .rejects.toThrow(`Unsupported build type 'custom-asset'. Expected 'interface-asset' or 'binding-converter'.`);
        });
    });
});

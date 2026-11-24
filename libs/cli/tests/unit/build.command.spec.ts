import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runBuildCommand } from '../../src/commands/build.command.js';
import { writeWorkspaceConfig } from '../../src/services/workspace.service.js';
import { createTempDir, removeTempDir, useCwd } from '../helpers/test-utils.js';

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

        it('rejects an unknown --type', async () =>
        {
            await expect(runBuildCommand({ name: 'Alpha', type: 'custom-asset' }))
                .rejects.toThrow(`Unsupported build type 'custom-asset'. Expected 'interface-asset' or 'binding-converter'.`);
        });
    });
});

import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeWorkspace } from '../../src/commands/init.command.js';
import { askWorkspaceInitQuestions } from '../../src/services/prompt.service.js';
import { execPromise } from '../../src/utils/exec.js';
import { createTempDir, removeTempDir, silenceConsole, useCwd } from '../helpers/test-utils.js';

vi.mock('../../src/services/prompt.service.js', () => ({
    askWorkspaceInitQuestions: vi.fn()
}));

vi.mock('../../src/utils/exec.js', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../../src/utils/exec.js')>()),
    execPromise: vi.fn()
}));

/**
 * Force the interactive or non-interactive mode of `init`.
 */
const setTty = (isTty: boolean): (() => void) =>
{
    const stdinTty = process.stdin.isTTY;
    const stdoutTty = process.stdout.isTTY;
    Object.defineProperty(process.stdin, 'isTTY', { value: isTty, configurable: true });
    Object.defineProperty(process.stdout, 'isTTY', { value: isTty, configurable: true });
    return () =>
    {
        Object.defineProperty(process.stdin, 'isTTY', { value: stdinTty, configurable: true });
        Object.defineProperty(process.stdout, 'isTTY', { value: stdoutTty, configurable: true });
    };
};

describe('init command', () =>
{
    let rootDir: string;
    let dir: string;
    let restoreCwd: () => void;
    let restoreTty: () => void;

    beforeEach(() =>
    {
        rootDir = createTempDir('cli-init');
        dir = path.join(rootDir, 'my-workspace');
        fs.ensureDirSync(dir);
        restoreCwd = useCwd(dir);
        silenceConsole();
    });

    afterEach(() =>
    {
        restoreTty?.();
        restoreCwd();
        removeTempDir(rootDir);
    });

    describe('non-interactive', () =>
    {
        beforeEach(() =>
        {
            restoreTty = setTty(false);
        });

        it('creates a workspace named after the current folder', async () =>
        {
            await initializeWorkspace();

            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual({ version: 1, name: 'my-workspace', items: [] });
            expect(fs.readJsonSync(path.join(dir, 'package.json')).name).toBe('my-workspace');
        });

        it('uses the name given with --name', async () =>
        {
            await initializeWorkspace('  custom-name  ');

            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json')).name).toBe('custom-name');
            expect(fs.readJsonSync(path.join(dir, 'package.json')).name).toBe('custom-name');
        });

        it('falls back to the folder name when --name is blank', async () =>
        {
            await initializeWorkspace('   ');

            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json')).name).toBe('my-workspace');
        });

        it('generates every workspace file', async () =>
        {
            await initializeWorkspace();

            for (const file of ['package.json', 'intuiface.workspace.json', 'tsconfig.json', '.nvmrc', '.gitignore', 'eslint.config.mjs', '.vscode/settings.json', '.vscode/extensions.json'])
            {
                expect(fs.existsSync(path.join(dir, file)), file).toBe(true);
            }
            expect(fs.statSync(path.join(dir, 'src', 'interface-assets')).isDirectory()).toBe(true);
            expect(fs.statSync(path.join(dir, 'src', 'binding-converters')).isDirectory()).toBe(true);
            expect(fs.readFileSync(path.join(dir, '.nvmrc'), 'utf8')).toBe('22\n');
            expect(JSON.parse(fs.readFileSync(path.join(dir, 'tsconfig.json'), 'utf8')).compilerOptions.rootDir).toBe('./src');
        });

        it('neither creates an item nor installs dependencies', async () =>
        {
            await initializeWorkspace();

            expect(askWorkspaceInitQuestions).not.toHaveBeenCalled();
            expect(execPromise).not.toHaveBeenCalled();
            expect(fs.existsSync(path.join(dir, 'node_modules'))).toBe(false);
        });

        it('refuses to initialize a folder twice', async () =>
        {
            await initializeWorkspace();

            await expect(initializeWorkspace()).rejects.toThrow(`An Intuiface workspace already exists in '${process.cwd()}'.`);
        });
    });

    describe('interactive', () =>
    {
        beforeEach(() =>
        {
            restoreTty = setTty(true);
            vi.mocked(execPromise).mockResolvedValue({ stdout: 'added 42 packages\nfound 0 vulnerabilities\n', stderr: '' });
        });

        it('creates the workspace and the first item from the answers, then runs npm install', async () =>
        {
            vi.mocked(askWorkspaceInitQuestions).mockResolvedValue({
                workspaceName: 'answered-name',
                firstItem: { type: 'binding-converter', name: 'FirstConverter', category: 'Text' }
            });

            await initializeWorkspace();

            expect(askWorkspaceInitQuestions).toHaveBeenCalledWith('my-workspace');
            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json'))).toEqual({
                version: 1,
                name: 'answered-name',
                items: [{
                    name: 'FirstConverter',
                    type: 'binding-converter',
                    entry: 'src/binding-converters/FirstConverter/FirstConverter.ts',
                    icon: 'src/binding-converters/FirstConverter/icon_converter_32.png'
                }]
            });
            expect(execPromise).toHaveBeenCalledWith('npm install', { cwd: dir });
        });

        it('proposes the --name value as default workspace name', async () =>
        {
            vi.mocked(askWorkspaceInitQuestions).mockResolvedValue({
                workspaceName: 'from-option',
                firstItem: { type: 'interface-asset', name: 'FirstAsset', category: 'Custom', icon: 'icon.png' }
            });

            await initializeWorkspace('from-option');

            expect(askWorkspaceInitQuestions).toHaveBeenCalledWith('from-option');
            expect(fs.readJsonSync(path.join(dir, 'intuiface.workspace.json')).items[0]).toEqual({
                name: 'FirstAsset',
                type: 'interface-asset',
                entry: 'src/interface-assets/FirstAsset/FirstAsset.ts',
                icon: 'icon.png'
            });
        });

        it('reports npm install failures', async () =>
        {
            vi.mocked(askWorkspaceInitQuestions).mockResolvedValue({
                workspaceName: 'ws',
                firstItem: { type: 'interface-asset', name: 'FirstAsset', category: 'Custom' }
            });
            vi.mocked(execPromise).mockRejectedValue(Object.assign(new Error('Command failed'), { cmd: 'npm install', code: 1, stderr: 'ERESOLVE', stdout: '' }));

            await expect(initializeWorkspace()).rejects.toThrow('npm install failed: ERESOLVE');
        });
    });
});

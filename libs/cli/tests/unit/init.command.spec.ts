import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeWorkspace } from '../../src/commands/init.command.js';
import { createWorkspacePackageJson, WORKSPACE_BUILD_DEV_DEPENDENCIES } from '../../src/services/generator.service.js';
import { askWorkspaceInitQuestions } from '../../src/services/prompt.service.js';
import { execPromise } from '../../src/utils/exec.js';
import { createTempDir, removeTempDir, silenceConsole, useCwd, writeFiles } from '../helpers/test-utils.js';

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
    let log: ReturnType<typeof silenceConsole>;

    /** Lines printed by the command. */
    const getOutput = (): string => log.mock.calls.map((call) => String(call[0])).join('\n');

    beforeEach(() =>
    {
        rootDir = createTempDir('cli-init');
        dir = path.join(rootDir, 'my-workspace');
        fs.ensureDirSync(dir);
        restoreCwd = useCwd(dir);
        log = silenceConsole();
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

        it('reports the files it creates', async () =>
        {
            await initializeWorkspace();

            const output = getOutput();
            for (const file of ['package.json', 'intuiface.workspace.json', 'tsconfig.json', '.nvmrc', '.gitignore', 'eslint.config.mjs', '.vscode/settings.json'])
            {
                expect(output, file).toMatch(new RegExp(`CREATE.* ${file.replace(/\./g, '\\.')} \\(\\d+ bytes\\)`));
            }
            expect(output).not.toMatch(/UPDATE|SKIP|⚠/);
        });
    });

    describe('in a folder with existing files', () =>
    {
        beforeEach(() =>
        {
            restoreTty = setTty(false);
        });

        const readText = (file: string): string => fs.readFileSync(path.join(dir, file), 'utf8');

        it('completes an existing package.json and keeps its values', async () =>
        {
            writeFiles(dir, {
                'package.json': {
                    name: 'existing-name',
                    version: '0.3.0',
                    description: 'Mine',
                    scripts: { test: 'vitest' },
                    dependencies: { lodash: '^4.17.21' }
                }
            });

            await initializeWorkspace('workspace-name');

            const packageJson = fs.readJsonSync(path.join(dir, 'package.json'));
            const workspacePackageJson = createWorkspacePackageJson('workspace-name');
            expect(packageJson).toMatchObject({
                name: 'existing-name',
                version: '0.3.0',
                description: 'Mine',
                private: true,
                engines: { node: '>=22' },
                scripts: { test: 'vitest', ...workspacePackageJson.scripts },
                dependencies: { lodash: '^4.17.21', ...workspacePackageJson.dependencies },
                devDependencies: workspacePackageJson.devDependencies
            });
            expect(Object.keys(packageJson).slice(0, 5)).toEqual(['name', 'version', 'description', 'scripts', 'dependencies']);
        });

        it('raises lower dependency versions and never downgrades newer ones', async () =>
        {
            writeFiles(dir, {
                'package.json': {
                    name: 'existing',
                    dependencies: { '@intuiface/core': '2.1.0', 'typescript': '~5.4.0' },
                    devDependencies: { 'webpack': '^99.0.0', 'eslint': '^8.57.0', 'ts-loader': 'latest' }
                }
            });

            await initializeWorkspace();

            const packageJson = fs.readJsonSync(path.join(dir, 'package.json'));
            const workspacePackageJson = createWorkspacePackageJson('my-workspace');
            expect(packageJson.dependencies['@intuiface/core']).toBe(workspacePackageJson.dependencies['@intuiface/core']);
            expect(packageJson.dependencies.typescript).toBe(WORKSPACE_BUILD_DEV_DEPENDENCIES.typescript);
            expect(packageJson.devDependencies).not.toHaveProperty('typescript');
            expect(packageJson.devDependencies.webpack).toBe('^99.0.0');
            expect(packageJson.devDependencies.eslint).toBe(workspacePackageJson.devDependencies.eslint);
            expect(packageJson.devDependencies['ts-loader']).toBe('latest');

            const output = getOutput();
            expect(output).toMatch(/UPDATE.* package\.json/);
            expect(output).toContain(`typescript ~5.4.0 → ${WORKSPACE_BUILD_DEV_DEPENDENCIES.typescript}`);
        });

        it('keeps the scripts of an existing package.json and warns about them', async () =>
        {
            writeFiles(dir, { 'package.json': { name: 'existing', scripts: { build: 'tsc', lint: 'npx eslint .' } } });

            await initializeWorkspace();

            expect(fs.readJsonSync(path.join(dir, 'package.json')).scripts).toEqual({
                'build': 'tsc',
                'lint': 'npx eslint .',
                'build:debug': 'npx intuiface-cli build --all --debug'
            });
            const output = getOutput();
            expect(output).toContain(`package.json keeps its own 'build' script. The workspace one is 'npx intuiface-cli build --all'.`);
            expect(output).not.toContain(`'lint' script`);
        });

        it('stops without writing anything when package.json is invalid', async () =>
        {
            writeFiles(dir, { 'package.json': '{ "name": "broken", }' });

            await expect(initializeWorkspace()).rejects.toThrow(/package\.json': it is not a valid JSON object/);

            expect(fs.readdirSync(dir)).toEqual(['package.json']);
            expect(readText('package.json')).toBe('{ "name": "broken", }');
        });

        it('merges the VS Code settings and keeps the developer values', async () =>
        {
            writeFiles(dir, {
                '.vscode/settings.json': { 'editor.formatOnSave': true, 'files.eol': '\n' },
                '.vscode/extensions.json': { recommendations: ['esbenp.prettier-vscode'] }
            });

            await initializeWorkspace();

            const settings = fs.readJsonSync(path.join(dir, '.vscode', 'settings.json'));
            expect(settings['editor.formatOnSave']).toBe(true);
            expect(settings['files.eol']).toBe('\n');
            expect(settings['typescript.tsdk']).toBe('./node_modules/typescript/lib');
            expect(fs.readJsonSync(path.join(dir, '.vscode', 'extensions.json'))).toEqual({ recommendations: ['esbenp.prettier-vscode'] });
        });

        it('keeps a VS Code settings file with comments unchanged', async () =>
        {
            const settings = '{\n    // my settings\n    "editor.formatOnSave": true\n}\n';
            writeFiles(dir, { '.vscode/settings.json': settings });

            await initializeWorkspace();

            expect(readText('.vscode/settings.json')).toBe(settings);
            expect(getOutput()).toMatch(/SKIP.* \.vscode\/settings\.json \(existing file kept\)/);
        });

        it('adds the missing entries to an existing .gitignore', async () =>
        {
            writeFiles(dir, { '.gitignore': 'node_modules/\n.env\n' });

            await initializeWorkspace();

            expect(readText('.gitignore')).toBe('node_modules/\n.env\n\n# Intuiface workspace\n/dist\n/tmp\n');
        });

        it('keeps the other existing files', async () =>
        {
            writeFiles(dir, {
                'eslint.config.mjs': 'export default [];\n',
                '.nvmrc': '24\n'
            });

            await initializeWorkspace();

            expect(readText('eslint.config.mjs')).toBe('export default [];\n');
            expect(readText('.nvmrc')).toBe('24\n');
        });

        it('completes an existing tsconfig.json', async () =>
        {
            writeFiles(dir, { 'tsconfig.json': { compilerOptions: { strict: true, target: 'ES2023' } } });

            await initializeWorkspace();

            const tsconfig = fs.readJsonSync(path.join(dir, 'tsconfig.json'));
            expect(tsconfig.compilerOptions).toMatchObject({ strict: true, target: 'ES2023', rootDir: './src', experimentalDecorators: true });
            expect(tsconfig.include).toEqual(['**/src/**/*.ts']);
        });

        it('replaces blank files', async () =>
        {
            writeFiles(dir, { 'package.json': '', '.gitignore': '\n' });

            await initializeWorkspace();

            expect(fs.readJsonSync(path.join(dir, 'package.json')).name).toBe('my-workspace');
            expect(readText('.gitignore')).toMatch(/node_modules/);
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

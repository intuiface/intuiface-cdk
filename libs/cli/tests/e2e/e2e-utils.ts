import { spawnSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { pathToFileURL } from 'url';
import { createTempDir, repoRoot } from '../helpers/test-utils.js';

/** Built CLI entry point. */
export const distCliEntry = path.join(repoRoot, 'dist', 'libs', 'cli', 'src', 'cli.js');

/** Built core package. */
export const distCoreDir = path.join(repoRoot, 'dist', 'libs', 'core');

/**
 * Workspaces are created under the repository `tmp/` folder (git-ignored), so that Node.js and npx
 * resolve the workspace toolchain (typescript, webpack, ts-loader, eslint, ...) from the repository node_modules
 * without installing anything.
 */
const e2eRootDir = path.join(repoRoot, 'tmp', 'cli-e2e');

export interface CliResult
{
    status: number | null;
    stdout: string;
    stderr: string;
    /** stdout and stderr together. */
    output: string;
}

/**
 * Fail early with a clear message when the packages under test are not built.
 */
export const assertBuiltPackages = (): void =>
{
    for (const required of [distCliEntry, path.join(distCoreDir, 'package.json')])
    {
        if (!fs.existsSync(required))
        {
            throw new Error(`'${required}' not found. Build the packages first: npx nx run cli:e2e (or npx nx build core && npx nx build cli).`);
        }
    }
};

/**
 * Create an empty workspace folder where `@intuiface/core` and `@intuiface/cli` resolve to the built packages.
 */
export const createE2EDir = (prefix: string): string =>
{
    const dir = createTempDir(prefix, e2eRootDir);
    const scopeDir = path.join(dir, 'node_modules', '@intuiface');
    fs.ensureDirSync(scopeDir);
    // A junction needs no privilege on Windows; the type is ignored elsewhere
    fs.symlinkSync(distCoreDir, path.join(scopeDir, 'core'), 'junction');
    fs.symlinkSync(path.dirname(path.dirname(distCliEntry)), path.join(scopeDir, 'cli'), 'junction');
    return dir;
};

/**
 * Remove a workspace folder. The links are removed first so that the built packages are never touched.
 */
export const removeE2EDir = (dir: string | undefined): void =>
{
    if (dir == null || !fs.existsSync(dir))
    {
        return;
    }

    const scopeDir = path.join(dir, 'node_modules', '@intuiface');
    for (const link of ['core', 'cli'])
    {
        const linkPath = path.join(scopeDir, link);
        if (fs.existsSync(linkPath) || isLink(linkPath))
        {
            fs.unlinkSync(linkPath);
        }
    }
    fs.removeSync(dir);
};

const isLink = (linkPath: string): boolean =>
{
    try
    {
        return fs.lstatSync(linkPath).isSymbolicLink();
    }
    catch (_error)
    {
        return false;
    }
};

/**
 * Run a command and capture its output (colors disabled).
 */
const run = (command: string, args: string[], cwd: string): CliResult =>
{
    const result = spawnSync(command, args, {
        cwd: cwd,
        encoding: 'utf8',
        // stdin is a pipe, not a TTY: `init` runs in non-interactive mode
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
        timeout: 170_000
    });

    if (result.error)
    {
        throw result.error;
    }

    return {
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        output: `${result.stdout}\n${result.stderr}`
    };
};

/**
 * Run a tool of the repository toolchain, as `npx <bin> <args>` would from the workspace folder.
 * The bin script is run with Node.js directly: no shell is involved, so arguments need no escaping.
 */
export const runBin = (cwd: string, packageName: string, binName: string, ...args: string[]): CliResult =>
{
    const packageJsonPath = path.join(repoRoot, 'node_modules', packageName, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    const bin = typeof packageJson.bin === 'string' ? packageJson.bin : packageJson.bin[binName];
    return run(process.execPath, [path.join(path.dirname(packageJsonPath), bin), ...args], cwd);
};

/**
 * Run the built CLI: `intuiface-cli <args>`.
 */
export const runCli = (cwd: string, ...args: string[]): CliResult => run(process.execPath, [distCliEntry, ...args], cwd);

/**
 * Run the built CLI with a preloaded module: `node --import <module> intuiface-cli <args>`.
 */
export const runCliWithPreload = (cwd: string, preloadPath: string, ...args: string[]): CliResult =>
    run(process.execPath, ['--import', pathToFileURL(preloadPath).href, distCliEntry, ...args], cwd);

/**
 * Run the CLI and fail with its output when it does not succeed.
 */
export const runCliOrThrow = (cwd: string, ...args: string[]): CliResult =>
{
    const result = runCli(cwd, ...args);
    if (result.status !== 0)
    {
        throw new Error(`intuiface-cli ${args.join(' ')} exited with ${result.status}:\n${result.output}`);
    }
    return result;
};

/**
 * Read the descriptor file generated for an item.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const readIfd = (dir: string, name: string): any => fs.readJsonSync(path.join(dir, 'dist', name, `${name}.ifd`));

/**
 * Descriptor without its build-dependent `version`.
 */
export const withoutVersion = (ifd: Record<string, unknown>): Record<string, unknown> =>
{
    const copy = { ...ifd };
    delete copy.version;
    return copy;
};

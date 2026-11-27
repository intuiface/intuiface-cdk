import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { stripVTControlCharacters } from 'util';
import { vi } from 'vitest';

const helpersDir = path.dirname(fileURLToPath(import.meta.url));

/** Root of the CLI library (`libs/cli`). */
export const cliRoot = path.resolve(helpersDir, '..', '..');

/** Root of the repository. */
export const repoRoot = path.resolve(cliRoot, '..', '..');

/** Fixture folder shared by the tests. */
export const fixturesDir = path.resolve(helpersDir, '..', 'fixtures');

/** First bytes of every PNG file (a Git LFS pointer is a text file starting with `version https://git-lfs`). */
export const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Create an empty temporary folder.
 * @param prefix name prefix of the folder
 * @param baseDir parent folder, the OS temp folder by default
 */
export const createTempDir = (prefix: string, baseDir: string = os.tmpdir()): string =>
{
    fs.ensureDirSync(baseDir);
    return fs.mkdtempSync(path.join(baseDir, `${prefix}-`));
};

/**
 * Remove a temporary folder, ignoring errors (Windows may keep a handle on a file for a short time).
 */
export const removeTempDir = (dir: string | undefined): void =>
{
    if (dir == null)
    {
        return;
    }

    try
    {
        fs.removeSync(dir);
    }
    catch (_error)
    {
        // best effort
    }
};

/**
 * Run the CLI code as if launched from `dir`: the CLI services all rely on `process.cwd()`.
 * @returns a function restoring the previous working directory
 */
export const useCwd = (dir: string): (() => void) =>
{
    const previousCwd = process.cwd();
    process.chdir(dir);
    return () => process.chdir(previousCwd);
};

/**
 * Silence `console.log` (CREATE/UPDATE lines) and return the spy to assert on the output.
 */
export const silenceConsole = (): ReturnType<typeof vi.spyOn> => vi.spyOn(console, 'log').mockImplementation(() => undefined);

/**
 * Lines printed through a silenced `console.log`, without color codes.
 * chalk colors the output when FORCE_COLOR is set, which Nx does on CI.
 * @param spy spy returned by {@link silenceConsole}
 */
export const getConsoleOutput = (spy: ReturnType<typeof silenceConsole>): string =>
    spy.mock.calls.map((call) => stripVTControlCharacters(String(call[0]))).join('\n');

/**
 * Escape every RegExp special character of `text`, backslash included, to match it literally.
 */
export const escapeRegExp = (text: string): string => text.replace(/[\\^$.*+?()[\]{}|/-]/g, '\\$&');

/**
 * Make `process.exit` throw instead of stopping the test runner.
 * The CLI calls `process.exit` on build and migration failures.
 */
export const mockProcessExit = (): ReturnType<typeof vi.spyOn> => vi.spyOn(process, 'exit').mockImplementation(((code?: number) =>
{
    throw new Error(`process.exit(${code})`);
}) as never);

/**
 * Write files relative to `dir`.
 * @param dir base folder
 * @param files map of relative path → content (objects are written as JSON)
 */
export const writeFiles = (dir: string, files: Record<string, string | object>): void =>
{
    for (const [relativePath, content] of Object.entries(files))
    {
        const filePath = path.join(dir, relativePath);
        fs.ensureDirSync(path.dirname(filePath));
        if (typeof content === 'string')
        {
            fs.writeFileSync(filePath, content, 'utf8');
        }
        else
        {
            fs.writeJsonSync(filePath, content, { spaces: 2 });
        }
    }
};

/**
 * Reset the globals the `@intuiface/core` decorators write to, as the CLI does before loading an item.
 */
export const resetIfdGlobals = (name: string, buildType: 'interface-asset' | 'binding-converter'): void =>
{
    Object.assign(globalThis, {
        // eslint-disable-next-line camelcase
        intuiface_ifd_name: name,
        // eslint-disable-next-line camelcase
        intuiface_build_type: buildType,
        // eslint-disable-next-line camelcase
        intuiface_ifd_classes: [],
        // eslint-disable-next-line camelcase
        intuiface_ifd_properties: {},
        // eslint-disable-next-line camelcase
        intuiface_ifd_actions: {},
        // eslint-disable-next-line camelcase
        intuiface_ifd_params: {},
        // eslint-disable-next-line camelcase
        intuiface_ifd_triggers: {},
        iaTitle: undefined,
        iaDescription: undefined,
        iaCategory: undefined
    });
};

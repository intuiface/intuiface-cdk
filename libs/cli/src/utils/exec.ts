import { exec, ExecException, execFile, ExecFileOptions, ExecOptions } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
import { ExecResult } from '../types.js';

export const isExecException = (error: unknown): error is ExecException =>
    typeof error === 'object' && error !== null && 'code' in error && 'cmd' in error;

type ExecCallback = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void;

const settle = (resolve: (result: ExecResult) => void, reject: (error: unknown) => void): ExecCallback =>
    (error, stdout, stderr) => {
        const normalizedStdout = typeof stdout === 'string' ? stdout : stdout.toString('utf8');
        const normalizedStderr = typeof stderr === 'string' ? stderr : stderr.toString('utf8');

        if (error)
        {
            error.stderr = error.stderr ?? normalizedStderr;
            error.stdout = error.stdout ?? normalizedStdout;
            reject(error);
            return;
        }

        resolve({ stdout: normalizedStdout, stderr: normalizedStderr });
    };

/**
 * Run a command line through the shell.
 * Only for constant commands: never build `command` from paths or user input, use {@link execFilePromise} instead.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function execPromise(command: string, options?: ExecOptions): Promise<ExecResult>
{
    return new Promise((resolve, reject) => {
        exec(command, options, settle(resolve, reject));
    });
}

/**
 * Run an executable with an argument array, without a shell: arguments are passed as is,
 * so paths with spaces or shell metacharacters need no quoting.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function execFilePromise(file: string, args: readonly string[], options?: ExecFileOptions): Promise<ExecResult>
{
    return new Promise((resolve, reject) => {
        execFile(file, args, options ?? {}, settle(resolve, reject));
    });
}

/**
 * Run the webpack CLI installed in the project with the current Node.js executable.
 * Same resolution as `npx webpack` (the project's own webpack), without going through a shell
 * (on Windows `npx` is a .cmd script that `execFile` cannot start without one).
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function runWebpack(projectDir: string, configPath: string): Promise<ExecResult>
{
    return await execFilePromise(process.execPath, [resolveWebpackBin(projectDir), '--config', configPath]);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function resolveWebpackBin(projectDir: string): string
{
    // webpack has no "exports" map, so its bin script can be resolved directly
    const searchDirs = [path.resolve(projectDir), process.cwd()];
    for (const searchDir of searchDirs)
    {
        try
        {
            return createRequire(path.join(searchDir, 'package.json')).resolve('webpack/bin/webpack.js');
        }
        catch
        {
            // try the next directory
        }
    }

    throw new Error(`webpack is not installed in '${path.resolve(projectDir)}'. Run 'npm install' first.`);
}

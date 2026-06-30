import { exec, ExecException, ExecOptions } from 'child_process';
import { ExecResult } from '../types.js';

export const isExecException = (error: unknown): error is ExecException =>
    typeof error === 'object' && error !== null && 'code' in error && 'cmd' in error;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function execPromise(command: string, options?: ExecOptions): Promise<ExecResult>
{
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            const normalizedStdout = typeof stdout === 'string' ? stdout : stdout.toString('utf8');
            const normalizedStderr = typeof stderr === 'string' ? stderr : stderr.toString('utf8');

            if (error)
            {
                error.stderr = error.stderr ?? normalizedStderr;
                error.stdout = error.stdout ?? normalizedStdout;
                reject(error);
            }

            resolve({ stdout: normalizedStdout, stderr: normalizedStderr });
        });
    });
}

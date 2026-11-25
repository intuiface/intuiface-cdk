import fs from 'fs-extra';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { execFilePromise, isExecException, runWebpack } from '../../src/utils/exec.js';
import { createTempDir, removeTempDir } from '../helpers/test-utils.js';

describe('exec utils', () =>
{
    let dir: string;

    beforeEach(() =>
    {
        // Spaces and shell metacharacters in the path: arguments must reach the process unchanged
        dir = createTempDir('cli exec & $(dir)');
    });

    afterEach(() =>
    {
        vi.restoreAllMocks();
        removeTempDir(dir);
    });

    describe('execFilePromise', () =>
    {
        it('passes arguments without a shell', async () =>
        {
            const arg = path.join(dir, 'a "b" & c.js');

            const result = await execFilePromise(process.execPath, ['-e', 'console.log(JSON.stringify(process.argv.slice(1)))', arg]);

            expect(JSON.parse(result.stdout)).toEqual([arg]);
        });

        it('rejects with an exec error carrying the output', async () =>
        {
            const error = await execFilePromise(process.execPath, ['-e', 'console.error("boom"); process.exit(3)']).catch((e: unknown) => e);

            expect(isExecException(error)).toBe(true);
            expect(error).toMatchObject({ code: 3 });
            expect((error as { stderr: string }).stderr).toContain('boom');
        });
    });

    describe('runWebpack', () =>
    {
        it('runs the project webpack with a config path containing spaces', async () =>
        {
            const binDir = path.join(dir, 'node_modules', 'webpack', 'bin');
            fs.ensureDirSync(binDir);
            fs.writeFileSync(path.join(dir, 'node_modules', 'webpack', 'package.json'), JSON.stringify({ name: 'webpack', version: '0.0.0' }));
            fs.writeFileSync(path.join(binDir, 'webpack.js'), 'console.log(JSON.stringify(process.argv.slice(2)));\n');
            const configPath = path.join(dir, 'tmp', 'webpack config.js');

            const result = await runWebpack(dir, configPath);

            expect(JSON.parse(result.stdout)).toEqual(['--config', configPath]);
        });

        it('reports a missing webpack installation', async () =>
        {
            vi.spyOn(process, 'cwd').mockReturnValue(dir);

            await expect(runWebpack(dir, path.join(dir, 'webpack.config.js'))).rejects.toThrow(/webpack is not installed in .*Run 'npm install' first\./);
        });
    });
});

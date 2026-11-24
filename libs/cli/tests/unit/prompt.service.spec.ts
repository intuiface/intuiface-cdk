import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createInterface } from 'node:readline/promises';
import { askWorkspaceInitQuestions } from '../../src/services/prompt.service.js';
import { createTempDir, removeTempDir, silenceConsole, useCwd, writeFiles } from '../helpers/test-utils.js';

vi.mock('node:readline/promises', () => ({
    createInterface: vi.fn()
}));

/**
 * Answer the `init` questions in order.
 * @returns the readline mock, to assert on the questions
 */
const answer = (...answers: string[]): { question: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn> } =>
{
    const remaining = [...answers];
    const readline = {
        question: vi.fn(async () =>
        {
            if (remaining.length === 0)
            {
                throw new Error('Unexpected question');
            }
            return remaining.shift() as string;
        }),
        close: vi.fn()
    };
    vi.mocked(createInterface).mockReturnValue(readline as never);
    return readline;
};

describe('prompt.service', () =>
{
    let dir: string;
    let restoreCwd: () => void;
    let log: ReturnType<typeof silenceConsole>;

    /** Lines printed by the prompt. */
    const getOutput = (): string => log.mock.calls.map((call) => String(call[0])).join('\n');

    beforeEach(() =>
    {
        // init runs in the workspace folder: icon paths are relative to it
        dir = createTempDir('cli-prompt');
        writeFiles(dir, { 'icons/gauge.png': 'png' });
        restoreCwd = useCwd(dir);
        log = silenceConsole();
    });

    afterEach(() =>
    {
        restoreCwd();
        removeTempDir(dir);
    });

    it('uses the defaults when every answer is empty', async () =>
    {
        const readline = answer('', '', '', '', '');

        await expect(askWorkspaceInitQuestions('folder-name')).resolves.toEqual({
            workspaceName: 'folder-name',
            firstItem: { type: 'interface-asset', name: 'MyInterfaceAsset', category: 'Custom', icon: undefined }
        });
        expect(readline.close).toHaveBeenCalled();
    });

    it('creates a binding converter when answering 2', async () =>
    {
        answer('ws', '2', '', 'Text', '');

        await expect(askWorkspaceInitQuestions('folder-name')).resolves.toEqual({
            workspaceName: 'ws',
            firstItem: { type: 'binding-converter', name: 'MyBindingConverter', category: 'Text', icon: undefined }
        });
    });

    it('trims the answers', async () =>
    {
        answer('  ws  ', ' 1 ', '  Gauge  ', '  Dataviz ', '  icons/gauge.png  ');

        await expect(askWorkspaceInitQuestions('folder-name')).resolves.toEqual({
            workspaceName: 'ws',
            firstItem: { type: 'interface-asset', name: 'Gauge', category: 'Dataviz', icon: 'icons/gauge.png' }
        });
    });

    it('asks the item name again until it is valid', async () =>
    {
        const readline = answer('ws', '1', 'my-asset', '2Fast', 'MyAsset', '', '');

        const responses = await askWorkspaceInitQuestions('folder-name');

        expect(responses.firstItem.name).toBe('MyAsset');
        expect(readline.question).toHaveBeenCalledTimes(7);
    });

    describe('item type (review O5)', () =>
    {
        it('asks again until the answer is 1 or 2', async () =>
        {
            const readline = answer('ws', '3', 'asset', '2', '', 'Text', '');

            const responses = await askWorkspaceInitQuestions('folder-name');

            expect(responses.firstItem).toEqual({ type: 'binding-converter', name: 'MyBindingConverter', category: 'Text', icon: undefined });
            expect(readline.question).toHaveBeenCalledTimes(7);
            expect(getOutput()).toContain(`Invalid choice '3'. Answer 1 (interface-asset) or 2 (binding-converter).`);
            expect(getOutput()).toContain(`Invalid choice 'asset'.`);
        });

        it.each([
            ['interface-asset', 'interface-asset'],
            ['Binding-Converter', 'binding-converter']
        ])('accepts the type name %s', async (typeAnswer, expectedType) =>
        {
            answer('ws', typeAnswer, 'Item', '', '');

            await expect(askWorkspaceInitQuestions('folder-name')).resolves.toMatchObject({ firstItem: { type: expectedType, name: 'Item' } });
        });
    });

    describe('icon (review O5)', () =>
    {
        it('asks again until the icon file exists', async () =>
        {
            const readline = answer('ws', '1', '', '', 'icons/missing.png', 'icons', 'icons/gauge.png');

            const responses = await askWorkspaceInitQuestions('folder-name');

            expect(responses.firstItem.icon).toBe('icons/gauge.png');
            expect(readline.question).toHaveBeenCalledTimes(7);
            expect(getOutput()).toContain(`Cannot find the icon 'icons/missing.png'`);
            expect(getOutput()).toContain(`Cannot find the icon 'icons'`);
        });

        it('can still be skipped after a wrong path', async () =>
        {
            answer('ws', '1', '', '', 'icons/missing.png', '');

            await expect(askWorkspaceInitQuestions('folder-name')).resolves.toMatchObject({ firstItem: { icon: undefined } });
        });
    });

    it('closes the prompt when it fails', async () =>
    {
        const readline = answer('ws');

        await expect(askWorkspaceInitQuestions('folder-name')).rejects.toThrow('Unexpected question');
        expect(readline.close).toHaveBeenCalled();
    });
});

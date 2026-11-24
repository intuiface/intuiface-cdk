import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createInterface } from 'node:readline/promises';
import { askWorkspaceInitQuestions } from '../../src/services/prompt.service.js';
import { silenceConsole } from '../helpers/test-utils.js';

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
    beforeEach(() =>
    {
        silenceConsole();
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

    it('closes the prompt when it fails', async () =>
    {
        const readline = answer('ws');

        await expect(askWorkspaceInitQuestions('folder-name')).rejects.toThrow('Unexpected question');
        expect(readline.close).toHaveBeenCalled();
    });
});

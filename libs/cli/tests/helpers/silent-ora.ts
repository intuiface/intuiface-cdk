import { vi } from 'vitest';

/**
 * Unit test setup: replace the `ora` spinners of the CLI with silent ones, so that the test output stays readable.
 */
vi.mock('ora', () =>
{
    const createSpinner = (): Record<string, unknown> =>
    {
        const spinner: Record<string, unknown> = {
            text: '',
            prefixText: '',
            color: 'cyan',
            indent: 0,
            isSpinning: false
        };
        for (const method of ['start', 'stop', 'succeed', 'fail', 'warn', 'info', 'stopAndPersist', 'clear', 'render'])
        {
            spinner[method] = vi.fn(() => spinner);
        }
        return spinner;
    };

    return { default: vi.fn(() => createSpinner()) };
});

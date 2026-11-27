import { defineConfig } from 'vitest/config';

/**
 * Unit tests of the CLI: run against the TypeScript sources, no build needed.
 * End-to-end tests (built CLI and core, real webpack) use vitest.e2e.config.mts.
 */
export default defineConfig({
    root: import.meta.dirname,
    test: {
        name: 'cli',
        include: ['tests/unit/**/*.spec.ts'],
        setupFiles: ['tests/helpers/silent-ora.ts'],
        environment: 'node',
        // The CLI works on process.cwd(): child processes allow process.chdir(), worker threads do not
        pool: 'forks',
        restoreMocks: true,
        testTimeout: 30_000
    }
});

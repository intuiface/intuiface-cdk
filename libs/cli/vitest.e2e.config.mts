import { defineConfig } from 'vitest/config';

/**
 * End-to-end tests of the CLI. They need the built packages (`dist/libs/cli` and `dist/libs/core`):
 * run them with `npx nx run cli:e2e`, which builds both first.
 */
export default defineConfig({
    root: import.meta.dirname,
    test: {
        name: 'cli-e2e',
        include: ['tests/e2e/**/*.spec.ts'],
        environment: 'node',
        // Test files run in parallel: each one works in its own folders under tmp/cli-e2e
        pool: 'forks',
        restoreMocks: true,
        testTimeout: 180_000,
        hookTimeout: 180_000
    }
});

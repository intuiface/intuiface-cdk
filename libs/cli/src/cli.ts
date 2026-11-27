#!/usr/bin/env node

// Entry point of intuiface-cli. Static imports are evaluated before any code of this module, so a Node.js too old
// for the CLI's dependencies would fail with a loader or syntax error instead of the message below (review R10).
// Keep this file to the version check: import only modules without imports, load the CLI dynamically, and use no
// recent syntax (e.g. `??`, top-level `await`), which an old Node.js cannot parse.
import { MIN_NODE_MAJOR } from './utils/node-version.js';

const nodeMajor = Number(process.version.replace(/^v/, '').split('.')[0]);
if (nodeMajor < MIN_NODE_MAJOR)
{
    process.stderr.write(`Error: Intuiface CLI requires Node.js >= ${MIN_NODE_MAJOR}. Currently running ${process.version}.\n`);
    process.exit(1);
}
else
{
    import('./main.js').catch((error: unknown) =>
    {
        process.stderr.write(`${(error instanceof Error && error.stack) || String(error)}\n`);
        process.exitCode = 1;
    });
}

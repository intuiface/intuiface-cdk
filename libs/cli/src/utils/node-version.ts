// No import in this module: cli.ts loads it before checking the Node.js version (review R10).

/**
 * Minimum Node.js major version required by the Intuiface CLI and generated workspaces.
 * This is the single source of truth — it drives .nvmrc content, package.json engines,
 * and the startup version check in cli.ts.
 */
export const MIN_NODE_MAJOR = 22;

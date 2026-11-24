import fs from 'fs-extra';
import path from 'path';
import { WorkspaceItem, WorkspaceConfig } from '../types.js';

const workspaceConfigFileName = 'intuiface.workspace.json';

/**
 * Customisation of the webpack configuration generated for each item (see templates/workspace/webpack.config.cjs).
 */
const workspaceWebpackConfigFileName = 'webpack.config.cjs';

/**
 * Webpack configuration files of the projects created by the 2.x schematics.
 * A workspace does not use them: `migrate` moves their customisations to webpack.config.cjs.
 */
export const LEGACY_WEBPACK_CONFIG_FILE_NAMES: readonly string[] = ['webpack.config.js', 'webpack-debug.config.js'];

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function tryReadWorkspaceConfig(dir: string): WorkspaceConfig | undefined
{
    const workspaceConfigPath = path.join(dir, workspaceConfigFileName);
    if (!fs.existsSync(workspaceConfigPath))
    {
        return undefined;
    }

    return readWorkspaceConfig(dir);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function readWorkspaceConfig(dir: string): WorkspaceConfig
{
    const workspaceConfigPath = path.join(dir, workspaceConfigFileName);
    if (!fs.existsSync(workspaceConfigPath))
    {
        throw new Error(`Cannot find ${workspaceConfigFileName} in '${dir}'. Run 'intuiface-cli init' first.`);
    }

    const workspaceConfig = fs.readJsonSync(workspaceConfigPath, { throws: true }) as WorkspaceConfig;
    if (!Array.isArray(workspaceConfig.items))
    {
        throw new Error(`Invalid workspace configuration in '${workspaceConfigFileName}'.`);
    }

    return workspaceConfig;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getRequiredWorkspaceItem(workspaceConfig: WorkspaceConfig, name: string): WorkspaceItem
{
    const item = workspaceConfig.items.find((workspaceItem) => workspaceItem.name === name);
    if (!item)
    {
        throw new Error(`Cannot find workspace item '${name}'.`);
    }

    return item;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function writeWorkspaceConfig(dir: string, config: WorkspaceConfig): void
{
    const workspaceConfigPath = path.join(dir, workspaceConfigFileName);
    fs.writeJsonSync(workspaceConfigPath, config, { spaces: 2 });
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getWorkspaceConfigFileName(): string
{
    return workspaceConfigFileName;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function getWorkspaceWebpackConfigFileName(): string
{
    return workspaceWebpackConfigFileName;
}

/**
 * @returns the path of the workspace webpack customisation (webpack.config.cjs), or undefined when the workspace has none
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function findWorkspaceWebpackConfig(dir: string): string | undefined
{
    const webpackConfigPath = path.join(dir, workspaceWebpackConfigFileName);
    return fs.existsSync(webpackConfigPath) ? webpackConfigPath : undefined;
}

/**
 * @returns the 2.x webpack configuration files still in the folder (webpack.config.js, webpack-debug.config.js)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function findLegacyWebpackConfigFiles(dir: string): string[]
{
    return LEGACY_WEBPACK_CONFIG_FILE_NAMES.filter((fileName) => fs.existsSync(path.join(dir, fileName)));
}

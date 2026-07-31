import fs from 'fs-extra';
import path from 'path';
import { WorkspaceItem, WorkspaceConfig } from '../types.js';

const workspaceConfigFileName = 'intuiface.workspace.json';

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

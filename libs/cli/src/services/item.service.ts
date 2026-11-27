import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { WorkspaceItem } from '../types.js';
import { validateGeneratedName, validateIconPath } from '../utils/validators.js';
import { logGeneratedFile, scaffoldWorkspaceItemFromTemplate } from './generator.service.js';
import { readWorkspaceConfig, writeWorkspaceConfig, getWorkspaceConfigFileName } from './workspace.service.js';

type WorkspaceItemCreationInput = WorkspaceItem & { category?: string };

/**
 * Generate an item in the workspace of the current folder and register it in `intuiface.workspace.json`.
 * Nothing is written when the name is invalid or taken, or when the icon file does not exist.
 * @returns the item as registered in the workspace
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addWorkspaceItem(item: WorkspaceItemCreationInput): WorkspaceItem
{
    validateGeneratedName(item.name);

    const dir = process.cwd();
    const workspaceConfig = readWorkspaceConfig(dir);

    // Names that only differ by case are the same files on Windows and macOS, and the same dist/ folder (review R5)
    const sameNameItem = workspaceConfig.items.find((existingItem) => existingItem.name.toLowerCase() === item.name.toLowerCase());
    if (sameNameItem)
    {
        throw new Error(sameNameItem.name === item.name
            ? `A workspace item named '${item.name}' already exists.`
            : `A workspace item named '${sameNameItem.name}' already exists: names that only differ by case are not allowed.`);
    }

    // A missing icon would otherwise only fail at the end of the build
    if (item.icon)
    {
        validateIconPath(item.icon, dir);
    }

    const relativeFolder = path.join('src', item.type === 'interface-asset' ? 'interface-assets' : 'binding-converters', item.name);
    const relativeEntry = path.join(relativeFolder, `${item.name}.ts`).replace(/\\/g, '/');
    const itemConfig: WorkspaceItem = {
        name: item.name,
        type: item.type,
        entry: relativeEntry
    };
    if (item.icon)
    {
        itemConfig.icon = item.icon;
    }

    // Never replace the code of an item, e.g. one removed from intuiface.workspace.json by hand and added again (review R5)
    const itemDirectory = path.join(dir, relativeFolder);
    if (fs.existsSync(itemDirectory) && fs.readdirSync(itemDirectory).length > 0)
    {
        throw new Error(
            `The folder '${relativeFolder.replace(/\\/g, '/')}' already exists and is not empty. ` +
            `To register an existing item, add it to ${getWorkspaceConfigFileName()} by hand; to create a new one, choose another name or remove that folder.`
        );
    }

    const generatedFiles = scaffoldWorkspaceItemFromTemplate(itemConfig, itemDirectory, { category: item.category });
    const hasEntryFile = generatedFiles.some((generatedFile) => generatedFile.relativePath === `${item.name}.ts`);
    if (!hasEntryFile)
    {
        throw new Error(`Template for '${item.type}' must generate '${item.name}.ts' in '${relativeFolder}'.`);
    }

    if (!itemConfig.icon && itemConfig.type === 'binding-converter')
    {
        const hasDefaultIcon = generatedFiles.some((generatedFile) => generatedFile.relativePath === 'icon_converter_32.png');
        if (hasDefaultIcon)
        {
            itemConfig.icon = path.join(relativeFolder, 'icon_converter_32.png').replace(/\\/g, '/');
        }
    }

    for (const generatedFile of generatedFiles)
    {
        logGeneratedFile({ ...generatedFile, relativePath: path.join(relativeFolder, generatedFile.relativePath) });
    }

    workspaceConfig.items.push(itemConfig);
    workspaceConfig.items.sort((left, right) => left.name.localeCompare(right.name));
    writeWorkspaceConfig(dir, workspaceConfig);
    console.log(`${chalk.blue('UPDATE')} ${getWorkspaceConfigFileName()}`);
    console.log();
    return itemConfig;
}

import path from 'path';
import chalk from 'chalk';
import { WorkspaceItem } from '../types.js';
import { validateGeneratedName } from '../utils/validators.js';
import { scaffoldWorkspaceItemFromTemplate } from './generator.service.js';
import { readWorkspaceConfig, writeWorkspaceConfig, getWorkspaceConfigFileName } from './workspace.service.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addWorkspaceItem(item: WorkspaceItem): void
{
    validateGeneratedName(item.name);

    const dir = process.cwd();
    const workspaceConfig = readWorkspaceConfig(dir);

    if (workspaceConfig.items.some((existingItem) => existingItem.name === item.name))
    {
        throw new Error(`A workspace item named '${item.name}' already exists.`);
    }

    const relativeFolder = path.join('src', item.type === 'interface-asset' ? 'interface-assets' : 'binding-converters', item.name);
    const relativeEntry = path.join(relativeFolder, `${item.name}.ts`).replace(/\\/g, '/');
    const itemConfig: WorkspaceItem = {
        ...item,
        entry: relativeEntry
    };

    const itemDirectory = path.join(dir, relativeFolder);
    const generatedFiles = scaffoldWorkspaceItemFromTemplate(itemConfig, itemDirectory);
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
        const generatedRelativePath = path.join(relativeFolder, generatedFile.relativePath).replace(/\\/g, '/');
        console.log(`${chalk.green('CREATE')} ${generatedRelativePath} (${generatedFile.bytes} bytes)`);
    }

    workspaceConfig.items.push(itemConfig);
    workspaceConfig.items.sort((left, right) => left.name.localeCompare(right.name));
    writeWorkspaceConfig(dir, workspaceConfig);
    console.log(`${chalk.blue('UPDATE')} ${getWorkspaceConfigFileName()}`);
    console.log();
}

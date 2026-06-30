import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { WorkspaceItem } from '../types.js';
import { validateGeneratedName } from '../utils/validators.js';
import { renderWorkspaceItemSource } from './generator.service.js';
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

    fs.ensureDirSync(path.join(dir, relativeFolder));
    const sourceContent = renderWorkspaceItemSource(itemConfig);
    fs.writeFileSync(path.join(dir, relativeEntry), sourceContent, 'utf8');
    console.log(`${chalk.green('CREATE')} ${relativeEntry} (${sourceContent.length} bytes)`);

    workspaceConfig.items.push(itemConfig);
    workspaceConfig.items.sort((left, right) => left.name.localeCompare(right.name));
    writeWorkspaceConfig(dir, workspaceConfig);
    console.log(`${chalk.blue('UPDATE')} ${getWorkspaceConfigFileName()}`);
    console.log();
}

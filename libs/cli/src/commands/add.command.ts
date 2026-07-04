import { InitItemOptions } from '../types.js';
import { addWorkspaceItem } from '../services/item.service.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addInterfaceAsset(options: { name: string; category: string; icon?: string }): void
{
    addWorkspaceItem({
        name: options.name,
        type: 'interface-asset',
        category: options.category,
        icon: options.icon,
        entry: ''
    });
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addBindingConverter(options: { name: string; category: string; icon?: string }): void
{
    addWorkspaceItem({
        name: options.name,
        type: 'binding-converter',
        category: options.category,
        icon: options.icon,
        entry: ''
    });
}

import fs from 'fs-extra';
import path from 'path';
import { BuildType, WorkspaceItem, WorkspaceConfig } from '../types.js';
import { validateGeneratedName } from '../utils/validators.js';

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
    if (workspaceConfig == null || typeof workspaceConfig !== 'object' || !Array.isArray(workspaceConfig.items))
    {
        throw new Error(`Invalid workspace configuration in '${workspaceConfigFileName}'.`);
    }

    // The file can be edited by hand: an item is checked before its name becomes a dist/ folder or a webpack name (review R9)
    const namesInLowerCase = new Map<string, string>();
    workspaceConfig.items.forEach((item, index) =>
    {
        validateWorkspaceItem(item, index);
        // On Windows and macOS, two names that only differ by case build to the same dist/ folder
        const sameName = namesInLowerCase.get(item.name.toLowerCase());
        if (sameName != null)
        {
            throw new Error(`Invalid item '${item.name}' in '${workspaceConfigFileName}': '${sameName}' has the same name.`);
        }
        namesInLowerCase.set(item.name.toLowerCase(), item.name);
    });

    return workspaceConfig;
}

const WORKSPACE_ITEM_TYPES: readonly BuildType[] = ['interface-asset', 'binding-converter'];

/**
 * Check an item of intuiface.workspace.json: a valid name, a known type, an entry file and, when set, an icon path.
 * @param index position of the item, to name it in the error message when it has no usable name
 * @throws with a message naming the item and the invalid field
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function validateWorkspaceItem(item: unknown, index: number): asserts item is WorkspaceItem
{
    const fields = item != null && typeof item === 'object' ? item as Record<string, unknown> : undefined;
    const itemLabel = typeof fields?.name === 'string' && fields.name !== '' ? `'${fields.name}'` : `#${index + 1}`;
    const fail = (reason: string): never =>
    {
        throw new Error(`Invalid item ${itemLabel} in '${workspaceConfigFileName}': ${reason}`);
    };

    if (fields == null || Array.isArray(item))
    {
        return fail('an item is an object with a name, a type and an entry.');
    }
    if (typeof fields.name !== 'string')
    {
        return fail('"name" is missing.');
    }
    try
    {
        validateGeneratedName(fields.name);
    }
    catch (error)
    {
        return fail(error instanceof Error ? error.message : String(error));
    }
    if (!WORKSPACE_ITEM_TYPES.includes(fields.type as BuildType))
    {
        return fail(`"type" must be ${WORKSPACE_ITEM_TYPES.map((type) => `'${type}'`).join(' or ')}, not ${JSON.stringify(fields.type ?? null)}.`);
    }
    if (typeof fields.entry !== 'string' || fields.entry.trim() === '')
    {
        return fail('"entry" must be the path of the item\'s TypeScript file, e.g. "src/interface-assets/MyAsset/MyAsset.ts".');
    }
    if (fields.icon != null && (typeof fields.icon !== 'string' || fields.icon.trim() === ''))
    {
        return fail('"icon" must be the path of an image file, or be left out.');
    }
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

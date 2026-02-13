/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Rule, SchematicContext, Tree, chain, apply, url, template, mergeWith, MergeStrategy } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
/**
 * Schematics to create an interface asset
 * @param _options
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function createInterfaceAsset(_options: any): Rule
{
    return (tree: Tree, context: SchematicContext) => {

        const templateSource = apply(url('./files'), [
            template({ ..._options, ...strings }),
        ]);
        const merged = mergeWith(templateSource, MergeStrategy.Overwrite);

        const rule = chain([
            merged,
            moveConfigFiles,
            installPackageJsonDependencies()
        ]);
        return rule(tree, context) as Rule;
    };
}

/**
 * Function to install packages
 * @returns Rule
 */
function installPackageJsonDependencies(): Rule {
    return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        // context.logger.log('info', '🔍 Installing packages...');
        return host;
    };
}


/**
 * Function to move config files
 * @returns
 */
function moveConfigFiles(): Rule
{
    return (tree: Tree) =>
    {
        moveTemplateFile(
            tree,
            'node_modules/@intuiface/interface-asset/src/workspace-template/eslintrc.js',
            '.eslintrc.js'
        );
        moveTemplateFile(
            tree,
            'node_modules/@intuiface/interface-asset/src/workspace-template/vscode-settings.json',
            '.vscode/settings.json'
        );
        moveTemplateFile(
            tree,
            'node_modules/@intuiface/interface-asset/src/workspace-template/vscode-extensions.json',
            '.vscode/extensions.json'
        );
        moveTemplateFile(
            tree,
            'node_modules/@intuiface/interface-asset/src/workspace-template/gitignore',
            '.gitignore'
        );
        moveTemplateFile(
            tree,
            'node_modules/@intuiface/interface-asset/src/workspace-template/eslintignore',
            '.eslintignore'
        );
    };
}

function moveTemplateFile(tree: Tree, sourcePath: string, targetPath: string): void
{
    if (!tree.exists(sourcePath)) {
        return;
    }

    const sourceContent = tree.readText(sourcePath);
    if (!tree.exists(targetPath)) {
        tree.rename(sourcePath, targetPath);
        return;
    }

    const targetContent = tree.readText(targetPath);
    const isJsonFile = sourcePath.endsWith('.json') && targetPath.endsWith('.json');
    const sourceJson = isJsonFile ? parseJsonObject(sourceContent) : null;
    const targetJson = isJsonFile ? parseJsonObject(targetContent) : null;

    if (sourceJson && targetJson) {
        const mergedJson = deepMerge(sourceJson, targetJson);
        tree.overwrite(targetPath, `${JSON.stringify(mergedJson, null, 2)}\n`);
    } else if (!targetContent.trim()) {
        tree.overwrite(targetPath, sourceContent);
    }
}

function parseJsonObject(value: string): Record<string, unknown> | null
{
    try {
        const parsed = JSON.parse(value);
        return isObject(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function isObject(value: unknown): value is Record<string, unknown>
{
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(
    source: Record<string, unknown>,
    target: Record<string, unknown>
): Record<string, unknown>
{
    const result: Record<string, unknown> = { ...source };

    for (const [key, targetValue] of Object.entries(target)) {
        const sourceValue = result[key];
        if (isObject(sourceValue) && isObject(targetValue)) {
            result[key] = deepMerge(sourceValue, targetValue);
            continue;
        }

        result[key] = targetValue;
    }

    return result;
}

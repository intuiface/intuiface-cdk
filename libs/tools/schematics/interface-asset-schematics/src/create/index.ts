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
        tree.rename('node_modules/@intuiface/interface-asset/src/workspace-template/eslintrc.js', '.eslintrc.js');
        tree.rename('node_modules/@intuiface/interface-asset/src/workspace-template/vscode-settings.json', '.vscode/settings.json');
        tree.rename('node_modules/@intuiface/interface-asset/src/workspace-template/vscode-extensions.json', '.vscode/extensions.json');
        tree.rename('node_modules/@intuiface/interface-asset/src/workspace-template/gitignore', '.gitignore');
        tree.rename('node_modules/@intuiface/interface-asset/src/workspace-template/eslintignore', '.eslintignore');
    };
}

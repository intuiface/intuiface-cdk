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
 * @returns
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
        tree.rename('node_modules/@intuiface/interface-asset/src/.eslintrc.js', '.eslintrc.js');
        tree.rename('node_modules/@intuiface/interface-asset/src/.vscode/settings.json', '.vscode/settings.json');
        tree.rename('node_modules/@intuiface/interface-asset/src/.gitignore', '.gitignore');
    };
}

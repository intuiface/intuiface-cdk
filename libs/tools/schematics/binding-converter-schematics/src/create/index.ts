/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Rule, SchematicContext, Tree, chain, apply, url, template, mergeWith, MergeStrategy } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Schematics to create a binding converter workspace.
 * @param _options
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function createBindingConverter(_options: any): Rule
{
    return (tree: Tree, context: SchematicContext) => {

        const templateSource = apply(url('./files'), [
            template({ ..._options, ...strings }),
        ]);
        const merged = mergeWith(templateSource, MergeStrategy.Overwrite);

        const rule = chain([
            merged,
            copyDefaultIcon(),
            installPackageJsonDependencies()
        ]);
        return rule(tree, context) as Rule;
    };
}

/**
 * Copies the default binding converter icon from the files folder
 * to the project root so the CLI can find it during build.
 */
function copyDefaultIcon(): Rule
{
    return (tree: Tree) => {
        const iconSourcePath = path.join(__dirname, '..', '..', 'icon_converter_32.png');
        if (fs.existsSync(iconSourcePath) && !tree.exists('icon_converter_32.png'))
        {
            const iconBuffer = fs.readFileSync(iconSourcePath);
            tree.create('icon_converter_32.png', iconBuffer);
        }
        return tree;
    };
}

function installPackageJsonDependencies(): Rule
{
    return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        return host;
    };
}

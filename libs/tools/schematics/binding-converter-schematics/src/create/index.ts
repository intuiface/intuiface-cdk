/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Rule, SchematicContext, Tree, chain, apply, url, template, mergeWith, MergeStrategy } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { strings } from '@angular-devkit/core';

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
            installPackageJsonDependencies()
        ]);
        return rule(tree, context) as Rule;
    };
}

function installPackageJsonDependencies(): Rule
{
    return (host: Tree, context: SchematicContext) => {
        context.addTask(new NodePackageInstallTask());
        return host;
    };
}

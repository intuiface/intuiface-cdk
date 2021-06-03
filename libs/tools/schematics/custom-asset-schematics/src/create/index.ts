/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Rule, SchematicContext, Tree, externalSchematic, chain, apply, url, template, mergeWith, MergeStrategy, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
// eslint-disable-next-line no-restricted-imports
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
/**
 * Function to create an custom asset
 * @param _options
 * @returns
 */
export function customAsset(_options: any): Rule {
    const name = _options.customAssetName;
    const isCollection = _options.isCollection;

    return (tree: Tree, _context: SchematicContext) => {

        const templateSource = apply(url('./files'), [
            template({ ..._options, ...strings }),
            move(`src/app/${dasherize(name)}`)
        ]);
        const merged = mergeWith(templateSource, MergeStrategy.Overwrite);

        const rule = chain([
            generateAngularRepo(name),
            generateComponent(name),
            merged,
            renameFiles(name, isCollection),
            addJsonDependencies(name),
            installPackageJsonDependencies(),
            addModuleFederation(name),
            moveWebpack(name)
        ]);

        return rule(tree, _context) as Rule;
    };
}

/**
 * Function to generate the repo angular (ng new)
 * @param name
 * @returns
 */
function generateAngularRepo(name: string): Rule {
    return externalSchematic('@schematics/angular', 'ng-new', {
        name: name,
        version: '12.0.2',
        directory: '.',
        routing: false,
        style: 'scss',
        strict: false,
        inlineStyle: false,
        inlineTemplate: false,
        skipInstall: true
    });
}

/**
 * Function to generate the component (ng generate component)
 * @param name
 * @returns
 */
function generateComponent(name: string): Rule {
    return externalSchematic('@schematics/angular', 'component', {
        name: name,
        project: name,
        module: 'app.module.ts',
        style: 'scss'
    });
}

/**
 * Add module federation
 * @param name 
 * @returns 
 */
function addModuleFederation(name: string): Rule {
    return externalSchematic('@angular-architects/module-federation', 'ng-add', {
        project: name,
        port: '3000'
    });
}

/**
 * Function to rename component/asset/collection files
 * @param name
 * @param isCollection
 * @returns
 */
function renameFiles(name: string, isCollection: boolean): Rule{
    return (tree: Tree) => {
        // delete the files we want to rename
        if (name !== dasherize(name))
        {
            tree.delete(`src/app/${dasherize(name)}/${dasherize(name)}.component.ts`);
            tree.delete(`src/app/${dasherize(name)}/${dasherize(name)}.component.html`);
        }
        // rename files
        // manage type (asset or collection and change the name) => delete asset or collection
        if (isCollection)
        {
            tree.delete(`src/app/${dasherize(name)}/${name}.asset.ts`);
            tree.rename(`src/app/${dasherize(name)}/${name}.collection.ts`, `src/app/${dasherize(name)}/${dasherize(name)}.collection.ts`);
        }
        else
        {
            tree.delete(`src/app/${dasherize(name)}/${name}.collection.ts`);
            tree.rename(`src/app/${dasherize(name)}/${name}.asset.ts`, `src/app/${dasherize(name)}/${dasherize(name)}.asset.ts`);
        }

        tree.rename(`src/app/${dasherize(name)}/${name}.component.ts`, `src/app/${dasherize(name)}/${dasherize(name)}.component.ts`);
        tree.rename(`src/app/${dasherize(name)}/${name}.component.html`, `src/app/${dasherize(name)}/${dasherize(name)}.component.html`);
    };
}

/**
 * Function to move webpack file
 * @param name
 * @returns
 */
function moveWebpack(name: string): Rule {
    return (tree: Tree) => {
        tree.delete('webpack.config.js');
        tree.rename(`src/app/${dasherize(name)}/webpack.config.js`, `webpack.config.js`);
    };
}

/**
 * Function to add json dependencies (core/components and builder)
 * @param name
 * @returns
 */
function addJsonDependencies(name: string): Rule{
    return (tree: Tree) => {
        const path = 'package.json';
        const file = tree.read(path);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const json = JSON.parse(file!.toString());

        json.dependencies['@intuiface/core'] = 'file:../intuiface-cdk/dist/libs/core';
        json.dependencies['@intuiface/components'] = 'file:../intuiface-cdk/dist/libs/components';
        json.devDependencies['@angular-architects/module-federation'] = '^12.1.1';
        json.devDependencies['@intuiface/custom-asset-schematics'] = 'file:../intuiface-cdk/dist/libs/tools/custom-asset-schematics';

        json.scripts = {
            ...json.scripts,
            build: `ng build --project ${name} --aot --outputPath=./dist/${name}`
        };
        tree.overwrite(path, JSON.stringify(json, null, 2));
        return tree;
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

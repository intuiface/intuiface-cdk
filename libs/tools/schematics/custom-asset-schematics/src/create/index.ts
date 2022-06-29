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
            generateModule(name),
            merged,
            renameFiles(name, isCollection),
            addJsonDependencies(name),
            installPackageJsonDependencies(),
            addModuleFederation(name),
            moveWebpack(name),
            modifyAngularBuildConfig(name)
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
        style: 'scss'
    });
}

function generateModule(name: string): Rule {
    return externalSchematic('@schematics/angular', 'module', {
        name: name,
        project: name,
        module: 'app.module'
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
            tree.delete(`src/app/${dasherize(name)}/${dasherize(name)}.module.ts`);
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

        tree.rename(`src/app/${dasherize(name)}/${name}.module.ts`, `src/app/${dasherize(name)}/${dasherize(name)}.module.ts`);
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

        // read package versions
        const pathToPackageVersions = `src/app/${dasherize(name)}/packageVersions.json`;
        const packages = tree.read(pathToPackageVersions);
        // add packages with versions to the package.json file
        if (packages)
        {
            const packageVersions = JSON.parse(packages.toString());
            json.dependencies['@intuiface/core'] = packageVersions['@intuiface/core'];
            json.dependencies['@intuiface/components'] = packageVersions['@intuiface/components'];
            json.devDependencies['@angular-architects/module-federation'] = packageVersions['@angular-architects/module-federation'];
            json.devDependencies['@intuiface/custom-asset'] = packageVersions['@intuiface/custom-asset'];
        }
        else
        {
            // default values
            json.dependencies['@intuiface/core'] = '^0.0.7';
            json.dependencies['@intuiface/components'] = '^0.0.7';
            json.devDependencies['@angular-architects/module-federation'] = '^14.0.1';
            json.devDependencies['@intuiface/custom-asset'] = '^0.0.7';
        }

        // delete the package versions
        tree.delete(pathToPackageVersions);

        json.scripts = {
            ...json.scripts,
            build: `ng build --project ${name} --outputPath=./dist/${name}`
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


/**
 * Function to replace the angular build configuration
 * @param name
 * @returns
 */
function modifyAngularBuildConfig(name: string): Rule {
    return (tree: Tree) => {
        const path = 'angular.json';
        const file = tree.read(path);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const json = JSON.parse(file!.toString());


        // PRODUCTION CONFIGURATION : 
        // remove aot and build optimizer
        json.projects[name].architect.build.configurations.production.aot = false;
        json.projects[name].architect.build.configurations.production.buildOptimizer = false;
        // add optimization
        json.projects[name].architect.build.configurations.production.optimization = true;
        // remove vendor chunk and common chunk
        json.projects[name].architect.build.configurations.production.vendorChunk = false;
        json.projects[name].architect.build.configurations.production.commonChunk = false;
        // name the chunk
        json.projects[name].architect.build.configurations.production.namedChunks = true;
        // no output hashing
        json.projects[name].architect.build.configurations.production.outputHashing = 'none';


        // DEV CONFIGURATION (serve)
        // remove aot and build optimizer
        json.projects[name].architect.build.configurations.development.aot = false;
        json.projects[name].architect.build.configurations.development.buildOptimizer = false;
        // add optimization
        json.projects[name].architect.build.configurations.development.optimization = true;
        // remove vendor chunk and common chunk
        json.projects[name].architect.build.configurations.development.vendorChunk = false;
        json.projects[name].architect.build.configurations.development.commonChunk = false;
        // name the chunk
        json.projects[name].architect.build.configurations.development.namedChunks = true;


        tree.overwrite(path, JSON.stringify(json, null, 2));
        return tree;
    };
}

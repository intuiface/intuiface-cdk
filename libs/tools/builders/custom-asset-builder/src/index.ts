import { BrowserBuilderOutput, executeBrowserBuilder, ExecutionTransformer } from '@angular-devkit/build-angular';
import { JsonObject } from '@angular-devkit/core';
import { createBuilder, BuilderContext } from '@angular-devkit/architect';
import * as fs from 'fs';
import * as webpack from 'webpack';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

let entryPointPath;
/**
 * patchEntryPoint
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function patchEntryPoint(contents: string): void
{
    fs.writeFileSync(entryPointPath, contents);
}

//#region External Asset
interface CustomAssetOptions extends JsonObject
{
    /**
     * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
     */
    modulePath: string;

    /**
     * A name of compiled bundle
     */
    customAssetName: string;
}


/**
 * Function to build external asset
 * @param options
 * @param context
 * @param transforms
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function buildExternalAsset(options: CustomAssetOptions,
                            context: BuilderContext,
                            transforms: {
                                // eslint-disable-next-line @typescript-eslint/tslint/config
                                webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
                            } = {}): Observable<BrowserBuilderOutput>
{

    options.deleteOutputPath = false;

    validateOptions(options);

    const originalWebpackConfigurationFn = transforms.webpackConfiguration;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    transforms.webpackConfiguration = (config: webpack.Configuration) =>
    {
        patchWebpackConfig(config, options);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return originalWebpackConfigurationFn ? originalWebpackConfigurationFn(config) : config;
    };

    const result = executeBrowserBuilder(options as any, context, transforms);

    return result.pipe(tap(() =>
    {
        patchEntryPoint('');
    }));
}

/**
 * Validate options
 * @param options
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function validateOptions(options: CustomAssetOptions): void
{

    const { customAssetName, modulePath } = options;

    if (!modulePath)
    {
        throw Error('Please define modulePath!');
    }

    if (!customAssetName)
    {
        throw Error('Please provide customAssetName!');
    }
}

/**
 * Patch WebPack config
 * @param config
 * @param options
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function patchWebpackConfig(config: webpack.Configuration, options: CustomAssetOptions): void
{
    const { customAssetName } = options;

    // Make sure we are producing a single bundle
    delete config.entry.polyfills;
    delete config.entry['polyfills-es5'];
    delete config.optimization.runtimeChunk;
    delete config.optimization.splitChunks;
    delete config.entry.styles;

    config.externals = {
        'rxjs': 'rxjs',
        '@angular/core': 'ng.core',
        '@angular/common': 'ng.common',
        '@angular/forms': 'ng.forms',
        '@angular/router': 'ng.router',
        'tslib': 'tslib',
        // put here other common dependencies
        '@intuiface/core': 'intuiface.core',
        '@intuiface/components': 'intuiface.components'
    };

    const ngCompilerPluginInstance = config.plugins.find(
        (x) => x.constructor && x.constructor.name === 'AngularCompilerPlugin'
    );
    if (ngCompilerPluginInstance)
    {
        // eslint-disable-next-line no-underscore-dangle
        ngCompilerPluginInstance._entryModule = options.modulePath;
    }

    // preserve path to entry point
    // so that we can clear use it within `run` method to clear that file
    entryPointPath = config.entry.main[0];

    const [modulePath, moduleName] = options.modulePath.split('#');

    // const factoryPath = `${
    //   modulePath.includes('.') ? modulePath : `${modulePath}/${modulePath}`
    //   }.ngfactory`;
    const entryPointContents = `
    export * from '${modulePath}';
    import { ${moduleName} } from '${modulePath}';
    export default ${moduleName};
  `;
    patchEntryPoint(entryPointContents);

    config.output.filename = `${customAssetName}.js`;
    config.output.library = customAssetName;
    config.output.libraryTarget = 'umd';
    // workaround to support bundle on nodejs
    config.output.globalObject = '(typeof self !== \'undefined\' ? self : this)';
}

export default createBuilder<CustomAssetOptions>(buildExternalAsset);



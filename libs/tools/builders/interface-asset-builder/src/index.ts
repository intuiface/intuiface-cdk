import * as fs from 'fs';
import * as webpack from 'webpack';


interface IAOptions
{
    /**
     * A string of the form `path/to/file#exportName` that acts as a path to include to bundle
     */
    IAPath: string;

    /**
     * A name of compiled bundle
     */
    IAName: string;
}

/**
 * Custom builder for interface asset
 */
export class InterfaceAssetPluginBuilder {

    protected options;
    protected entryPointPath;

    public constructor(options: IAOptions)
    {
        this.options = options;
    }

    /**
     * Apply plugin
     * @param compiler
     */
    public apply(compiler: webpack.Compiler): void
    {
        this.buildIA(this.options, compiler);
    }

    /**
     * Function to build interface asset
     * @param options
     * @param context
     * @param transforms
     */
    protected buildIA(options: IAOptions,
                      webpackCompiler: webpack.Compilation): void
    {
        // check for options
        this.validateOptionsForIA(options);

        // patch config
        this.patchWebpackConfigForIA(webpackCompiler.options, options);
    }

    /**
     * Validate options
     * @param options
     */
    protected validateOptionsForIA(options: IAOptions): void
    {
        const { IAName, IAPath } = options;

        if (!IAPath)
        {
            throw Error('Please define IAPath!');
        }

        if (!IAName)
        {
            throw Error('Please provide IAName!');
        }
    }

    /**
     * patchEntryPoint
     */
    protected patchEntryPoint(contents: string): void
    {
        fs.writeFileSync(this.entryPointPath, contents);
    }

    /**
     * Patch WebPack config
     * @param config
     * @param options
     */
    protected patchWebpackConfigForIA(config: webpack.Configuration, options: IAOptions): void
    {
        const {
            IAName
        } = options;
        // Make sure we are producing a single bundle
        delete config.entry.polyfills;
        delete config.entry['polyfills-es5'];
        delete config.optimization.runtimeChunk;
        delete config.optimization.splitChunks;
        delete config.entry.styles;
        config.externals = {
            // put here other common dependencies
            '@intuiface/core': 'intuiface.core',
            '@intuiface/components': 'intuiface.components'
        };
        // preserve path to entry point
        // so that we can clear use it within `run` method to clear that file
        this.entryPointPath = config.entry.main.import[0];
        const [modulePath, moduleName] = options.IAPath.split('#');

        const entryPointContents = `
        export * from '${modulePath}';
        import { ${moduleName} } from '${modulePath}';
        export default ${moduleName};
        `;
        this.patchEntryPoint(entryPointContents);
        config.output.filename = `${IAName}.js`;
        config.output.library = {
            name: `${IAName}.js`,
            type: 'umd'
        };
        config.output.libraryTarget = 'umd';
        // workaround to support bundle on nodejs
        config.output.globalObject = '(typeof self !== \'undefined\' ? self : this)';
    }

}

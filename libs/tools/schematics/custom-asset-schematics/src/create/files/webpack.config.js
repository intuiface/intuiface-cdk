const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
    path.join(__dirname, 'tsconfig.json'),
    [ /* mapped paths to share */ ]);

module.exports = {
    output: {
        uniqueName: "<%= classify(customAssetName) %>",
        publicPath: "auto"
    },
    optimization: {
        runtimeChunk: false
    },
    resolve: {
        alias: {
            ...sharedMappings.getAliases(),
        }
    },
    plugins: [
        new ModuleFederationPlugin({

            name: '<%= classify(customAssetName) %>',
            filename: '<%= classify(customAssetName) %>.js',
            exposes: {
                './<%= classify(customAssetName) %>': 
                {
                    import: './src/app/<%= dasherize(customAssetName) %>/<%= dasherize(customAssetName) %>.module.ts',
                    name: '<%= dasherize(customAssetName) %>.module'
                },
            },

            shared: {
                "@angular/core": {
                    singleton: true,
                    strictVersion: false
                },
                "@angular/common": {
                    singleton: true,
                    strictVersion: false
                },
                "@angular/common/http": {
                    singleton: true,
                    strictVersion: false
                },
                "@angular/router": {
                    singleton: true,
                    strictVersion: false
                },
                "ngxd/core": {
                    singleton: true,
                    strictVersion: false
                },
                "@intuiface/core": {
                    singleton: true,
                    strictVersion: false
                },
                "@intuiface/components": {
                    singleton: true,
                    strictVersion: false
                },

                ...sharedMappings.getDescriptors()
            }

        }),
        sharedMappings.getPlugin()
    ],
};

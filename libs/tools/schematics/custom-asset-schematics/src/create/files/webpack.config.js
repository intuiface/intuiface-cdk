const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const webpack = require('webpack');

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
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new ModuleFederationPlugin({

            library: {
                type: "var",
                name: "<%= classify(customAssetName) %>"
            },
            name: '<%= classify(customAssetName) %>',
            filename: '<%= classify(customAssetName) %>.js',
            exposes: {
                './<%= classify(customAssetName) %>': './src/app/<%= dasherize(customAssetName) %>/<%= dasherize(customAssetName) %>.component.ts',
            },

            shared: {
                "@angular/core": {
                    singleton: true,
                    strictVersion: true
                },
                "@angular/common": {
                    singleton: true,
                    strictVersion: true
                },
                "@angular/common/http": {
                    singleton: true,
                    strictVersion: true
                },
                "@angular/router": {
                    singleton: true,
                    strictVersion: true
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

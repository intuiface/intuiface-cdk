const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        publicPath: "auto",
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "<%= IAName %>",
            filename: "<%= IAName %>.js",
            exposes: {
                "./<%= IAName %>": {
                    import : "./src/<%= IAName %>.ts",
                    name: '<%= IAName %>.module'
                }
            },
            shared: {
                "@intuiface/core": {
                    singleton: true,
                    strictVersion: false
                }
            }
        })
    ],
    entry: './src/index.js'
};

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
        path: path.resolve(__dirname, 'dist/<%= bindingConverterName %>')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "<%= bindingConverterName %>",
            filename: "<%= bindingConverterName %>.js",
            exposes: {
                "./<%= bindingConverterName %>": {
                    import : "./src/<%= bindingConverterName %>.ts",
                    name: '<%= bindingConverterName %>.module'
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
    entry: './src/<%= bindingConverterName %>.ts'
};

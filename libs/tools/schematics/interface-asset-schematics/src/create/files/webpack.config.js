const path = require('path');
const {
    InterfaceAssetPluginBuilder
} = require('@intuiface/interface-asset-builder');

module.exports = {
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        // Adding the plugin with the default options
        new InterfaceAssetPluginBuilder({
            IAPath: './<%= IAName %>.ts#<%= IAName %>',
            IAName: '<%= IAName %>'
        })
    ],
    entry: './src/index.js',
    output: {
        filename: '<%= IAName %>.js',
        path: path.resolve(__dirname, 'dist')
    },
};

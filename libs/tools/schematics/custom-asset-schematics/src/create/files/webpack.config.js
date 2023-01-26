const {
  shareAll,
  withModuleFederationPlugin,
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
    name: '<%= classify(customAssetName) %>',
    filename: '<%= classify(customAssetName) %>.js',
    library: {
        type: "module"
    },
    exposes: {
        './<%= classify(customAssetName) %>': 
        {
            import: './src/app/<%= dasherize(customAssetName) %>/<%= dasherize(customAssetName) %>.module.ts',
            name: '<%= dasherize(customAssetName) %>.module'
        },
    },
    shared: {
        ...shareAll({
            singleton: true,
            strictVersion: false
        }),
    }
});

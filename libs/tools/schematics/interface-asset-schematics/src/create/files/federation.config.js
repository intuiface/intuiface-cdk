const { withFederation } = require('@module-federation/esbuild/build');

module.exports = withFederation(
{   
    name: "<%= IAName %>",
    filename: "<%= IAName %>.js",
    exposes: {
        "./<%= IAName %>":  "./src/<%= IAName %>.ts",
    },
    shared: {
        "@intuiface/core": {
            singleton: true,
            strictVersion: false
        }
    }
});

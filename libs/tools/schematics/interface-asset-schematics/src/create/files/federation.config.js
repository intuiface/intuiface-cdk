// const { withFederation } = require('@module-federation/esbuild/build');
const { withNativeFederation } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation(
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

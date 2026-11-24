/**
 * Customise the webpack configuration of the workspace items.
 *
 * `intuiface-cli build` generates the webpack configuration of each item (entry, output in dist/<name>,
 * TypeScript loader, Module Federation) and passes it to this function before running webpack.
 * Change it and return it. See https://webpack.js.org/configuration/
 *
 * @param {import('webpack').Configuration} config configuration generated for the item
 * @param {object} context
 * @param {{ name: string, type: 'interface-asset' | 'binding-converter', entry: string }} context.item
 *        item being built, as declared in intuiface.workspace.json
 * @param {boolean} context.debug true for a debug build (`--debug`, `npm run build:debug`)
 * @returns {import('webpack').Configuration} the configuration to build the item with
 */
module.exports = (config, { item, debug }) =>
{
    // Modules provided at runtime by the player (Node.js, Electron, BrightSign) must not be bundled, for example:
    // config.externals = {
    //     'fs': 'commonjs fs',
    //     'electron': 'commonjs electron',
    //     '@brightsign/deviceinfo': 'commonjs @brightsign/deviceinfo'
    // };

    return config;
};

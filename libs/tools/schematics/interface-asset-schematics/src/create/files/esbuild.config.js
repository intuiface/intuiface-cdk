const esbuild = require('esbuild');
const { moduleFederationPlugin } = require('@module-federation/esbuild/plugin');
const federationConfig = require('./federation.config.js');
const { argv } = require('node:process');

const productionMode = ('--development' !== (argv[2] || process.env.NODE_ENV));


buildApp = async () => {
    const tsConfig = 'tsconfig.json';

    try {
        await esbuild.build({
            resolveExtensions: ['.ts'],
            tsconfig: tsConfig,
            plugins: [moduleFederationPlugin(federationConfig)],
            bundle: true,
            format: 'esm',
            drop: productionMode ? ['debugger', 'console'] : [],
            logLevel: productionMode ? 'error' : 'info',
            minify: productionMode,
            // sourcemap: !productionMode && 'linked',
            outdir: './dist'
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

void buildApp();

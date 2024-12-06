/* eslint-disable prefer-arrow/prefer-arrow-functions */
// import * as esbuild from 'esbuild';
// import * as fs from 'fs';
// import { esBuildAdapter } from '@softarc/native-federation-esbuild';
// import { federationBuilder } from '@softarc/native-federation/build';

const esbuild = require('esbuild');
const fs = require('fs');
const { esBuildAdapter } = require('@softarc/native-federation-esbuild');
const { federationBuilder } = require('@softarc/native-federation/build');

/**
 * Build project
 * @param IAName
 */
async function buildProject(IAName) {

    const tsConfig = 'tsconfig.json';
    const outputPath = 'dist/';

    /*
     *  Step 1: Initialize Native Federation
    */

    await federationBuilder.init({
        options: {
            workspaceRoot: __dirname,
            outputPath: outputPath,
            tsConfig: tsConfig,
            federationConfig: './federation.config.js',
            verbose: false,
        },

        /*
            * As this core lib is tooling-agnostic, you
            * need a simple adapter for your bundler.
            * It's just a matter of one function.
        */
        adapter: esBuildAdapter
    });

    /*
        *  Step 2: Trigger your build process
    *
        *      You can use any tool for this. Here, we go with a very
        *      simple esbuild-based build.
        *
        *      Just respect the externals in `federationBuilder.externals`.
    */

    fs.rmSync(outputPath, { force: true, recursive: true });

    await esbuild.build({
        entryPoints: [`src/${IAName}.ts`],
        external: federationBuilder.externals,
        outdir: outputPath,
        bundle: true,
        platform: 'browser',
        format: 'esm',
        mainFields: ['es2020', 'browser', 'module', 'main'],
        conditions: ['es2020', 'es2015', 'module'],
        resolveExtensions: ['.ts', '.tsx', '.mjs', '.js'],
        tsconfig: tsConfig,
        splitting: true
    });

    /*
        *  Step 3: Let the build method do the additional tasks
        *       for supporting Native Federation
    */

    await federationBuilder.build();
}

void buildProject('TestUpdate');

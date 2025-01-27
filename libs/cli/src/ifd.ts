#!/usr/bin/env node

/* eslint-disable camelcase */
import { exec } from 'child_process';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promisify } from 'util';

const execPromise = promisify(exec);

const y = yargs(hideBin(process.argv));
const argv = y.argv as { name?: string; n?: string;[key: string]: unknown };

const globalThisAny = globalThis as any;

const usage = '\nUsage: Generate ifd file and build the IA <name> to be able to add it in an Intuiface Experience.';
const options = y
    .usage(usage)
    .option('name',
        {
            alias: 'n', describe: 'The name of the IA file.', type: 'string', demandOption: false
        })
    .option(
        'debug',
        {
            alias: 'd', describe: 'Build in debug mode.', type: 'boolean', demandOption: false
        })
    .help().argv;


// Check parameters
if (argv.name != null || argv.n != null)
{
    // create object to store metadatas
    globalThisAny.intuiface_ifd_name = argv.name || argv.n;
    globalThisAny.intuiface_ifd_classes = [];
    globalThisAny.intuiface_ifd_properties = {};
    globalThisAny.intuiface_ifd_actions = {};
    globalThisAny.intuiface_ifd_params = {};
    globalThisAny.intuiface_ifd_triggers = {};

    // Initialize dom feature
    globalThisAny.window = new JSDOM('', { url: 'https://web.intuiface.com/' }).window;
    // Inject everything from `window` into global scope
    for (const key in globalThisAny.window)
    {
        if (Object.prototype.hasOwnProperty.call(globalThisAny.window, key) && globalThisAny[key] === undefined)
        {
            globalThisAny[key] = globalThisAny.window[key];
        }
    }

    void loadIA(argv.name || argv.n);
}
else
{
    // show help if parameters are not correct
    y.showHelp();
}


/**
 * Clean build folders
 * @param dir 
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function cleanBuildFolders(dir: string): void
{
    // clean dist
    if (fs.existsSync(`${dir}/dist/`))
    {
        fs.remove(`${dir}/dist/`);
    }
    // clean tmp
    if (fs.existsSync(`${dir}/tmp/`))
    {
        fs.remove(`${dir}/tmp/`);
    }
}

/**
 * import the IA
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function loadIA(iaName: string | undefined): Promise<void>
{
    const dir = process.cwd();

    cleanBuildFolders(dir);
    try
    {
        // set interface asset to import in composer
        if (iaName !== undefined)
        {
            // transpile ia file
            await execPromise(`npx tsc --project ${dir}/tsconfig.ifd.json`);
            // copy package.json
            await execPromise(`shx cp ${dir}/src/package.json ${dir}/tmp/`);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const ia = await import(`${dir}/tmp/${iaName}.js`);

            const schemas: any = {};
            const resources: any = {};
            for (const name of globalThisAny.intuiface_ifd_classes)
            {
                schemas[name] = {
                    id: name,
                    type: 'object',
                    description: name,
                    properties: globalThisAny.intuiface_ifd_properties[name]
                };

                resources[name] = {
                    id: name,
                    methods: globalThisAny.intuiface_ifd_actions[name],
                    events: globalThisAny.intuiface_ifd_triggers[name]
                };
            }


            resources[iaName]['if.interfaceAsset'] = true;
            resources[iaName].title = globalThisAny.iaTitle;
            resources[iaName].description = globalThisAny.iaDescription;

            // create the ifd as json object
            // and add metadatas filled from decorators
            globalThisAny.intuiface_ifd_file = {
                'version': `v1.0.${Date.now()}`,
                'name': iaName,
                'title': globalThisAny.iaTitle,
                'if.category': globalThisAny.iaCategory,
                'protocol': 'ts',
                'basePath': iaName,
                'if.dependencies': [
                    `${iaName}.js`,
                    `${iaName}.module.js`
                ],
                'schemas': schemas,
                'resources': resources
            };


            // write the ifd file
            fs.outputFile(`dist/${iaName}.ifd`, JSON.stringify(globalThisAny.intuiface_ifd_file), 'utf8', (err: any) =>
            {
                if (err)
                {
                    console.log('An error occured while writing JSON Object to File.');
                    return console.log(err);
                }

                console.log('IFD file has been saved.');
            });

            // clean tmp
            if (fs.existsSync(`${dir}/tmp/`))
            {
                fs.remove(`${dir}/tmp/`);
            }

            if (!argv.debug)
            {
                exec(`npx webpack --config ${dir}/webpack.config.js`);
            }
            else
            {
                exec(`npx webpack --config ${dir}/webpack-debug.config.js`);
            }
        }
    }
    catch (e)
    {
        cleanBuildFolders(dir);
        console.error(e);
    }
}

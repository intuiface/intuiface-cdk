#!/usr/bin/env node

/* eslint-disable camelcase */
import { exec } from 'child_process';
import fs from 'fs-extra';
import { JSDOM } from 'jsdom';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { promisify } from 'util';
import yoctoSpinner, {Spinner} from 'yocto-spinner';


const execPromise = promisify(exec);

const y = yargs(hideBin(process.argv));
// const argv = y.argv as { name?: string; n?: string; icon?: string; i?: string; debug?: boolean; d?: boolean };

const globalThisAny = globalThis as any;

const usage = '\nUsage: Generate ifd file and build the IA <name> to be able to add it in an Intuiface Experience.';
const options = y
    .command('$0 <name|n> [icon|i] [debug|d]', usage,
        () =>
        {
            y.option('name', { alias: 'n', describe: 'The name of the IA file.', type: 'string', demandOption: true });
            y.option('icon', { alias: 'i', describe: 'The path to the icon of the IA displayed in Composer Interface Asset panel.', type: 'string', demandOption: false });
            y.option('debug', { alias: 'd', describe: 'Build in debug mode.', type: 'boolean', demandOption: false });
        },
        (args) =>
        {

            // Check parameters
            if (args.name != null || args.n != null)
            {
            // create object to store metadatas
                globalThisAny.intuiface_ifd_name = args.name || args.n;
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

                void loadIA(args.name as string || args.n as string,
                    args.i as string || args.icon as string,
                    args.debug !== undefined || args.d !== undefined);
            }
        })
    .command('migrate', 'Migrate old projects to new CLI.', {}, () => {
        migrateProject();
    })
    .wrap(null)
    .help()
    .parse();


/**
 * Clean build folders
 * @param dir 
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function cleanBuildFolders(dir: string, iaName: string = undefined): void
{
    // clean dist
    if (iaName && fs.existsSync(`${dir}/dist/${iaName}`))
    {
        fs.removeSync(`${dir}/dist/${iaName}`);
    }
    // clean tmp
    if (fs.existsSync(`${dir}/tmp/`))
    {
        fs.removeSync(`${dir}/tmp/`);
    }
}

/**
 * import the IA
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function loadIA(iaName: string | undefined, icon: string | undefined, debug?: boolean): Promise<void>
{
    const spinner: Spinner = yoctoSpinner({ text: 'Using intuiface CLI...' }).start();
    spinner.info('Using intuiface CLI...');

    const dir = process.cwd();

    cleanBuildFolders(dir, iaName);
    try
    {
        // set interface asset to import in composer
        if (iaName !== undefined)
        {
            const spinnerIFD: Spinner = yoctoSpinner({text: 'Generating ifd...'}).start();
            // transpile ia file
            await execPromise(`npx tsc --project ${dir}/tsconfig.json --outDir ${dir}/tmp/`);
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

            let iconName = '';
            if (icon)
            {
                // get the icon name from the icon path
                iconName = icon.substring(icon.lastIndexOf('/') + 1);
                // add the icon to the ifd file
                globalThisAny.intuiface_ifd_file.icons = { x32: iconName };
            }

            // write the ifd file
            await writeIFDFile(iaName, globalThisAny.intuiface_ifd_file, spinnerIFD);

            // clean tmp
            if (fs.existsSync(`${dir}/tmp/`))
            {
                fs.removeSync(`${dir}/tmp/`);
            }

            const spinnerIA: Spinner = yoctoSpinner({ text: `Building IA : ${iaName}...` }).start();
            if (!debug)
            {
                await execPromise(`npx webpack --config ${dir}/webpack.config.js`);
            }
            else
            {
                await execPromise(`npx webpack --config ${dir}/webpack-debug.config.js`);
            }
            spinnerIA.success(`IA ${iaName} successfully built.`);

            if(icon)
            {
                if (icon.startsWith('./'))
                {
                    icon = icon.substring(2);
                }
                const spinnerIcon: Spinner = yoctoSpinner({ text: `Copy icon ${iconName}...` }).start();
                // copy the icon in dist folder
                await execPromise(`shx cp ${dir}/${icon} ${dir}/dist/${iaName}/${iconName}`);
                spinnerIcon.success(`Icon ${iconName} copied.`);
            }

            spinnerIA.success('Done, you can now use your IA in Composer.');
        }
        spinner.stop();
    }
    catch (e)
    {
        cleanBuildFolders(dir, iaName);
        spinner.error(e);
        process.exit(-1);
    }
}

/**
 * Write the ifd file
 * @param iaName 
 * @param ifd 
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function writeIFDFile(iaName: string, ifd: any, spinner: Spinner): Promise<void>
{
    return new Promise((resolve, reject) =>
    {
        // write the ifd file
        fs.outputFile(`dist/${iaName}/${iaName}.ifd`, JSON.stringify(ifd, null, 2), 'utf8', (err: any) =>
        {
            if (err)
            {
                spinner.error('An error occurred while writing JSON Object to File.');
                reject(err);
                return spinner.error(err);
            }

            spinner.success('IFD file has been saved.');
            resolve();
        });
    });
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function migrateProject(): void
{
    const dir = process.env.INIT_CWD;

    const spinner: Spinner = yoctoSpinner({ text: 'Running migration to new CLI...' }).start();
    // check for index_ifd.ts
    if (fs.existsSync(`${dir}/src/index_ifd.ts`))
    {


        try
        {
            // read index_ifd.ts to get ia name
            const indexIFD = fs.readFileSync(`${dir}/src/index_ifd.ts`);
            const regexp = /const ia = await import\('.\/(.*).js'\);/g;

            // get line with import of IA file
            if (indexIFD && indexIFD.includes('const ia = await import('))
            {
                // get ia name with a regexp
                const iaName = regexp.exec(indexIFD)[1];
                // read the package.json
                const packageJson = fs.readJsonSync(`${dir}/package.json`, { flag: 'r' });
                // edit script build
                packageJson.scripts.build = `npx ifd -n ${iaName}`;
                packageJson.scripts['build:debug'] = `npx ifd -n ${iaName} -d`;
                // remove old scripts
                delete packageJson.scripts.cleanDist;
                delete packageJson.scripts.cleanTmp;

                // write package.json
                fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2));

                // remove index_ifd.ts
                fs.removeSync(`${dir}/src/index_ifd.ts`);
                // remove tsconfig.ifd.json
                fs.removeSync(`${dir}/tsconfig.ifd.json`);
                // clear dist folder
                fs.removeSync(`${dir}/dist`);

                spinner.success('Migration completed. You can now use the new CLI.');
            }
        } catch (error)
        {
            spinner.error(error);
            process.exit(-2);
        }
    }
    else
    {
        spinner.success('Migration was already done. You can now use the new CLI.');
    }

}

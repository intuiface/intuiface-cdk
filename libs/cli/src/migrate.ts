import fs from 'fs-extra';
import yoctoSpinner, { Spinner } from 'yocto-spinner';
import { EOL } from 'os';

const dir = process.env.INIT_CWD;

// check for index_ifd.ts
if(fs.existsSync(`${dir}/src/index_ifd.ts`))
{
    const spinner: Spinner = yoctoSpinner({ text: 'Running migration to new CLI...' }).start();

    try {
        // read index_ifd.ts to get ia name
        const indexIFD = fs.readFileSync(`${dir}/src/index_ifd.ts`);
        const regexp = /const ia = await import\('.\/(.*).js'\);/g;

        // get line with import of IA file
        if (indexIFD && indexIFD.includes('const ia = await import('))
        {
            // get ia name with a regexp
            const iaName = regexp.exec(indexIFD)[1];
            // read the package.json
            const packageJson = fs.readJsonSync(`${dir}/package.json`, { flag: 'r'});
            // edit script build
            packageJson.scripts.build = `npx ifd -n ${iaName}`;
            packageJson.scripts['build:debug'] = `npx ifd -n ${iaName} -d`;
            // remove old scripts
            delete packageJson.scripts.cleanDist;
            delete packageJson.scripts.cleanTmp;

            // write package.json
            fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2));

            // remove index_ifd.ts
            fs.remove(`${dir}/src/index_ifd.ts`);
            // remove tsconfig.ifd.json
            fs.remove(`${dir}/tsconfig.ifd.json`);
            // clear dist folder
            fs.remove(`${dir}/dist`);

            spinner.success('Migration completed. You can now use the new CLI.');
        }
    } catch (error) {
        spinner.error(error);
    }
}

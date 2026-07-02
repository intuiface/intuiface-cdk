import fs from 'fs-extra';
import ora from 'ora';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function migrateProject(): void
{
    const dir = process.env.INIT_CWD;

    const spinner = ora({ text: 'Migrating project to Intuiface CLI...' }).start();
    if (fs.existsSync(`${dir}/src/index_ifd.ts`))
    {
        spinner.info();
        try
        {
            spinner.indent = 3;
            spinner.start('Extract information from current code');
            const indexIFD = fs.readFileSync(`${dir}/src/index_ifd.ts`);
            const regexp = /const ia = (await import\('.\/(?<importName>\w+).js'\))|(new (?<cstrName>\w+)\(\));/g;

            if (indexIFD)
            {
                const match = regexp.exec(indexIFD.toString());
                let iaName = '';
                if (match?.groups)
                {
                    iaName = match.groups.importName ?? match.groups.cstrName;
                }

                if (iaName == null || iaName === '')
                {
                    throw new Error('Can\'t find IA name from current workspace.');
                }
                spinner.succeed(`Information of Interface Asset '${iaName}' extracted`);

                spinner.start('Update package.json scripts');
                const packageJson = fs.readJsonSync(`${dir}/package.json`, { flag: 'r' });
                packageJson.scripts.build = `npx intuiface-cli build -n ${iaName}`;
                packageJson.scripts['build:debug'] = `npx intuiface-cli build -n ${iaName} -d`;
                delete packageJson.scripts.cleanDist;
                delete packageJson.scripts.cleanTmp;

                fs.writeFileSync(`${dir}/package.json`, JSON.stringify(packageJson, null, 2));
                spinner.succeed();

                spinner.start('Update tsconfig.json');
                const tsconfigRaw = fs.readFileSync(`${dir}/tsconfig.json`, 'utf8');
                const tsconfig = JSON.parse(tsconfigRaw.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']'));

                tsconfig.compilerOptions.outDir = `./dist/${iaName}`;
                tsconfig.compilerOptions.target = 'ES2022';
                tsconfig.compilerOptions.useDefineForClassFields = false;
                tsconfig.compilerOptions.rootDir = '.';
                tsconfig.compilerOptions.moduleResolution = 'bundler';
                delete tsconfig.compilerOptions.downlevelIteration;
                tsconfig.include = ['**/src/**/*.ts'];
                fs.writeFileSync(`${dir}/tsconfig.json`, JSON.stringify(tsconfig, null, 2));
                spinner.succeed();

                spinner.start('Update webpack.config.js');
                let webpackConfig = fs.readFileSync(`${dir}/webpack.config.js`, 'utf8');
                webpackConfig = `const path = require('path');\n${webpackConfig}`;
                webpackConfig = webpackConfig.replace(/publicPath: "auto",?/g, `publicPath: "auto",\n\t\tpath: path.resolve(__dirname, 'dist/${iaName}')`);
                webpackConfig = webpackConfig.replace(/entry: '.+'/g, `entry: './src/${iaName}.ts'`);
                fs.writeFileSync(`${dir}/webpack.config.js`, webpackConfig);
                spinner.succeed();

                spinner.start('Remove unused files');
                fs.removeSync(`${dir}/src/index_ifd.ts`);
                fs.removeSync(`${dir}/src/index.js`);
                if (fs.existsSync(`${dir}/src/package.json`))
                {
                    fs.removeSync(`${dir}/src/package.json`);
                }
                fs.removeSync(`${dir}/tsconfig.ifd.json`);
                fs.removeSync(`${dir}/dist`);

                spinner.succeed();

                spinner.indent = 0;
                spinner.succeed('Migration completed.\nRun: \'npm run build\' to build your interface asset with new CLI.');
            }
        }
        catch (error)
        {
            spinner.fail();
            const typedError = error instanceof Error ? error : new Error(String(error));
            spinner.fail(`Error: ${typedError.message}\n${typedError.stack}`);
            process.exit(-2);
        }
    }
    else
    {
        spinner.succeed('Migration was already done. You can now use the new CLI.');
    }
}

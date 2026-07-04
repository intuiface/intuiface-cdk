#!/usr/bin/env node

/* eslint-disable camelcase */
import { Command } from 'commander';
import { runBuildCommand } from './commands/build.command.js';
import { initializeWorkspace } from './commands/init.command.js';
import { addInterfaceAsset, addBindingConverter } from './commands/add.command.js';
import { runMigrateCommand } from './commands/migrate.command.js';
import { MIN_NODE_MAJOR } from './services/generator.service.js';

const nodeMajor = Number(process.version.replace(/^v/, '').split('.')[0]);
if (nodeMajor < MIN_NODE_MAJOR)
{
    process.stderr.write(`Error: Intuiface CLI requires Node.js >= ${MIN_NODE_MAJOR}. Currently running ${process.version}.\n`);
    process.exit(1);
}

const usage = 'Intuiface CLI helps you build interface assets for Intuiface.\nTo see help for a specific command, you can run:\n  intuiface-cli help <command>\n  intuiface-cli <command> --help';

const program = new Command();
const ifdCmd = program
    .name('intuiface-cli')
    .description(usage);

ifdCmd.command('build')
    .summary('build one or more workspace items')
    .description('Build an interface asset or binding converter and generate its descriptor file (*.ifd) to be imported into Intuiface Composer.')
    .option('-n, --name <name>', 'name of the interface asset or binding converter to build.')
    .option('-a, --all', 'build all configured workspace items.')
    .option('-t, --type <type>', 'asset type to build: interface-asset or binding-converter.', 'interface-asset')
    .option('-i, --icon [icon]', 'relative path to an icon. Prefer setting the icon in workspace config with `add` or `init`.')
    .option('-d, --debug', 'build in debug mode.')
    .addHelpText('afterAll', '\nExamples:\n  intuiface-cli build --name MyCustomIA\n  intuiface-cli build --name MyBindingConverter --type binding-converter\n  intuiface-cli build --all\n')
    .action((options) => runBuildCommand(options));

ifdCmd.command('init')
    .summary('initialize an Intuiface workspace')
    .description('Create a CLI-managed Intuiface workspace that can host multiple interface assets and binding converters.')
    .option('-n, --name <name>', 'workspace package name. Defaults to the current folder name.')
    .action(async (options) =>
    {
        await initializeWorkspace(options.name);
    });

const addCmd = ifdCmd.command('add')
    .summary('add a new workspace item')
    .description('Generate a new interface asset or binding converter in the current Intuiface workspace.')
    .addHelpText('afterAll', '\nExamples:\n  intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom\n  intuiface-cli add interface-asset -n MyInterfaceAsset -c Custom -i ./icons/asset.png\n  intuiface-cli add binding-converter -n MyBindingConverter -c Custom\n  intuiface-cli add binding-converter -n MyBindingConverter -c Custom -i ./icons/converter.png\n');

addCmd.command('interface-asset')
    .description('Generate a new interface asset in the current workspace.')
    .requiredOption('-n, --name <name>', 'interface asset name.')
    .requiredOption('-c, --category <category>', 'category displayed in Composer.')
    .option('-i, --icon <icon>', 'relative path to an interface asset icon that will be displayed in Composer Interface Asset panel.')
    .action((options) =>
    {
        addInterfaceAsset(options);
    });

addCmd.command('binding-converter')
    .description('Generate a new binding converter in the current workspace.')
    .requiredOption('-n, --name <name>', 'binding converter name.')
    .requiredOption('-c, --category <category>', 'category displayed in Composer.')
    .option('-i, --icon <icon>', 'relative path to an interface asset icon that will be displayed in Composer Interface Asset panel.')
    .action((options) =>
    {
        addBindingConverter(options);
    });

ifdCmd.command('migrate')
    .description('Migrate old project (<2.x) to new CLI.\nRun this command in the root folder of your project.')
    .summary('migrate old project (<2.x) to new CLI.')
    .action(() =>
    {
        runMigrateCommand();
    });

program.showHelpAfterError();
program.parse();

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { askWorkspaceInitQuestions } from '../services/prompt.service.js';
import { addWorkspaceItem } from '../services/item.service.js';
import { buildWorkspaceTsConfig, createWorkspacePackageJson } from '../services/generator.service.js';
import { getWorkspaceConfigFileName } from '../services/workspace.service.js';
import { execPromise, isExecException } from '../utils/exec.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function initializeWorkspace(name?: string): Promise<void>
{
    if (process.stdin.isTTY && process.stdout.isTTY)
    {
        await initializeWorkspaceInteractive(name);
        return;
    }

    const workspaceName = name?.trim() || path.basename(process.cwd());
    initializeWorkspaceFiles(workspaceName);
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function initializeWorkspaceInteractive(name?: string): Promise<void>
{
    const defaultWorkspaceName = name?.trim() || path.basename(process.cwd());
    const responses = await askWorkspaceInitQuestions(defaultWorkspaceName);

    initializeWorkspaceFiles(responses.workspaceName);

    addWorkspaceItem({
        name: responses.firstItem.name,
        type: responses.firstItem.type,
        category: responses.firstItem.category,
        icon: responses.firstItem.icon,
        entry: ''
    });

    await installWorkspaceDependencies(process.cwd());
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function initializeWorkspaceFiles(workspaceName: string): void
{
    const dir = process.cwd();
    const workspaceConfigPath = path.join(dir, getWorkspaceConfigFileName());

    if (fs.existsSync(workspaceConfigPath))
    {
        throw new Error(`An Intuiface workspace already exists in '${dir}'.`);
    }

    const packageJson = createWorkspacePackageJson(workspaceName);
    fs.writeJsonSync(path.join(dir, 'package.json'), packageJson, { spaces: 2 });
    console.log(`${chalk.blue('UPDATE')} package.json (${JSON.stringify(packageJson).length} bytes)`);

    fs.writeJsonSync(path.join(dir, getWorkspaceConfigFileName()), { version: 1, name: workspaceName, items: [] }, { spaces: 2 });
    console.log(`${chalk.blue('UPDATE')} ${getWorkspaceConfigFileName()}`);

    fs.writeFileSync(path.join(dir, 'tsconfig.json'), buildWorkspaceTsConfig(), 'utf8');
    console.log(`${chalk.blue('UPDATE')} tsconfig.json`);

    fs.writeFileSync(path.join(dir, '.gitignore'), 'dist/\ntmp/\nnode_modules/\n', 'utf8');
    console.log(`${chalk.blue('CREATE')} .gitignore`);

    fs.ensureDirSync(path.join(dir, 'src', 'interface-assets'));
    fs.ensureDirSync(path.join(dir, 'src', 'binding-converters'));
    console.log();
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function installWorkspaceDependencies(dir: string): Promise<void>
{
    const spinner = ora({ prefixText: chalk.dim('...'), text: chalk.cyan('Installing packages (npm)...') }).start();
    spinner.color = 'cyan';

    try
    {
        const result = await execPromise('npm install', { cwd: dir });
        spinner.succeed(chalk.green('Installed successfully.'));
        console.log();

        if (result.stdout.trim() !== '')
        {
            const outputLines = result.stdout.trim().split('\n');
            const summaryLines = outputLines.filter((line) => line.includes('packages') || line.includes('vulnerabilities') || line.includes('funding'));
            if (summaryLines.length > 0)
            {
                console.log(chalk.dim(summaryLines.join('\n')));
            }
        }
    }
    catch (e)
    {
        spinner.fail(chalk.red('Failed to install workspace dependencies.'));

        if (isExecException(e))
        {
            const message = e.stderr || e.stdout || e.message;
            throw new Error(`npm install failed: ${message}`);
        }

        throw e;
    }
}

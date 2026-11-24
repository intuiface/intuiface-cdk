import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { askWorkspaceInitQuestions } from '../services/prompt.service.js';
import { addWorkspaceItem } from '../services/item.service.js';
import {
    buildWorkspaceTsConfig,
    createWorkspacePackageJson,
    getWorkspaceNodeVersion,
    logGeneratedFile,
    scaffoldWorkspaceTemplate,
    writeWorkspaceFile,
    writeWorkspacePackageJson
} from '../services/generator.service.js';
import { getWorkspaceConfigFileName, writeWorkspaceConfig } from '../services/workspace.service.js';
import { formatDependencyUpdates } from '../utils/dependencies.js';
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

    // Existing files are completed, never overwritten. package.json goes first: an invalid one stops init before anything is written.
    const packageJsonFile = writeWorkspacePackageJson(dir, workspaceName);
    logGeneratedFile(packageJsonFile);
    // Added dependencies are expected in a new workspace, only report the versions raised in an existing package.json
    const raisedDependencies = packageJsonFile.dependencyUpdates.filter((update) => update.from != null);
    if (raisedDependencies.length > 0)
    {
        console.log(chalk.dim(`       Raised dependencies: ${formatDependencyUpdates(raisedDependencies)}`));
    }

    writeWorkspaceConfig(dir, { version: 1, name: workspaceName, items: [] });
    logGeneratedFile({ relativePath: getWorkspaceConfigFileName(), bytes: fs.statSync(workspaceConfigPath).size, action: 'create' });

    logGeneratedFile({ relativePath: 'tsconfig.json', ...writeWorkspaceFile(path.join(dir, 'tsconfig.json'), buildWorkspaceTsConfig()) });
    logGeneratedFile({ relativePath: '.nvmrc', ...writeWorkspaceFile(path.join(dir, '.nvmrc'), `${getWorkspaceNodeVersion()}\n`) });

    for (const generatedFile of scaffoldWorkspaceTemplate(workspaceName, dir))
    {
        logGeneratedFile(generatedFile);
    }

    fs.ensureDirSync(path.join(dir, 'src', 'interface-assets'));
    fs.ensureDirSync(path.join(dir, 'src', 'binding-converters'));

    const workspaceScripts = createWorkspacePackageJson(workspaceName).scripts;
    for (const scriptName of packageJsonFile.keptScripts)
    {
        console.log(chalk.yellow(`⚠ package.json keeps its own '${scriptName}' script. The workspace one is '${workspaceScripts[scriptName]}'.`));
    }
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

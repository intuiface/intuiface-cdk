import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import chalk from 'chalk';
import { BuildType, InitItemOptions } from '../types.js';
import { validateGeneratedName, validateIconPath } from '../utils/validators.js';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function askWorkspaceInitQuestions(defaultWorkspaceName: string): Promise<{ workspaceName: string; firstItem: InitItemOptions }>
{
    const rl = createInterface({ input, output });

    try
    {
        console.log();
        const workspaceName = await askColoredQuestion(
            rl,
            'What is your workspace name?',
            defaultWorkspaceName
        );

        const itemType = await askItemTypeQuestion(rl);

        const defaultItemName = itemType === 'interface-asset' ? 'MyInterfaceAsset' : 'MyBindingConverter';
        const itemName = await askItemNameQuestion(rl, itemType, defaultItemName);

        const defaultCategory = 'Custom';
        const category = await askColoredQuestion(rl, 'What is the category in Composer?', defaultCategory);

        const icon = await askIconQuestion(rl);

        return {
            workspaceName: workspaceName,
            firstItem: {
                type: itemType,
                name: itemName,
                category: category,
                icon: icon
            }
        };
    }
    finally
    {
        rl.close();
    }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function askColoredQuestion(
    rl: ReturnType<typeof createInterface>,
    question: string,
    fallbackValue: string
): Promise<string>
{
    let value = '';
    while (value === '')
    {
        const prompt = `${chalk.cyan('?')} ${question} ${chalk.dim(`(${fallbackValue})`)}${chalk.dim(': ')}`;
        const answer = (await rl.question(prompt)).trim();
        value = answer === '' ? fallbackValue : answer;
    }

    console.log(`${chalk.green('✔')} ${chalk.cyan(value)}`);
    console.log();
    return value;
}

/** Answers accepted for the type of the first item. Enter keeps the first one. */
const itemTypeAnswers: ReadonlyMap<string, BuildType> = new Map<string, BuildType>([
    ['', 'interface-asset'],
    ['1', 'interface-asset'],
    ['interface-asset', 'interface-asset'],
    ['2', 'binding-converter'],
    ['binding-converter', 'binding-converter']
]);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function askItemTypeQuestion(rl: ReturnType<typeof createInterface>): Promise<BuildType>
{
    let itemType: BuildType | undefined;
    while (itemType == null)
    {
        const prompt = `${chalk.cyan('?')} What item would you like to create first? ${chalk.dim('[1=interface-asset, 2=binding-converter]')} ${chalk.dim('(1)')}${chalk.dim(': ')}`;
        const answer = (await rl.question(prompt)).trim();
        itemType = itemTypeAnswers.get(answer.toLowerCase());
        if (itemType == null)
        {
            console.log(chalk.red(`✖ Invalid choice '${answer}'. Answer 1 (interface-asset) or 2 (binding-converter).`));
        }
    }

    console.log(`${chalk.green('✔')} ${chalk.cyan(itemType)}`);
    console.log();
    return itemType;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function askIconQuestion(rl: ReturnType<typeof createInterface>): Promise<string | undefined>
{
    // Same check as `add`: the icon path is relative to the workspace folder, the current one
    let icon: string | undefined;
    let isValid = false;
    while (!isValid)
    {
        const answer = (await rl.question(`${chalk.cyan('?')} Icon path (optional, press Enter to skip): `)).trim();
        icon = answer === '' ? undefined : answer;

        try
        {
            if (icon != null)
            {
                validateIconPath(icon, process.cwd());
            }
            isValid = true;
        }
        catch (error)
        {
            const typedError = error instanceof Error ? error : new Error(String(error));
            console.log(chalk.red(`✖ ${typedError.message}`));
        }
    }

    console.log(`${chalk.green('✔')} ${icon != null ? chalk.cyan(icon) : chalk.dim('(skipped)')}`);
    console.log();
    return icon;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function askItemNameQuestion(
    rl: ReturnType<typeof createInterface>,
    itemType: BuildType,
    fallbackValue: string
): Promise<string>
{
    let itemName = '';
    let isValid = false;
    while (!isValid)
    {
        const prompt = `${chalk.cyan('?')} What is your ${itemType} name? ${chalk.dim(`(${fallbackValue})`)}${chalk.dim(': ')}`;
        const answer = (await rl.question(prompt)).trim();
        itemName = answer === '' ? fallbackValue : answer;

        try
        {
            validateGeneratedName(itemName);
            isValid = true;
        }
        catch (error)
        {
            const typedError = error instanceof Error ? error : new Error(String(error));
            console.log(chalk.red(`✖ ${typedError.message}`));
        }
    }

    console.log(`${chalk.green('✔')} ${chalk.cyan(itemName)}`);
    console.log();
    return itemName;
}

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import chalk from 'chalk';
import { BuildType, InitItemOptions } from '../types.js';
import { validateGeneratedName } from '../utils/validators.js';

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

        const typeAnswer = (await rl.question(`${chalk.cyan('?')} What item would you like to create first? ${chalk.dim('[1=interface-asset, 2=binding-converter]')}: `)).trim();
        const itemType: BuildType = typeAnswer === '2' ? 'binding-converter' : 'interface-asset';
        console.log(`${chalk.green('✔')} ${chalk.cyan(itemType)}`);
        console.log();

        const defaultItemName = itemType === 'interface-asset' ? 'MyInterfaceAsset' : 'MyBindingConverter';
        const itemName = await askItemNameQuestion(rl, itemType, defaultItemName);

        const defaultCategory = 'Custom';
        const category = await askColoredQuestion(rl, 'What is the category in Composer?', defaultCategory);

        const iconInput = (await rl.question(`${chalk.cyan('?')} Icon path (optional, press Enter to skip): `)).trim();
        const icon = iconInput === '' ? undefined : iconInput;
        if (icon != null)
        {
            console.log(`${chalk.green('✔')} ${chalk.cyan(icon)}`);
        }
        else
        {
            console.log(`${chalk.green('✔')} ${chalk.dim('(skipped)')}`);
        }
        console.log();

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

import fs from 'fs-extra';
import path from 'path';

const validGeneratedName = /^[A-Za-z][A-Za-z0-9]*$/;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validateGeneratedName(name: string): void
{
    if (!validGeneratedName.test(name))
    {
        throw new Error(`Invalid name '${name}'. Use alphanumeric characters only and start with a letter.`);
    }
}

/**
 * Check that an icon file exists. As at build time, a relative path is resolved from `dir` (the workspace folder).
 * @param icon icon path, as given by the developer
 * @param dir folder relative paths start from
 * @param itemName item the icon belongs to, named in the error message
 * @throws when there is no file at that path
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validateIconPath(icon: string, dir: string, itemName?: string): void
{
    const iconPath = path.resolve(dir, icon);
    if (!fs.existsSync(iconPath) || !fs.statSync(iconPath).isFile())
    {
        const owner = itemName ? ` of '${itemName}'` : '';
        throw new Error(`Cannot find the icon '${icon}'${owner}: there is no file at '${iconPath}'.`);
    }
}

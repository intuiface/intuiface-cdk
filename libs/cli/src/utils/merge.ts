import { isDeepStrictEqual } from 'util';

/**
 * Merge helpers used to write template files over existing ones without losing their content,
 * as the former schematics did for their configuration files.
 */

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Parse a JSON object.
 * @returns undefined when the text is not a JSON object (invalid JSON, JSON with comments, an array...)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function parseJsonObject(text: string): Record<string, unknown> | undefined
{
    try
    {
        const parsed: unknown = JSON.parse(text);
        return isPlainObject(parsed) ? parsed : undefined;
    }
    catch (_error)
    {
        return undefined;
    }
}

/**
 * Add to `target` the values of `defaults` it does not have. Objects are merged recursively and
 * every value already in `target` wins, including arrays. Keys keep the order of `target`.
 * @returns a new object, `target` is not modified
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function addMissingValues(target: Record<string, unknown>, defaults: Readonly<Record<string, unknown>>): Record<string, unknown>
{
    const result: Record<string, unknown> = { ...target };

    for (const [key, defaultValue] of Object.entries(defaults))
    {
        const targetValue = result[key];
        if (targetValue === undefined)
        {
            result[key] = defaultValue;
        }
        else if (isPlainObject(targetValue) && isPlainObject(defaultValue))
        {
            result[key] = addMissingValues(targetValue, defaultValue);
        }
    }

    return result;
}

/**
 * Merge a JSON template into an existing JSON file with {@link addMissingValues}.
 * The indentation and line endings of the existing file are kept.
 * @returns the merged text, or undefined when the existing file is kept as is
 * (nothing to add, or one of the texts is not a JSON object: e.g. a VS Code settings file with comments)
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function mergeJsonText(existingText: string, templateText: string): string | undefined
{
    const existing = parseJsonObject(existingText);
    const template = parseJsonObject(templateText);
    if (!existing || !template)
    {
        return undefined;
    }

    const merged = addMissingValues(existing, template);
    return isDeepStrictEqual(merged, existing) ? undefined : stringifyJsonLike(merged, existingText);
}

/**
 * Serialize a JSON object with the indentation and line endings of an existing JSON text.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function stringifyJsonLike(value: unknown, existingText: string): string
{
    const indentation = /^([ \t]+)\S/m.exec(existingText)?.[1] ?? 2;
    return withLineEndingsOf(`${JSON.stringify(value, null, indentation)}\n`, existingText);
}

/**
 * Append to a line-based file (e.g. `.gitignore`) the template entries it does not contain yet.
 * Comments and blank lines of the template are not copied, and `/dist`, `dist` and `dist/` count as the same entry.
 * @returns the merged text, or undefined when no entry is missing
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function appendMissingLines(existingText: string, templateText: string, header: string): string | undefined
{
    const normalize = (line: string): string => line.trim().replace(/^\/+/, '').replace(/\/+$/, '');
    const isEntry = (line: string): boolean => line.trim() !== '' && !line.trim().startsWith('#');
    const existingEntries = new Set(existingText.split(/\r?\n/).filter(isEntry).map(normalize));
    const missingLines = [...new Set(templateText.split(/\r?\n/).filter(isEntry).map((line) => line.trim()))]
        .filter((line) => !existingEntries.has(normalize(line)));

    if (missingLines.length === 0)
    {
        return undefined;
    }

    const separator = existingText.trim() === '' ? '' : (existingText.endsWith('\n') ? '\n' : '\n\n');
    return withLineEndingsOf(`${existingText}${separator}${header}\n${missingLines.join('\n')}\n`, existingText);
}

/**
 * Use CRLF line endings when the existing text does.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function withLineEndingsOf(text: string, existingText: string): string
{
    return existingText.includes('\r\n')
        ? text.replace(/\r?\n/g, '\r\n')
        : text;
}

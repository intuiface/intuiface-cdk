const validGeneratedName = /^[A-Za-z][A-Za-z0-9]*$/;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function validateGeneratedName(name: string): void
{
    if (!validGeneratedName.test(name))
    {
        throw new Error(`Invalid name '${name}'. Use alphanumeric characters only and start with a letter.`);
    }
}

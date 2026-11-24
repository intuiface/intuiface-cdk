import { Converter, Parameter } from '@intuiface/core';

/**
 * Binding converter fixture: several converters in one class, with one and two parameters
 * and different return types. Only the first converter sets the category.
 */
export class TextConverters
{
    @Converter({
        displayName: 'Upper case',
        description: 'Convert a text to upper case.',
        category: 'Text',
        returnType: String
    })
    public static toUpper(
        @Parameter({
            name: 'input',
            displayName: 'Input',
            type: String
        }) input: string
    ): string
    {
        return input?.toUpperCase() ?? '';
    }

    @Converter({
        displayName: 'Repeat',
        description: 'Repeat a text.',
        returnType: String
    })
    public static repeat(
        @Parameter({
            name: 'input',
            displayName: 'Input',
            type: String
        }) input: string,
        @Parameter({
            name: 'count',
            displayName: 'Count',
            defaultValue: 2,
            type: Number
        }) count: number
    ): string
    {
        return (input ?? '').repeat(count);
    }

    @Converter({
        displayName: 'Text length',
        returnType: Number
    })
    public static textLength(
        @Parameter({
            name: 'input',
            displayName: 'Input',
            type: String
        }) input: string
    ): number
    {
        return input?.length ?? 0;
    }
}

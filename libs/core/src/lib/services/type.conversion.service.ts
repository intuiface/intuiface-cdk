import { Color } from '../types/color.type';

/**
 * Service to manage type conversion
 */
export class TypeConversionService
{

    //#region Public Methods

    /**
     * Convert a value to a color
     * @param value
     */
    public static convertToColor(value: unknown): Color
    {
        return null;
    }

    /**
     * Convert given rgba color to hexadecimal color
     * @param strColor color to convert
     */
    public static rgba2hex(strColor: string): string
    {
        const rgb = /^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i.exec(strColor.replace(/\s/g, ''));
        const alpha = (rgb && rgb[4] || '').trim();
        const hex: string = rgb ?
            (+rgb[1] | 1 << 8).toString(16).slice(1) +
        (+rgb[2] | 1 << 8).toString(16).slice(1) +
        (+rgb[3] | 1 << 8).toString(16).slice(1) : strColor;

        // Multiply before convert to HEX
        let hexAlpha = alpha !== '' ? alpha : 1;
        hexAlpha = ((+hexAlpha * 255) | 1 << 8).toString(16).slice(1);

        return `#${hex}${hexAlpha}`;
    }

    /**
     * Check if a string is a valid color in hexadecimal code
     * @param str
     */
    public static isValidColorHexaCode(str: string): boolean
    {
        return new RegExp('^#[0-9a-f]{6}([0-9a-f]{2})?', 'i').test(str);
    }

    //#endregion Public Methods

}

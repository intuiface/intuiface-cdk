import { IntuifaceElement } from '../elements/element';
import { Color } from '../types/color.type';
import { LinearGradient } from '../types/linear-gradient.type';
import { RadialGradient } from '../types/radial-gradient.type';
import { SolidColor } from '../types/solid-color.type';
import { Time } from '../types/time.type';

/**
 * Service to manage type conversion
 */
export class TypeConversionService
{

    //#region Public Methods

    /**
     * Convert a value from a specific type to another type
     * @param value
     * @param type
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static convert(value: any, type: any, propertyOwner?: any): any
    {
        if (type)
        {
            if (value && value.convertTo && value.canConvertTo(type))
            {
                // convert to type
                return value.convertTo(type);
            }
            else if (type.convertFrom && type.canConvertFrom(value))
            {
                // convert from type
                return type.convertFrom(value, propertyOwner);
            }
            else
            {
                // convert primitive type
                switch (type)
                {
                    case Number:
                        return this.convertToNumber(value);
                    case Boolean:
                        return this.convertToBoolean(value);
                    case Date:
                        return this.convertToDate(value);
                    case String:
                        if (value != null)
                        {
                            if (value && value.getTime)
                            {
                                return (value as Date).toISOString();
                            }
                            return value.toString();
                        }
                        else
                        {
                            return '';
                        }
                }
            }
        }
        return value;
    }

    /**
     * Get type of a value
     * @param value
     * @returns
     */
    public static getType(value: any): any
    {
        const type = typeof value;
        switch (type)
        {
            case 'string':
                return String;
            case 'number':
                return Number;
            case 'boolean':
                return Boolean;
            case 'object':
            {
                if (value && value.getTime)
                {
                    return Date;
                }
                else if (value && value.totalSeconds != null)
                {
                    return Time;
                }
                else if (value instanceof Color)
                {
                    return Color;
                }
                // excel case
                else if (value && value.getType)
                {
                    return value.getType();
                }
                else if (value instanceof IntuifaceElement)
                {
                    return IntuifaceElement;
                }
                return String;
            }
            default:
                return String;
        }
    }

    /**
     * Check if the color can be converted to a type
     * @param type
     */
    public static canConvertColorTo(type: unknown): boolean
    {
        return type === String ||
                        type === Color || type === SolidColor || type === LinearGradient || type === RadialGradient;
    }

    /**
     * Check if we can convert a value to a color
     * @param value
     */
    public static canConvertColorFrom(value: unknown): boolean
    {
        return SolidColor.canConvertFrom(value)
                        || LinearGradient.canConvertFrom(value) || RadialGradient.canConvertFrom(value);
    }

    /**
     * Convert a value to a color
     * @param value
     */
    public static convertToColor(value: unknown): Color
    {
        if (SolidColor.canConvertFrom(value))
        {
            return SolidColor.convertFrom(value);
        }
        else if (LinearGradient.canConvertFrom(value))
        {
            return LinearGradient.convertFrom(value);
        }
        else if (RadialGradient.canConvertFrom(value))
        {
            return RadialGradient.convertFrom(value);
        }
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

    //#region Private Methods

    /**
     * Function to convert a value to a boolean
     * @param value
     */
    private static convertToBoolean(value: any): boolean
    {
        switch (typeof (value))
        {
            case 'string':
                return this.convertStringToBoolean(value);
            case 'number':
                return Boolean(value);
        }
        return value;
    }

    /**
     * Function to convert a value to a number
     * @param value
     */
    private static convertToNumber(value: any): number
    {
        switch (typeof (value))
        {
            case 'string':
                return parseFloat(value);
            case 'boolean':
                return value === true ? 1 : 0;
            case 'object':
            {
                if (value && value.getTime)
                {
                    return (value as Date).getTime();
                }
            }
        }
        return value;
    }

    /**
     * Function to convert a value to a date
     * @param value
     */
    private static convertToDate(value: any): Date
    {
        switch (typeof (value))
        {
            case 'string':
                return new Date(value.toString());
            case 'number':
                return new Date(value);
        }
        return value;
    }

    /**
     * Convert a string to a boolean
     * @param value
     */
    private static convertStringToBoolean(value: string): boolean
    {
        value = value.toLowerCase();
        if (value === 'false')
        {
            return false;
        }
        return true;
    }

    //#endregion Private Methods

}

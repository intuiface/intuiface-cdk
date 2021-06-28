import { IConvertibleType } from './convertible.type';

/**
 * Color type
 */
export class Color implements IConvertibleType{

    /**
     * Constructor
     */
    public constructor(public alpha: string, public red: string, public green: string, public blue: string)
    {
    }

    /**
     * Convert a color to string
     */
    public toString(): string
    {
        return `#${this.red}${this.green}${this.blue}${this.alpha}`;
    }

    /**
     * Check if the type can be converted
     * @param type
     */
    public canConvertTo(type: unknown): boolean
    {
        return type === String || type === Color;
    }

    /**
     * Function to convert a Color to another type
     * @param type
     */
    public convertTo(type: unknown): unknown
    {
        switch (type)
        {
            case String:
                return this.toString();
        }
        return this;
    }

    /**
     * Convert a value to a color
     * @param value
     */
    public static convertFrom(value: unknown): Color
    {
        let alpha = 'FF';
        let red = 'FF';
        let green = 'FF';
        let blue = 'FF';
        if (value && typeof (value) == 'string' && value.startsWith('#'))
        {
            switch (value.length)
            {
                case 9:
                {
                    // convert string color to rgba
                    red = value.substring(1, 3);
                    green = value.substring(3, 5);
                    blue = value.substring(5, 7);
                    alpha = value.substring(7, 9);
                    break;
                }
                case 7:
                {
                    red = value.substring(1, 3);
                    green = value.substring(3, 5);
                    blue = value.substring(5, 7);
                    break;
                }
                case 4:
                {
                    red = value.substring(1, 2) + value.substring(1, 2);
                    green = value.substring(2, 3) + value.substring(2, 3);
                    blue = value.substring(3, 4) + value.substring(3, 4);
                    break;
                }
            }
        }
        return new Color(alpha, red, green, blue);
    }

    /**
     * Check if we can convert value to Color
     * @param value
     */
    public static canConvertFrom(value: unknown): boolean
    {
        return value && typeof (value) == 'string' && value.startsWith('#');
    }

}

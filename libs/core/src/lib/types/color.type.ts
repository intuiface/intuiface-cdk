import { IConvertibleType } from './convertible.type';

/**
 * Color type
 */
export class Color implements IConvertibleType{

    public static readonly Black = Color.convertFrom('#000000ff');
    public static readonly TransparentBlack = Color.convertFrom('#00000000');

    public static readonly InputTextBackground = Color.convertFrom('#bababaff');
    public static readonly InputTextOutline = Color.convertFrom('#c6c7c8ff');

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
        // Use rgba format instead of # for old browsers
        const r = parseInt(this.red, 16);
        const g = parseInt(this.green, 16);
        const b = parseInt(this.blue, 16);
        const a = parseInt(this.alpha, 16) / 255;

        return `rgba(${r}, ${g}, ${b}, ${a})`;
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
        if (value && typeof (value) == 'string' && value.startsWith('rgba')) {
            value = this.rgba2hex(value);
        }
        let alpha = 'FF';
        let red = 'FF';
        let green = 'FF';
        let blue = 'FF';
        if (value && typeof (value) == 'string' && value.startsWith('#')) {
            switch (value.length) {
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
        return value && typeof (value) == 'string' && (value.startsWith('#') || value.startsWith('rgb'));
    }

    /**
     * Convert given rgba color to hexadecimal color.
     * @param color color to converts
     */
    public static rgba2hex(color: string): string {
        const rgb = /^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i.exec(color.replace(/\s/g, ''));
        const alpha = (rgb && rgb[4] || '').trim();
        const hex: string = rgb ?
            (+rgb[1] | 1 << 8).toString(16).slice(1) +
            (+rgb[2] | 1 << 8).toString(16).slice(1) +
            (+rgb[3] | 1 << 8).toString(16).slice(1) : color;

        // Multiply before convert to HEX
        let hexAlpha = alpha !== '' ? alpha : 1;
        hexAlpha = ((+hexAlpha * 255) | 1 << 8).toString(16).slice(1);

        return `#${hex}${hexAlpha}`;
    }

}

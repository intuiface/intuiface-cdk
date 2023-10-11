import { TypeConversionService } from '../services/type.conversion.service';
import { Color } from './color.type';

/**
 * Color format enum
 */
export enum EColorFormat {
    HexRGBA = 'HexRGBA',
    HexARGB = 'HexARGB',
    HexRGB = 'HexRGB',
    RGBA = 'RGBA'
}

/**
 * Solid color type
 */
export class SolidColor extends Color
{
    public static readonly Black = SolidColor.convertFrom('#ff000000');
    public static readonly DarkTransparentBlack = SolidColor.convertFrom('#80000000');
    public static readonly SemiTransparentBlack = SolidColor.convertFrom('#33000000');
    public static readonly LightTransparentBlack = SolidColor.convertFrom('#20000000');
    public static readonly TransparentBlack = SolidColor.convertFrom('#00000000');
    public static readonly SkyBlue = SolidColor.convertFrom('#ff83d3f6');
    public static readonly InputTextBackground = SolidColor.convertFrom('#ffbababa');
    public static readonly InputTextOutline = SolidColor.convertFrom('#ffc6c7c8');
    public static readonly DefaultBlackFont = SolidColor.convertFrom('#ff262626');

    /**
     * Constructor
     */
    public constructor(alpha: string, public red: string, public green: string, public blue: string,
                       public format: EColorFormat = EColorFormat.HexARGB)
    {
        super();
        this.alpha = alpha;
    }

    /**
     * Convert a solid color to a string
     */
    public override toString(): string
    {
        // Use rgba format instead of # for old browsers
        const r = parseInt(this.red, 16);
        const g = parseInt(this.green, 16);
        const b = parseInt(this.blue, 16);
        const a = +(parseInt(this.alpha, 16) / 255).toFixed(2);

        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * Is the color a gradient?
     */
    public override isGradient(): boolean
    {
        return false;
    }

    /**
     * Function equals for the color type
     * @param color color to compare
     */
    public override equals(color: SolidColor): boolean
    {
        return this.red === color.red
        && this.green === color.green
        && this.blue === color.blue
        && this.alpha === color.alpha;
    }

    /**
     * Function to convert a color to another type
     * @param type
     */
    public override convertTo(type: unknown): unknown
    {
        switch (type)
        {
            case String:
                switch (this.format)
                {
                    case EColorFormat.HexRGB:
                        return `#${this.red}${this.green}${this.blue}`;

                    case EColorFormat.RGBA:
                        return this.toString();

                    default:
                        return `#${this.alpha}${this.red}${this.green}${this.blue}`;
                }
        }
        return this;
    }

    /**
     * Check if we can convert a value to a solid color
     * @param value
     */
    public static override canConvertFrom(value: unknown): boolean
    {
        if (value instanceof Object)
        {
            const obj = value as any;
            if (obj.alpha && obj.red && obj.green && obj.blue)
            {
                return true;
            }
        }
        return value && (typeof (value) == 'string' || value instanceof SolidColor);
    }

    /**
     * Convert a value to a solid color
     * @param value
     */
    public static override convertFrom(value: unknown, format?: EColorFormat): SolidColor
    {
        if (value instanceof SolidColor)
        {
            // No need to convert
            return value;
        }

        // The value is an instance of object so we have to check its properties
        if (value instanceof Object)
        {
            const obj = value as any;
            if (obj.alpha && obj.red && obj.green && obj.blue)
            {
                return new SolidColor(obj.alpha, obj.red, obj.green, obj.blue);
            }
        }

        // Default format for colors that start with "#"
        if (!format && value && typeof (value) == 'string' && value.startsWith('#') && value.length === 9)
        {
            format = EColorFormat.HexARGB;
        }

        // Convert argb hex format to rgba hex format
        if (value && typeof (value) == 'string' && format === EColorFormat.HexARGB)
        {
            const alpha: string = value.substring(1, 3);
            value = `#${value.substring(3, 9)}${alpha}`;
        }

        // Convert rgba to hex
        if (value && typeof (value) == 'string' && value.startsWith('rgba'))
        {
            value = TypeConversionService.rgba2hex(value);
            format = EColorFormat.RGBA;
        }

        // Extract color properties
        if (value && typeof (value) == 'string' && value.startsWith('#'))
        {
            value = value.substring(1);
        }
        let alpha = 'FF';
        let red = 'FF';
        let green = 'FF';
        let blue = 'FF';
        if (value && typeof (value) == 'string')
        {
            switch (value.length)
            {
                case 8:
                {
                    // convert string color to rgba
                    red = value.substring(0, 2);
                    green = value.substring(2, 4);
                    blue = value.substring(4, 6);
                    alpha = value.substring(6, 8);
                    break;
                }
                case 6:
                {
                    red = value.substring(0, 2);
                    green = value.substring(2, 4);
                    blue = value.substring(4, 6);
                    format = EColorFormat.HexRGB;
                    break;
                }
                case 3:
                {
                    red = value.substring(0, 1) + value.substring(0, 1);
                    green = value.substring(1, 2) + value.substring(1, 2);
                    blue = value.substring(2, 3) + value.substring(2, 3);
                    format = EColorFormat.HexRGB;
                    break;
                }
            }
        }
        return new SolidColor(alpha, red, green, blue, format);
    }
}

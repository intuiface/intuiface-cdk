import { IConvertibleType } from './convertible.type';


/**
 * Interface of font.
 */
export interface Typeface
{
    family: string;
    stretch: string;
    weight: string;
    style: string;
}

/**
 * Font type
 */
export class Font implements Typeface, IConvertibleType
{
    /**
     * Constructor
     */
    public constructor(public family: string, public stretch: string, public weight: string, public style: string) { }

    /**
     * Check if the type can be converted
     * @param type
     */
    public canConvertTo(type: unknown): boolean
    {
        return type === String || type === Font;
    }

    /**
     * Function to convert a Font to another type
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
     * Convert the font to string
     */
    public toString(): string
    {
        return `${this.family} ${this.stretch} ${this.style} ${this.weight}`;
    }

    /**
     * Convert a value to a font
     * @param value
     */
    public static convertFrom(value: any): Font
    {
        const family = value.family;
        const stretch = value.stretch;
        const style = value.style;
        const weight = value.weight;
        return new Font(family, stretch, weight, style);
    }

    /**
     * Check if we can convert value to Font
     * @param value
     */
    public static canConvertFrom(value: any): boolean
    {
        return value && (value.family && value.stretch && value.style && value.weight);
    }
}

import { IConvertibleType } from './convertible.type';


/**
 * Interface of font.
 *
 * @group Types
 */
export interface Typeface
{
    /**
     * Family of the font.
     * @example 'arial'
     */
    family: string;

    /**
     * Stretch of the font.
     * @example 'narrow'
     */
    stretch: string;
    /**
     * Weight of the font.
     * @example 'bold'
     */
    weight: string;
    /**
     * Style of the font.
     * @example 'italic'
     */
    style: string;
}

/**
 * Class to use as type of property using font.
 *
 * @example ```ts
 * @Property({
 *     displayName: 'Title font',
 *     description: 'Font of the title.',
 *     defaultValue: null,
 *     type: Font
 * })
 * public titleFont: Typeface;
 * ```
 * Note: We use the `Font` class as `type`, but the generic interface `Typeface` is used as type of the `titleFont` field.
 *
 * @group Types
 */
export class Font implements Typeface, IConvertibleType
{
    /**
     * Constructor
     *
     * @param family Family of the font
     * @param stretch Strecth of the font
     * @param weight Weight of the font
     * @param style Style of the font
     *
     * @example new Font('Arial', 'normal', 'normal', 'normal');
     * @example new Font('Arial', 'narrow', 'bold', 'italic');
     *
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

import { TypeConversionService } from '../services/type.conversion.service';
import { IConvertibleType } from './convertible.type';

/**
 * Color type
 */
export abstract class Color implements IConvertibleType
{
    public alpha: string = 'FF';

    /**
     * Color to string method
     */
    public abstract toString(): string;

    /**
     * Function equals for the color type
     * @param color color to compare
     */
    public abstract equals(color: Color): boolean;

    /**
     * Is the color a gradient?
     */
    public abstract isGradient(): boolean;

    /**
     * Check if the color can be converted to a type
     * @param type
     */
    public canConvertTo(type: unknown): boolean
    {
        return TypeConversionService.canConvertColorTo(type);
    }

    /**
     * Function to convert a color to another type
     * @param type
     */
    public convertTo(type: unknown): unknown
    {
        switch (type)
        {
            case Color:
                return TypeConversionService.convertToColor(this);
            case String:
                return this.toString();
        }
        return this;
    }

    /**
     * Check if we can convert a value to a color
     * @param value
     */
    public static canConvertFrom(value: unknown): boolean
    {
        return TypeConversionService.canConvertColorFrom(value);
    }

    /**
     * Convert a value to a color
     * @param value
     */
    public static convertFrom(value: unknown): Color
    {
        return TypeConversionService.convertToColor(value);
    }
}

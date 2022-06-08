import { IConvertibleType } from './convertible.type';

/**
 * Path type
 */
export class Path implements IConvertibleType {
    public url: URL;

    public constructor(value: string)
    {
        this.url = new URL(value, 'https://intuiface-cdk.com');
    }

    /**
     * Transform url to string
     */
    public toString(): string
    {
        return this.url.toString();
    }

    /**
     * Check if the type can be converted
     * @param type
     */
    public canConvertTo(type: unknown): boolean
    {
        return type === String || type === Path;
    }

    /**
     * Function to convert a Path to another type
     * @param type
     */
    public convertTo(type: unknown): unknown
    {
        switch (type)
        {
            case String:
                return this.url.toString();
        }
        return this;
    }

    /**
     * Convert a value to a Path
     * @param value
     */
    public static convertFrom(value: string): Path
    {
        return new Path(value);
    }

    /**
     * Check if we can convert value to Path
     * @param value
     */
    public static canConvertFrom(value: string): boolean
    {
        return typeof(value) == 'string';
    }
}

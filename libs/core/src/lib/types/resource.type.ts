import { IConvertibleType } from './convertible.type';

/**
 * Class to use when a property is using a resource from an experience.
 *
 * @example ```ts
 * @Property({
 *     displayName: 'Source',
 *     description: 'Source of the data.',
 *     defaultValue: null,
 *     type: Resource
 * })
 * public source: Resource;
 * ```
 *
 * @group Types
 */
export class Resource implements IConvertibleType
{
    //#region Fields

    public url: URL;

    //#endregion Fields

    //#region Life Cycle

    public constructor(private _value: string, private _propertyOwner: any)
    {
        this.url = new URL(_value);
    }

    //#endregion Life Cycle

    //#region Operations

    /**
     * Transform resource to string
     */
    public toString(): string
    {
        return this.url.toString();
    }

    /**
     * Check if the type can be converted
     * @param type targeted type
     */
    public canConvertTo(type: unknown): boolean
    {
        return type === String || type === Resource;
    }

    /**
     * Function to convert a Resource to another type
     * @param type targeted type
     */
    public convertTo(type: unknown): unknown
    {
        if (type === String)
        {
            return this.toString();
        }
        return this;
    }

    //#endregion Operations

    //#region Static Operations

    /**
     * Convert a value to a Resource
     * @param value value to convert
     */
    public static convertFrom(value: string, propertyOwner?: any): Resource
    {
        return new Resource(value, propertyOwner);
    }

    /**
     * Check if we can convert value to Resource
     * @param value value to convert
     */
    public static canConvertFrom(value: string): boolean
    {
        return typeof(value) == 'string';
    }

    //#endregion Static Operations

}

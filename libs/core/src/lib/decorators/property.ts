/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTypeAndFormat } from '../types/convertible.type';

/**
 * Options when use property decorator.
 */
export interface IPropertyOptions
{
    /**
     * Name displayed in Composer.
     */
    displayName: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;

    /**
     * Default value of the property.
     */
    defaultValue?: any;

    /**
     * Minimum value for this property.
     */
    minValue?: number;

    /**
     * Maximum value for this property.
     */
    maxValue?: number;

    /**
     * True if property is read only.
     */
    readOnly?: boolean;

    /**
     * The type of the property
     */
    type?: any;

    /**
     * The item type in case the type is array
     */
    itemType?: any;
}

/**
 * Property decorator to add metadatas to property.
 * @param options options of the property (display name, description, ...)
 */
export function Property(options?: IPropertyOptions)
{
    return (target: any, propertyKey: string): void =>
    {        
        // get target name
        const targetName = target.constructor.name;

        // get type and format to store in ifd
        const typeAndFormat = getTypeAndFormat(options.type);

        if (!globalThis.intuiface_ifd_properties[targetName]) {
            globalThis.intuiface_ifd_properties[targetName] = {};
        }

        // store values 
        globalThis.intuiface_ifd_properties[targetName][propertyKey] = {
            type: typeAndFormat.type,
            title: options.displayName,
            description: options.description,
            default: options.defaultValue,
            readonly: options.readOnly
        }

        // special case for array
        if(typeAndFormat.type === "array" && options.itemType)
        {
            // store the item type
            globalThis.intuiface_ifd_properties[targetName][propertyKey]["items"] = {
                $ref: options.itemType.name
            }
            // force array to be readOnly and delete default value
            globalThis.intuiface_ifd_properties[targetName][propertyKey].readonly = true;
            delete globalThis.intuiface_ifd_properties[targetName][propertyKey].default;
        }

        // add format if it's defined
        if (typeAndFormat.format) {
            globalThis.intuiface_ifd_properties[targetName][propertyKey].format = typeAndFormat.format;
        }
    };
}

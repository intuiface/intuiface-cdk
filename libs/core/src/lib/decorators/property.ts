/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
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
}

/**
 * Property decorator to add metadatas to property.
 * @param options options of the property (display name, description, ...)
 */
export function Property(options?: IPropertyOptions)
{
    return (target: any, propertyKey: string): void =>
    {        
        const typeAndFormat = getTypeAndFormat(options.type);
        globalThis.intuiface_ifd_properties[propertyKey] = {
            type: typeAndFormat.type,
            description: options.description,
            default: options.defaultValue,
            readonly: options.readOnly
        }

        if (typeAndFormat.format) {
            globalThis.intuiface_ifd_properties[propertyKey].format = typeAndFormat.format;
        }
    };
}

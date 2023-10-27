/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Color } from './color.type';
import { Path } from './path.type';

/**
 * Get type and format from a specific type to write the ifd
 * @param type
 * @returns
 */
export function getTypeAndFormat(type, defaultsToString = true) {
    const typeAndFormat = { type: 'string', format: null };
    switch (type) {
        case Number:
            typeAndFormat.type = 'number';
            break;
        case String:
            typeAndFormat.type = 'string';
            break;
        case Date:
            typeAndFormat.type = 'string';
            typeAndFormat.format = 'date';
            break;
        case Path:
            typeAndFormat.type = 'string';
            typeAndFormat.format = 'uri';
            break;
        case Color:
            typeAndFormat.type = 'string';
            typeAndFormat.format = 'color';
            break;
        case Boolean:
            typeAndFormat.type = 'boolean';
            break;
        case Object:
            typeAndFormat.type = 'object';
            break;
        case Array:
            typeAndFormat.type = 'array';
            break;
        default:
            if (!defaultsToString)
            {
                return null;
            }
            break;
    }
    return typeAndFormat;
}

/**
 * Type can be convertible by impletmenting this interface. A convertible type can be used as `type` of a {@link Property | `@Property`} or {@link Parameter | `@arameter`} decorators. All value will then be converted in input/output when the property or parameter is used for example by bindings.
 *
 * @group Types
 */
export interface IConvertibleType{

    /**
     * Transform a type to a string
     * @param value
     */
    toString(): string;

    /**
     *  Convert a value to type
     */
    convertTo(type: unknown): unknown;

    /**
     * Check if the type can be converted to another type
     * @param type
     */
    canConvertTo(type: unknown): boolean;
}


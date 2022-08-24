/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Color } from './color.type';
import { Path } from './path.type';

/**
 * Get type and format from a specific type to write the ifd
 * @param type
 * @returns
 */
export function getTypeAndFormat(type) {
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
    }
    return typeAndFormat;
}

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


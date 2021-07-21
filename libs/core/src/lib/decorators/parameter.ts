/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTypeAndFormat } from '../types/convertible.type';

/**
 * Options when use parameter decorator.
 */
export interface IParameterOptions
{
    /**
     * The name of the parameter
     */
    name: string;

    /**
     * Name displayed in Composer.
     */
    displayName: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;

    /**
     * Default value of the parameter.
     */
    defaultValue?: any;

    /**
     * Minimum value for this parameter.
     */
    minValue?: number;

    /**
     * Maximum value for this parameter.
     */
    maxValue?: number;

    /**
     * The type of the parameter
     */
    type?: any;
}

/**
 * Parameter decorator to add metadatas to parameter.
 * @param options options of the parameter (display name, description, ...)
 */
export function Parameter(options?: IParameterOptions): Function
{
    return (
        target: any,
        propertyKey: string | symbol,
        parameterIndex: number
    ): void =>
    {
        // get target name
        let targetName = target.constructor.name;

        if (!globalThis.intuiface_ifd_params[targetName]) {
            globalThis.intuiface_ifd_params[targetName] = {};
        }

        // create the object if it doesn't exist
        if (!globalThis.intuiface_ifd_params[targetName][propertyKey])
        {
            globalThis.intuiface_ifd_params[targetName][propertyKey] = {};
        }

        // get type and format to store in ifd
        const typeAndFormat = getTypeAndFormat(options.type);

        // store datas 
        globalThis.intuiface_ifd_params[targetName][propertyKey][options.name] = {
            type: typeAndFormat.type,
            title: options.displayName
        };

        // add the format if defined
        if(typeAndFormat.format)
        {
            globalThis.intuiface_ifd_params[targetName][propertyKey][options.name].format = typeAndFormat.format;
        }

    };
}

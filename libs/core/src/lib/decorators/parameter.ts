/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { getTypeAndFormat } from '../types/convertible.type';

/**
 * Options to configure {@link Parameter | `@Parameter`} decorator.
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
     * The type of the parameter.
     * It's optional but higly recommended fo better binding conversion.
     * It can be:
     * - `String`
     * - `Number`
     * - `Boolean`
     * - `Array`
     * - Classe name of a {@link IConvertibleType | convertible type} (`Color`, `Font`, `Path`, `Resource`, `Time`)
     * - Enum type
     */
    type?: any;
}

/**
 * The `@Parameter` decorator enables you to declare an action's parameter or a trigger's parameter.
 *
 * @param options options of the parameter (display name, description, ...)
 *
 * @example An action with paramters:
 * ```ts
 * /**
 *  * Action to set the volume of the media.
 *  *\/
 * @Action({
 *     displayName: 'Set volume', // the display name of the action
 *     description: 'Set the volume.', // the description of the action
 *     validate: true // boolean for parameter validation
 * })
 * public setVolume(
 *     @Parameter({ // declaration of the parameter
 *         name: 'volume', // the name of the parameter (has to match the parameter)
 *         displayName: 'Volume', // the display name of the parameter
 *         description: 'Desired volume of the media', // the description of the parameter
 *         defaultValue: 1, // the default value of the parameter
 *         minValue: 0, // the minimum value of the parameter
 *         maxValue: 1, // the maximum value of the parameter
 *         type: Number // the type of the parameter
 *     })volume: number): void // the declaration of the parameter to use (same name)
 * {
 *     this.volume = volume; // the code of the action
 * }
 *
 * ```
 *
 * @example A trigger with paramters
 * ```ts
 * /**
 *  * Count changes event
 *  *\/
 * @Trigger({
 *     name: 'countChanged',
 *     displayName: 'Count changes'
 * })
 * public countChanged(
 *     @Parameter({
 *         name: 'count', // the name of the parameter (has to match the parameter)
 *         displayName: 'count', // the display name of the parameter
 *         description: 'New count value', // the description of the parameter
 *         type: Number // the type of the parameter
 *     }) count: number): void { } //the parameter
 * ```
 *
 * @group Decorators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Parameter(options?: IParameterOptions): Function
{
    return (
        target: any,
        propertyKey: string | symbol,
        parameterIndex: number
    ): void =>
    {
        // get target name
        const targetName = target.constructor.name;

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
            title: options.displayName,
            description: options.description ?? options.displayName
        };

        // add the format if defined
        if (typeAndFormat.format)
        {
            globalThis.intuiface_ifd_params[targetName][propertyKey][options.name].format = typeAndFormat.format;
        }

        // add default value for parameter if defined
        if (options.defaultValue !== undefined)
        {
            globalThis.intuiface_ifd_params[targetName][propertyKey][options.name].default = options.defaultValue;
        }

    };
}

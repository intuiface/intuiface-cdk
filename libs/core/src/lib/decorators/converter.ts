/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { IActionOptions } from './action';
/**
 * Options to configure {@link Converter | `@Converter`} decorator.
 */
export interface IConverterOptions extends IActionOptions
{
    /**
     * The return type of the converter.
     * If the converter returns a promise, the type of the resolved value should be specified.
     * e.g `Promise<String>` should be specified as `String`.
     */
    returnType: any;
}

/**
 * The `@Converter` decorator enables you to declare a binding converter method that can be packaged as an external Intuiface asset.
 *
 * Contrary to `@Asset`, this decorator is meant for static methods used by bindings and will automatically register the enclosing class in the generated `.ifd`.
 *
 * @example ```ts
 * export class UppercaseBC
 * {
 *     @Converter({
 *         displayName: 'Uppercase', // display name of the converter
 *         description: 'Convert text to uppercase.', // description of the converter
 *         returnType: String, // return type of the converter 
 *         validate: true // boolean for parameter validation
 *     })
 *     public static computeOutput(
 *         @Parameter({
 *             name: 'input',
 *             displayName: 'Input',
 *             type: String
 *         }) input: string
 *     ): string
 *     {
 *         return input?.toUpperCase() ?? '';
 *     }
 * }
 * ```
 *
 * @group Decorators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Converter(options?: IConverterOptions)
{
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void =>
    {
        const targetName = typeof target === 'function'
            ? target.name
            : target.constructor.name;

        if (globalThis.intuiface_ifd_classes.indexOf(targetName) === -1)
        {
            globalThis.intuiface_ifd_classes.push(targetName);
        }

        if (!globalThis.intuiface_ifd_properties[targetName])
        {
            globalThis.intuiface_ifd_properties[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_params[targetName])
        {
            globalThis.intuiface_ifd_params[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_actions[targetName])
        {
            globalThis.intuiface_ifd_actions[targetName] = {};
        }

        let returnType = options?.returnType;
        returnType = returnType?.name.toString().toLowerCase() ?? 'string';

        const parameters = globalThis.intuiface_ifd_params[targetName][propertyKey] ?? {};
        const converterDefinition: Record<string, unknown> = {
            'id': `${targetName}.${propertyKey.toString()}`,
            'if.converter': true,
            'title': options?.displayName ?? propertyKey.toString(),
            'description': options?.description,
            'path': propertyKey,
            parameters,
            'response':{
                $ref: returnType,
            }
        };
        globalThis.intuiface_ifd_actions[targetName][propertyKey] = converterDefinition;
    };
}

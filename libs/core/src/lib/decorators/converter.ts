/* eslint-disable prefer-arrow/prefer-arrow-functions */
import 'reflect-metadata';
import { IActionOptions } from './action';
/**
 * Options to configure {@link Converter | `@Converter`} decorator.
 */
export interface IConverterOptions extends IActionOptions
{
    /**
     * Name of the converter (if any different) in old ifx.
     */
    oldName?: string;

    /**
     * Name of the descriptor (ifd file) in old ifx.
     */
    oldDescriptorName?: string;
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
 *         oldName: 'Uppercase',
 *         oldDescriptorName: 'TextConverters',
 *         displayName: 'Uppercase',
 *         description: 'Convert text to uppercase.',
 *         validate: true
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

        let returnType = Reflect.getMetadata('design:returntype', target, propertyKey);
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

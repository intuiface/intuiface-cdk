/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';

/**
 * Options when use action decorator.
 */
export interface IActionOptions
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
     * If true, validate range of parameter values.
     */
    validate?: boolean;
}

/**
 * Action decorator to add metadatas to action.
 * @param options options of the action (display name, description, ...)
 */
export function Action(options?: IActionOptions)
{
    return (
        target: unknown,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void =>
    {
        let parameters = {};
        if (globalThis.intuiface_ifd_params[propertyKey])
        {
            parameters = globalThis.intuiface_ifd_params[propertyKey];
        }
        globalThis.intuiface_ifd_actions[propertyKey] = {
            id: globalThis.intuiface_ifd_name + '.' + propertyKey.toString(),
            path: propertyKey,
            description: options.description,
            parameters: parameters
        }
    };
}

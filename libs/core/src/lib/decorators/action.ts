/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function Action(options?: IActionOptions)
{
    return (
        target: unknown,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void =>
    {
        // get target name
        const targetName = target.constructor.name;
        let parameters = {};
        // check if some parameters are defined
        if (globalThis.intuiface_ifd_params[targetName] && globalThis.intuiface_ifd_params[targetName][propertyKey])
        {
            // get them
            parameters = globalThis.intuiface_ifd_params[targetName][propertyKey];
        }

        if (!globalThis.intuiface_ifd_actions[targetName])
        {
            globalThis.intuiface_ifd_actions[targetName] = {};
        }

        // store all informations in object
        globalThis.intuiface_ifd_actions[targetName][propertyKey] = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            id: `${globalThis.intuiface_ifd_name}.${propertyKey.toString()}`,
            path: propertyKey,
            title: options.displayName,
            description: options.description,
            parameters: parameters
        };
    };
}

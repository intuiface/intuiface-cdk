/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Options to configure {@link Action | `@Action`} decorator
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

    /**
     * Indicates the name of the category in which the action will be located in the Composer’s “Action category”
     */
    category?: string;
}

/**
 * The `@Action` decorator enables you to declare an Action that can be used by Triggers in Intuiface Composer
 *
 * @example ```ts
 * /**
 *  * Turn on autoplay.
 *  *\/
 *  @Action({
 *   displayName: 'Turn Autoplay mode on', // display name of the action
 *   description: 'Turn Autoplay mode on.' // description of the action
 *  })
 * public turnOnAutoplay(): void
 * {
 *    this.isAutoplay = true; // code of the action
 * }
 * ```
 * _**Note**_: the name "turnOnAutoplay" is in camelCase as the naming convention. It is important to do the same in your actions declaration.
 *
 * @example If your action has parameter(s), you can specify them with `@Parameter` decorator:
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
 * ```
 *
 * Please read the section {@link Parameter | `@Parameter`}  for more information.
 * @param options Options to configure the Action (Display name, description...)
 *
 * @group Decorators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Action(options?: IActionOptions)
{
    /**
     * @ignore
     */
    return (
        /**
         * @ignore
         */
        target: unknown,
        /**
         * @ignore
         */
        propertyKey: string | symbol,
        /**
         * @ignore
         */
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
        const actionDefinition: Record<string, unknown> = {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            id: `${globalThis.intuiface_ifd_name}.${propertyKey.toString()}`,
            path: propertyKey,
            title: options.displayName,
            description: options.description,
            parameters: parameters
        };
        if (options?.category)
        {
            actionDefinition['if.category'] = options.category;
        }

        globalThis.intuiface_ifd_actions[targetName][propertyKey] = actionDefinition;
    };
}

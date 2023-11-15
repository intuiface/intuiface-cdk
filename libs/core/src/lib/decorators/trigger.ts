/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Options to configure {@link Trigger | `@Trigger`} decorator.
 */
export interface ITriggerOptions
{
    /**
     * Name used for serialization and identification
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
     * Indicates the mode of propagation:
     * - `none`: No propagation.
     * - `standard`: Trigger will propagate through the experience tree of assets and collections until reaching root or leaf.
     * - `untilUsed`: Same as `standard` but propagation will be stopped when an action is triggered.
     * - `once`: propagate only one time, which means the trigger will reach either parent or children depending of the `propagationDirection`.
     *
     * @default 'none'
     */
    propagationMode?: 'none' | 'standard' | 'untilUsed' | 'once';

    /**
     * Indicates the direction of propagation:
     * - `bubbling`: trigger will be ascending the experience tree.
     * - `cascading`: trigger will propagate through collection's children.
     *
     * @default 'bubbling'
     */
    propagationDirection?: 'bubbling' | 'cascading';
}

/**
 * The `@Trigger` decorator enables you to declare a new trigger on your asset that can be used in an Intuiface experience.
 * @param options options of the trigger (display name, description, ...)
 *
 * @example ```ts
 * /**
 *  * Trigger when button is pressed
 *  *\/
 * @Trigger({
 *     name: 'Released', // name of the trigger
 *     displayName: 'Is released', // display name in composer
 *     description: 'Raised when the button is released.', // description of the trigger
 *     propagationMode: EPropagationMode.Standard, // this trigger will be propagating
 *     mode: ERoutingMode.BUBBLING // the propagation will bubble to parent elements
 * })
 * public raiseButtonReleased(): void { } // the trigger is an empty function
 * ```
 * _**Note**_: the name `raiseButtonReleased` is in camelCase as the naming convention
 *
 * @example If your trigger has parameter(s), you can specify them with `@Parameter` decorator, the same way you declare paramters for actions.
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
 * Please read the section {@link Parameter |`@Parameter`} for more information.
 *
 * @group Decorators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Trigger(options?: ITriggerOptions)
{
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void =>
    {
        // get the target name
        const targetName = target.constructor.name;
        let properties = {};

        if (!globalThis.intuiface_ifd_triggers[targetName]) {
            globalThis.intuiface_ifd_triggers[targetName] = {};
        }

        // if there are some parameters already stored
        if (globalThis.intuiface_ifd_params[targetName] && globalThis.intuiface_ifd_params[targetName][propertyKey]) {
            // get them to store in trigger
            properties = globalThis.intuiface_ifd_params[targetName][propertyKey];
        }
        // store trigger
        globalThis.intuiface_ifd_triggers[targetName][options.name] = {
            id: propertyKey,
            title: options.displayName,
            description: options.description,
            properties: properties
        };
    };
}

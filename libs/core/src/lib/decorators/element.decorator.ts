/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Options to configure `@Inject` decorator.
 */
export interface IInjectOptions
{
    /**
     * Behaviors to inject on the decorated element.
     *
     * Behaviors are not yet exposed in Intuiface CDK. For now, only pass a empty array `[]`.
     */
    behaviors: Function[];
}

/**
 * Options to configure {@link Asset | `@Asset`} decorator.
 */
export interface IElementOptions extends IInjectOptions
{
    /**
     * Name used for serialization and identification
     */
    name: string;

    /**
     * Name displayed in Composer.
     */
    displayName?: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;

    /**
    * Category in Composer's Interface Assets panel.
    */
    category: string;
}

/**
 * Options to configure {@link Collection | `@Collection`} decorator.
 *
 * @experimental
 */
export interface ICollectionOptions extends IInjectOptions
{
    /**
     * Name used for serialization and identification
     */
    name: string;

    /**
     * Constructor of the container to use.
     */
    container?: Function;

    /**
     * Name displayed in Composer.
     */
    displayName?: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;

    /**
     * Category in Composer's Interface Assets panel.
     */
    category: string;
}

/**
 * Injection method of behaviors in an element.
 * @param options options of the injection
 *
 * @internal
 */
export function Inject(options?: IInjectOptions) {
    return (ctor: Function): void => {

    };
}

/**
 * Avoid to inject method.
 *
 * @internal
 */
export function DoNotInjectMethod() {
    return (
        target: unknown,
        propertyKey: string | symbol,
        // descriptor: PropertyDescriptor
    ): void => {

    };
}

/**
 * The `@Asset` decorator enables you to declare an interface asset that can be used in an Intuiface experience.
 *
 * The `@Asset` decorator is placed on a class and you can then declare properties, triggers and anction using decorators {@link Property | `@Property`}, {@link Trigger | `@Trigger`} and {@link Action | `@Action`} inside this class.
 *
 * An asset class must extends {@link IntuifaceElement}.
 *
 * @param options of the asset (display name, description, ...)
 *
 * @example Squeleton of an interface asset class:
 * ```ts
 * /**
 *  * Custom Interface Asset
 *  *\/
 * @Asset({
 *     name: 'MyCustomInterfaceAsset',
 *     category: 'My Custom Interface Asset Category'
 *     behaviors: []
 * })
 * export class MyCustomInterfaceAsset extends IntuifaceElement {
 *
 *     /**
 *      * Property example
 *      *\/
 *     @Property({
 *         displayName: 'propertyExample',
 *         description: 'A property declaration example.',
 *         defaultValue: 0,
 *         minValue: 0,
 *         maxValue: 10,
 *         type: Number
 *     })
 *     public propertyExample: number = 0;
 *
 *
 *     /**
 *      * Trigger Example
 *      *\/
 *     @Trigger({
 *         name: 'exampleTrigger',
 *         displayName: 'A Trigger Example',
 *         description: 'Raised when the property example changed'
 *     })
 *     public exampleTrigger(): void {}
 *
 *
 *     /**
 *      * Action Example
 *      *\/
 *     @Action({
 *         displayName: 'Action Example',
 *         description: 'An Action example with a parameter and validation',
 *         validate: true
 *     })
 *     public actionExample(
 *         @Parameter({
 *             name: 'actionParam',
 *             displayName: 'Action parameter',
 *             description: 'An action parameter example.',
 *             defaultValue: 1,
 *             minValue: 0,
 *             maxValue: 10,
 *             type: Number
 *         }) actionParam: number): void
 *     {
 *         if (this.propertyExample !== actionParam) {
 *             this.propertyExample = actionParam;
 *             // raise the trigger
 *             this.exampleTrigger();
 *         }
 *     }
 * }
 * ```
 *
 * @group Decorators
 */
export function Asset(options?: IElementOptions): (cls: any) => any
{
    return (ctor: Function) =>
    {
        const targetName = options.name;
        globalThis.iaTitle = options.displayName;
        globalThis.iaCategory = options.category;

        if (options.description != null)
        {
            globalThis.iaDescription = options.description;
        }

        if (globalThis.intuiface_ifd_classes.indexOf(targetName) === -1)
        {
            globalThis.intuiface_ifd_classes.push(targetName);
        }

        if (!globalThis.intuiface_ifd_properties[targetName]) {
            globalThis.intuiface_ifd_properties[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_params[targetName]) {
            globalThis.intuiface_ifd_params[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_triggers[targetName]){
            globalThis.intuiface_ifd_triggers[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_actions[targetName]){
            globalThis.intuiface_ifd_actions[targetName] = {};
        }

    };
}

/**
 * The `@Collection` decorator enables you to declare a custom collection that can be used in an Intuiface experience.
 *
 * _**This is experimental as there is currently no way to use a custom collection created with the CDK in Intuiface Composer.**_
 *
 * @param options of the collection (display name, description, ...)
 *
 * @experimental
 *
 * @group Decorators
 */
export function Collection(options?: ICollectionOptions): (cls: any) => any
{
    return (ctor: Function) => {
        const targetName = options.name;
        globalThis.iaCategory = options.category;

        if (globalThis.intuiface_ifd_classes.indexOf(targetName) === -1) {
            globalThis.intuiface_ifd_classes.push(targetName);
        }

        if (!globalThis.intuiface_ifd_properties[targetName]) {
            globalThis.intuiface_ifd_properties[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_params[targetName]) {
            globalThis.intuiface_ifd_params[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_triggers[targetName]) {
            globalThis.intuiface_ifd_triggers[targetName] = {};
        }

        if (!globalThis.intuiface_ifd_actions[targetName]) {
            globalThis.intuiface_ifd_actions[targetName] = {};
        }

    };
}

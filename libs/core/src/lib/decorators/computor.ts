/**
 * Options to configure {@link Computor| `@Computor`} decorator.
 */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
export interface IComputorOptions {
    /**
     * List of properties to watch that will trigger a call to the decorated method.
     */
    inputs: string[];
}

/**
 * The `@Computor` decorator can be added on a method that will be automatically called when one of the inputs declared in options changes.
 *
 * Computor listens to input changes on instance of {@link Watchable}. This means all listed inputs must notify changes with {@link Watchable.notifyPropertyChanged} to trigger a computor call.
 *
 * Inputs values will be passed as arguments of the method in the order they appears in the `inputs` array in `options`.
 *
 * @param options Options to configure the computor
 *
 * @example A method that will be called when `scale` or `width` changes to compute a width with the applied scaled:
 * ```ts
 *    @Property({
 *        displayName: 'scale',
 *        type: Number
 *    })
 *    public scale: number;
 *
 *    @Property({
 *        displayName: 'width',
 *        type: Number
 *    })
 *    public width: number;
 *
 *    @Property({
 *        displayName: 'Computed width',
 *        readOnly: true,
 *        type: Number
 *    })
 *    public computedWidth: number;
 *
 *    @Computor({
 *        inputs: ['scale', 'width']
 *    })
 *    private computeWidth(scale: number, width: number): void
 *    {
 *        this.computedWidth = scale * width;
 *    }
 * ```
 * Note that `scale` and `width` are in the same order in `inputs` and as `computeWidth` arguments.
 *
 * @group Decorators
 */
export function Computor(options: IComputorOptions) {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
    };
}

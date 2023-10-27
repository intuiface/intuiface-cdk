/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Decorator similar to {@link Property | `@Property`} but for property not intended to be exposed in Composer.
 *
 * When using this decorator on a property, it will automatically generate getter and setter that will raise the {@link Watchable.notifyPropertyChanged} event. You can also set the `affectRendering` option to `true` to indicate that any change made on this property affects rendering and should trigger rendering engine update.
 *
 * @group Decorators
 */
export function InternalProperty(options?: {
    /**
     * If true, ask visual component update when changed
     */
    affectRendering?: boolean;
})
{
    return (target: unknown, propertyKey: string): void =>
    {

    };
}

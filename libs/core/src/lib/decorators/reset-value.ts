/* eslint-disable prefer-arrow/prefer-arrow-functions */

/**
 * Options to control whether a value resets.
 */
export interface IResetValueOptions
{
    /**
     * Set to false to keep the current value during reset.
     * Set to true to allow Player to reset the value, including a read-only `@Property`.
     * If omitted, Player uses its default reset behavior.
     */
    enabled?: boolean;
}

/**
 * Use `@ResetValue({ enabled: false })` to keep a class variable's value when Composer requests a reset.
 * For example, keep a timer's reference so your code can stop it when needed.
 *
 * For a variable declared with {@link Property | `@Property`}, use its `resetOptions` option instead.
 *
 * **Requires Player 8.3.1 or later.** An interface asset using this decorator cannot be loaded in earlier Player versions.
 *
 * @since Player 8.3.1
 * @param options Controls whether the value resets.
 * @group Decorators
 */
export function ResetValue(options: IResetValueOptions = {}): PropertyDecorator
{
    return (target: object, propertyKey: string | symbol): void =>
    {
    };
}

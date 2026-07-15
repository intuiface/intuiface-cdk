/**
 * Represents an HCMS group component.
 *
 * Group and item values are exposed as dynamic properties directly available
 * through bracket notation such as `group['propertyName']`.
 *
 * @example
 * ```ts
 * const component = base.getComponent('header');
 * if (component && !('items' in component))
 * {
 *     const title = component['title'];
 *     console.log('Header title:', title);
 * }
 * ```
 */
export class HCMSGroup
{
    /**
     * Identifier of the group.
     */
    public get id(): string
    {
        return '';
    }

    /**
     * Display name of the group.
     */
    public get name(): string
    {
        return '';
    }

    /**
     * Rebuilds projected dynamic properties for this group.
        *
        * @example
        * ```ts
        * group.refresh();
        * ```
     */
    public refresh(): void
    {
        // Empty implementation for CDK shell.
    }

    /**
     * Gets the value of a dynamic property of this group.
     *
     * @param propertyName The name of the property to retrieve.
     * @returns The value of the property, or `undefined` if the property does not exist.
     * @example
     * ```ts
     * const title = group['title'];
     * ```
     */
    [propertyName: string]: any;
}

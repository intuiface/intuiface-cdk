import { HCMSCollection } from './hcms.collection';
import { HCMSGroup } from './hcms.group';

/**
 * Represents one HCMS base.
 *
 * @example
 * ```ts
 * const base = HCMSService.getBase('catalog');
 * console.log(base.id, base.name);
 * ```
 */
export class HCMSBase
{
    /**
     * Identifier of the base.
     */
    public readonly id: string = '';

    /**
     * Display name of the base.
     */
    public readonly name: string = '';

    /**
     * Clears memoized component/item projections for this base.
        *
        * @example
        * ```ts
        * base.refresh();
        * ```
     */
    public refresh(): void
    {
        // Empty implementation for CDK shell.
    }

    /**
     * Gets a component by id.
     *
     * @param componentId Identifier of the component in the base root.
     * @returns A {@link HCMSGroup} or {@link HCMSCollection}, or `null` when unknown.
    *
    * @example
    * ```ts
    * const component = base.getComponent('products');
    * if (component && 'items' in component)
    * {
    *     console.log('Collection size:', component.items.length);
    * }
    * ```
     */
    public getComponent(componentId: string): HCMSGroup | HCMSCollection | null
    {
        return null;
    }
}

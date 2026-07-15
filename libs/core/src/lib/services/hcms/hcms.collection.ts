import { HCMSItem } from './hcms.item';

/**
 * Represents an HCMS collection component.
 *
 * @example
 * ```ts
 * const component = base.getComponent('products');
 * if (component && 'items' in component)
 * {
 *     component.items.forEach((item) => {
 *         console.log(item.id, item['price']);
 *     });
 * }
 * ```
 */
export class HCMSCollection
{
    /**
     * Identifier of the collection.
     */
    public readonly id: string = '';

    /**
     * Display name of the collection.
     */
    public readonly name: string = '';

    /**
     * Items currently exposed by the collection.
        *
        * @example
        * ```ts
        * const first = collection.items[0];
        * if (first)
        * {
        *     console.log(first.name, first['description']);
        * }
        * ```
     */
    public readonly items: HCMSItem[] = [];

    /**
     * Clears memoized item projections for this collection.
        *
        * @example
        * ```ts
        * collection.refresh();
        * ```
     */
    public refresh(): void
    {
        // Empty implementation for CDK shell.
    }
}

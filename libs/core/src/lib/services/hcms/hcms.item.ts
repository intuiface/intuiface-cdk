import { HCMSGroup } from './hcms.group';

/**
 * Represents one item of an HCMS collection.
 *
 * Item values are exposed as dynamic properties directly available through
 * bracket notation such as `item['propertyName']`.
 *
 * @example
 * ```ts
 * const item = collection.items[0];
 * if (item)
 * {
 *     console.log(item.id, item['title'], item['price']);
 * }
 * ```
 */
export class HCMSItem extends HCMSGroup
{
}

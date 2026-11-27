import { Asset, Property, Watchable } from '@intuiface/core';
import { HOME_CATEGORY } from './categories';

/**
 * Item class shared by two items, the Barometer and Thermostat fixtures (src/shared/ in the workspace), declared as the
 * documentation of `itemType` shows it: a `Watchable` with `@Asset`, the item type of an array property.
 * Its decorators fill the descriptor of the item being built: they must run for each item that imports it (review O16).
 */
@Asset({
    name: 'Reading',
    category: HOME_CATEGORY,
    behaviors: []
})
export class Reading extends Watchable
{
    @Property({
        displayName: 'Value',
        defaultValue: 0,
        type: Number
    })
    public value: number = 0;

    @Property({
        displayName: 'Time',
        type: String
    })
    public time: string = '';
}

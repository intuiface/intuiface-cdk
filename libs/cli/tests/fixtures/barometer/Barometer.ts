import { Asset, Property } from '@intuiface/core';
import { HOME_CATEGORY } from '../../shared/categories';
import { Reading } from '../../shared/reading';
import { Sensor } from '../../shared/sensor';

/**
 * Interface asset fixture built before the Thermostat fixture by `build --all` (items are sorted by name):
 * both import the `Reading` class and extend the `Sensor` class of src/shared/ in the workspace (review O16).
 */
@Asset({
    name: 'Barometer',
    displayName: 'Barometer',
    category: HOME_CATEGORY,
    behaviors: []
})
export class Barometer extends Sensor
{
    @Property({
        displayName: 'Pressure readings',
        type: Array,
        itemType: Reading
    })
    public readings: Reading[] = [];
}

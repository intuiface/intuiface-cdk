import { Asset, Property, Watchable } from '@intuiface/core';
import { HOME_CATEGORY } from '../../shared/categories';
import { Point } from '../../shared/point';
import { Reading } from '../../shared/reading';
import { Sensor } from '../../shared/sensor';

/**
 * Interface asset fixture built before the Thermostat fixture by `build --all` (items are sorted by name):
 * both import the `Reading` and `Point` classes and extend the `Sensor` class of src/shared/ in the workspace (review O16).
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

    @Property({
        displayName: 'Track',
        type: Array,
        itemType: Point
    })
    public track: Point[] = [];
}

/**
 * Class with `@Asset` declared after the interface asset, in the same file: its decorator runs last. The title, description
 * and category of the descriptor must still be those of Barometer.
 */
@Asset({
    name: 'BarometerLog',
    displayName: 'Barometer log',
    description: 'Log of the barometer.',
    category: 'Logs',
    behaviors: []
})
export class BarometerLog extends Watchable
{
    @Property({
        displayName: 'Entry',
        type: String
    })
    public entry: string = '';
}

import { Property, Watchable } from '@intuiface/core';

/**
 * Classes without `@Asset`, shared by the Barometer fixture (`itemType` of `track`) and the Thermostat fixture (`type` of
 * `position`), in src/shared/ in the workspace. Extending Watchable is what the Player needs: the descriptor of each item
 * describes `Point`, with the properties of its parent class `Coordinates`, and `PointLabel`, which `Point` references.
 */
export class PointLabel extends Watchable
{
    @Property({
        displayName: 'Text',
        type: String
    })
    public text: string = '';
}

/**
 * Parent class of `Point`, used by no property: it gives its properties to `Point`, and has no entry of its own.
 */
export class Coordinates extends Watchable
{
    @Property({
        displayName: 'X',
        defaultValue: 0,
        type: Number
    })
    public x: number = 0;

    @Property({
        displayName: 'Y',
        defaultValue: 0,
        type: Number
    })
    public y: number = 0;
}

export class Point extends Coordinates
{
    @Property({
        displayName: 'Label',
        type: PointLabel
    })
    public label: PointLabel = new PointLabel();
}

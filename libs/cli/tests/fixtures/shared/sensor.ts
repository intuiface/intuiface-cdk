import { Action, IntuifaceElement, Property, Trigger } from '@intuiface/core';

/**
 * Parent class of the Barometer and Thermostat fixtures (src/shared/ in the workspace), without `@Asset`.
 * The Player gives its decorated members to each class that extends it: they are in the descriptor of both items.
 * `unit` is declared again by Thermostat, whose declaration wins.
 */
export class Sensor extends IntuifaceElement
{
    @Property({
        displayName: 'Sensor name',
        defaultValue: 'Sensor',
        type: String
    })
    public sensorName: string = 'Sensor';

    @Property({
        displayName: 'Sensor unit',
        defaultValue: '',
        type: String
    })
    public unit: string = '';

    @Trigger({
        name: 'calibrated',
        displayName: 'Calibrated'
    })
    public calibrated(): void {}

    @Action({
        displayName: 'Calibrate'
    })
    public calibrate(): void
    {
        this.calibrated();
    }
}

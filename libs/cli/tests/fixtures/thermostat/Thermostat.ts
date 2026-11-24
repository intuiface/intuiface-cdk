import { Action, Asset, IntuifaceElement, Parameter, Property, Trigger } from '@intuiface/core';
import { formatTemperature } from './format';

/**
 * Interface asset fixture: several property types, an action with two parameters,
 * a trigger with a parameter, and a relative import (rewritten to `./format.js` by the CLI).
 */
@Asset({
    name: 'Thermostat',
    displayName: 'Smart thermostat',
    description: 'Controls the room temperature.',
    category: 'Home',
    behaviors: []
})
export class Thermostat extends IntuifaceElement
{
    @Property({
        displayName: 'Target temperature',
        description: 'Temperature to reach.',
        defaultValue: 20,
        minValue: 5,
        maxValue: 30,
        type: Number
    })
    public target: number = 20;

    @Property({
        displayName: 'Unit',
        defaultValue: 'C',
        type: String
    })
    public unit: string = 'C';

    @Property({
        displayName: 'Heating',
        defaultValue: false,
        readOnly: true,
        type: Boolean
    })
    public heating: boolean = false;

    @Property({
        displayName: 'Display text',
        readOnly: true,
        type: String
    })
    public displayText: string = formatTemperature(20, 'C');

    @Trigger({
        name: 'targetReached',
        displayName: 'Target reached',
        description: 'Raised when the room reaches the target temperature.'
    })
    public targetReached(
        @Parameter({
            name: 'temperature',
            displayName: 'Temperature',
            type: Number
        }) temperature: number
    ): void {}

    @Action({
        displayName: 'Set target',
        description: 'Change the target temperature.',
        validate: true
    })
    public setTarget(
        @Parameter({
            name: 'value',
            displayName: 'Value',
            defaultValue: 20,
            minValue: 5,
            maxValue: 30,
            type: Number
        }) value: number,
        @Parameter({
            name: 'unit',
            displayName: 'Unit',
            defaultValue: 'C',
            type: String
        }) unit: string
    ): void
    {
        this.target = value;
        this.unit = unit;
        this.displayText = formatTemperature(value, unit);
        this.targetReached(value);
    }
}

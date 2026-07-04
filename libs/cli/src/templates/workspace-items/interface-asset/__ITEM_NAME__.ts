import { Action, Asset, IntuifaceElement, Parameter, Property, Trigger } from '@intuiface/core';

/**
 * Custom Interface Asset __ITEM_NAME__
 */
@Asset({
    name: '__ITEM_NAME__',
    category: '__ITEM_CATEGORY__',
    behaviors: [],
})
export class __ITEM_NAME__ extends IntuifaceElement {

    //#region Public Properties

    /**
     * Property example
     * This property will be displayed and can be used in Composer.
     */
    @Property({
        displayName: 'propertyExample',
        description: 'A property declaration example.',
        defaultValue: 0,
        minValue: 0,
        maxValue: 10,
        type: Number
    })
    public propertyExample: number = 0;

    //#endregion Public Properties

    //#region Triggers

    /**
     * Trigger example raised when propertyExample changes.
     */
    @Trigger({
        name: 'exampleTrigger',
        displayName: 'A Trigger Example',
        description: 'Raised when the property example changed'
    })
    public exampleTrigger(
        @Parameter({
            name: 'triggerParam',
            displayName: 'Trigger parameter',
            description: 'A trigger parameter example.',
            defaultValue: '',
            type: String
        }) triggerParam: string
    ): void
    {
        void triggerParam;
    }

    //#endregion Triggers

    //#region Actions

    /**
     * Action example that updates the property and raises a trigger.
     */
    @Action({
        displayName: 'Action Example',
        description: 'An Action example with a parameter and validation',
        validate: true
    })
    public actionExample(
        @Parameter({
            name: 'actionParam',
            displayName: 'Action parameter',
            description: 'An action parameter example.',
            defaultValue: 1,
            minValue: 0,
            maxValue: 10,
            type: Number
        }) actionParam: number
    ): void
    {
        if (this.propertyExample !== actionParam)
        {
            this.propertyExample = actionParam;
            this.exampleTrigger('An example parameter string value');
        }
    }

    //#endregion Actions
}

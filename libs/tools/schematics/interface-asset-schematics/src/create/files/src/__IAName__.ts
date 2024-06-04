import { Action, Asset, IntuifaceElement, Parameter, Property, Trigger } from '@intuiface/core';

/**
 * Custom Interface Asset <%= IAName %>
 */
@Asset({
    name: '<%= IAName %>',
    category: '<%= IACategory %>',
    behaviors: [],
})
export class <%= IAName %> extends IntuifaceElement {

    //#region Public Properties

    /**
     * Property example
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

    //#region Constructor
    /**
     * @constructor
     */
    public constructor()
    {
        super();
    }

    //#endregion Constructor

    //#region Triggers

    /**
     * Trigger Example
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
    ): void {}

    //#endregion Triggers

    //#region Actions

    /**
     * Action Example
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
        }) actionParam: number): void
    {
        if (this.propertyExample !== actionParam) {
            this.propertyExample = actionParam;
            // raise the trigger
            this.exampleTrigger('An example parameter string value');
        }
    }
    //#endregion Actions
}

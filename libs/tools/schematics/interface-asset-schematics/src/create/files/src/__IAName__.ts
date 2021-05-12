import { Action, Asset, IntuifaceElement, Parameter, Property, Trigger } from '@intuiface/core';

/**
 * Custom Interface Asset <%= IAName %> 
 */
@Asset({
    name: '<%= IAName %>',
    behaviors: []
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
        displayName: 'A Trigger Example'
    })
    public exampleTrigger(): void {}

    //#endregion Triggers

    //#region Actions

    /**
     * Action Example
     */
    @Action({ displayName: 'Action Example' })
    public actionExample(
        @Parameter({
        name: 'action parameter',
        displayName: 'Action parameter',
        description: 'An action parameter example.',
        type: Number
    }) actionParam: number): void
    {
        if(this.propertyExample !== actionParam) {
            this.propertyExample = actionParam;
            this.exampleTrigger();
        }
    }
    //#endregion Actions
}

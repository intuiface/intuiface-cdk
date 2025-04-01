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
     * This property will be displayed and can be used in Composer
     * It can be bind to a trigger or an action
     * It can be modified with an action (if the property is not read-only)
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

    //#region Private Properties

    /**
     * A private property example
     */
    private _privateStr: String = null;

    //#endregion Private Properties

    //#region Constructor
    /**
     * @constructor
     */
    public constructor()
    {
        super();
    }

    //#endregion Constructor

    //#region Life Cycle

    /**
     *  * Each element or collection has the same life cycle :
     * 1 - Constructor : Can be use to declare properties, set default values.
     * 2 - Initialize : Initialize the element with the configuration. The configuration contains the values of each properties defined in Composer.
     * 3 - Dispose : Dispose the element, remove all listeners, clear memory.
     * 
     * It is important to call the `super()` in each method to ensure the correct behavior of the element. 
     * 
     * All these functions can be removed if not used.
     */

    /**
     * Initialize the element with the configuration.
     * This is an example of how to use the initialize method.
     */
    public override initialize(configuration?: any): void
    {
        // call the super to apply the configuration (default values declared in Composer)
        super.initialize(configuration);
    
        // Add here any code you want to be executed after the Interface Asset has been loaded,
        // and after the property values have been set by Composer / Player
    }


    /**
     * Dispose the element.
     * This is an example of how to use the dispose method.
     */
    public override dispose(): void
    {
        // Add here any code you want to be executed when the experience is stopping.
        // For example: stop an infinite timer, close a Serial Port, ...

        // then call the super
        super.dispose();
    }


    //#endregion Life Cycle

    //#region Triggers

    /**
     * Trigger Example
     * This trigger will be raised when the propertyExample changed
     * You need to call this method to raise the trigger.
     * For the example, this method is called in the action below.
     * 
     * The trigger has a parameter that can be used in Composer.
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
     * This action will change the propertyExample value.
     * It will raise the trigger exampleTrigger if the value of the property changed.
     * An action is called if defined in Composer.
     * 
     * This action has a parameter and a validation.
     * The parameter is a number between 0 and 10.
     * If the parameter is not defined or not valid, the action will be called with the default value (1 in this case).
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

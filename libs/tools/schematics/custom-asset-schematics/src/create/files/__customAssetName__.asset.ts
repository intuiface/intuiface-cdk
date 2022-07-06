import { TapBehavior } from '@intuiface/components';
import { IntuifaceElement, Asset, Property, Parameter, Action, Trigger } from '@intuiface/core';

/**
 * ExternalAsset
 */
@Asset({
    name: '<%= customAssetName %>',
    behaviors: [
        TapBehavior
    ]
})
export class <%= classify(customAssetName) %> extends IntuifaceElement {

    
    //#region Properties

    /**
     * Property Example.
     */
    @Property({
        displayName: 'PropertyExample',
        description: 'Example of property.',
        defaultValue: 'hello property',
        type: String
    })
    public propertyExample: string = 'hello property';

    //#endregion Properties

    //#region Actions

    /**
     * Action Example
     */
    @Action({
        displayName: 'Action Example',
        description: 'Example of action.'
    })
    public actionExample(
        @Parameter({
        name: 'paramExample',
        displayName: 'Parameter Example',
        description: 'Example of parameter in action.',
        type: String
    }) newProp: string): void
        {
            this.propertyExample = newProp;
        }

    //#endregion Actions

    //#region Triggers

    /**
     * Trigger Example
     */
    @Trigger({
        name: 'triggerExample',
        displayName: 'Trigger Example',
        description: 'Example of trigger.'
    })
    public triggerExample(): void {}

    //#endregion Triggers

}
export interface <%= classify(customAssetName) %>
    extends IntuifaceElement,
    TapBehavior { }

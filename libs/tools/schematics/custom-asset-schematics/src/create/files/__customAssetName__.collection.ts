import { TapBehavior, HomogeneousBehavior, CollectionBehavior } from '@intuiface/components';
import { IntuifaceCollection, Collection, ElementContainer, Property, Parameter, Action, Trigger, ICollectionConfiguration } from '@intuiface/core';
/**
 * ExternalCollection
 */
@Collection({
    name: '<%= customAssetName %>',
    container: ElementContainer,
    behaviors: [
        HomogeneousBehavior,
        TapBehavior
    ]
})
export class <%= classify(customAssetName) %> extends IntuifaceCollection<ElementContainer> {

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


    /**
     * Initialize default value of each property.
     * @param configuration : configuration
     */
    public initialize(configuration?: ICollectionConfiguration): void {
        super.initialize(configuration);

        this._requestedStartIndex = 0;
        this._requestedItemsCount = -1;
    }
}
export interface <%= classify(customAssetName) %>
    extends IntuifaceCollection<ElementContainer>,
    CollectionBehavior,
    HomogeneousBehavior,
    TapBehavior { }

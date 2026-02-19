import { CollectionBehavior } from './collection.behavior';

/**
 * Behavior to manage a homogeneous collection.
 */
export class HomogeneousBehavior extends CollectionBehavior
{
    //#region Fields
    /**
     * Flag allowing to check if generic collections are homogenous or not
     */
    protected isHomogeneousCollection = true;
    //#endregion Fields

    //#region Properties

    /**
     * Item width.
     */
    public itemWidth = 360;

    /**
     * Item height.
     */
    public itemHeight = 240;

    /**
     * Item spacing.
     */
    public itemSpacing = 15;

    //#endregion Properties
}

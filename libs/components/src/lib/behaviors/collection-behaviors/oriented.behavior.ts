import { CollectionBehavior } from './collection.behavior';

/**
 * Collection orientations.
 */
export enum ECollectionOrientation
{
    Horizontal = 'Horizontal',
    Vertical = 'Vertical'
}

/**
 * Fill directions.
 */
export enum EFillDirection
{
    LeftToRight = 'LeftToRight',
    RightToLeft = 'RightToLeft',
    TopToBottom = 'TopToBottom',
    BottomToTop = 'BottomToTop'
}


/**
 * Behavior to manage an oriented collection.
 */
export class OrientedBehavior extends CollectionBehavior {
    //#region Properties

    /**
     * Orientation.
     */
    public collectionOrientation = ECollectionOrientation.Horizontal;

    /**
     * Fill direction.
     */
    public fillDirection = EFillDirection.LeftToRight;

    //#endregion Properties
}

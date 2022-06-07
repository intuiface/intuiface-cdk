import { CollectionBehavior } from './collection.behavior';
import { Computor, InternalProperty, IntuifaceElement, Property } from '@intuiface/core';

/**
 * Behavior to manage a pannable collection.
 */
export class PannableBehavior extends CollectionBehavior
{
    //#region Fields
    /**
     * Flag allowing to check if generic collections are pannable or not
     */
    protected isPannableCollection = true;
    //#endregion Fields

    //#region Properties

    /**
     * Allow scroll
     */
    public allowScroll = true;

    /**
     * If true, items can be interacted with
     */
    public allowInteractionWithItems = true;

    //#endregion Properties

    //#region Internal properties

    /**
     * Indicates if the collection can be scrolled
     */
    protected scrollEnabled = true;

    //#endregion Internal properties
}
export interface PannableBehavior extends CollectionBehavior {}

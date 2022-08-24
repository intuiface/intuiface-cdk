import { Inject, IntuifaceElement } from '@intuiface/core';
import { IndexingBehavior } from './indexing.behavior';

/**
 * Behavior to manage a focusing collection.
 */
@Inject({
    behaviors: [IndexingBehavior]
})
export class FocusingCollectionBehavior
{
    //#region Properties

    /**
     * Focused elements.
     */
    public focusedElements: IntuifaceElement[] = [];

    /**
     * Number of items considered in focus, and thus that can be tapped (without navigating) or dragged and dropped
     */
    public numberOfItemsInFocus: number = 1;

    /**
     * Swipe sensitivity.
     */
    public swipeSensitivity: number = 200;

    //#endregion Properties
}
export interface FocusingCollectionBehavior extends IndexingBehavior {}

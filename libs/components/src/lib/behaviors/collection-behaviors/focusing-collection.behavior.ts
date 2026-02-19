import { IntuifaceElement } from '@intuiface/core';
import { IndexingBehavior } from './indexing.behavior';

/**
 * Behavior to manage a focusing collection.
 */
export class FocusingCollectionBehavior extends IndexingBehavior
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

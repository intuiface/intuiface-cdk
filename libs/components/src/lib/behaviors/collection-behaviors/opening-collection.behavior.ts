import { IntuifaceElement } from '@intuiface/core';
import { CollectionBehavior } from './collection.behavior';

/**
 * Behavior to manage an openable collection.
 */
export class OpeningCollectionBehavior extends CollectionBehavior
{
    //#region Properties

    /**
     * Indicate Tap to open item is enabled
     */
    public isTapToOpenEnabled = false;

    /**
     * Indicate Drag and drop to open item is enabled
     */
    public isDragDropToOpenEnabled = false;

    /**
     * Resize ratio of opened items.
     */
    public resizeRatio = 1.0;

    //#endregion Properties

    //#region Actions

    /**
     * Open the given item.
     * @param item item to open
     */
    public openItem(index: number, x: number, y: number, orientation: number): void
    {
    }

    /**
     * Open element
     * @param element
     * @param width
     * @param height
     * @param x
     * @param y
     */
    public openElement(element: IntuifaceElement, x: number, y: number): void
    {
    }

    /**
     * Close all opened items.
     */
    public closeAllOpenedCollectionItems(): void
    {
    }

    //#endregion Actions
}

import { CollectionBehavior } from './collection.behavior';

/**
 * Behavior to manage an indexing collection.
 */
export class IndexingBehavior extends CollectionBehavior
{
    //#region Fields

    /**
     * Indicates if this collection is a looping collection
     */
    protected isLoopingCollection: boolean = false;
    //#endregion Fields

    //#region Properties

    /**
     * Index in focus.
     */
    public selectedIndex: number = 1;

    /**
     * Current pointer.
     */
    protected currentPointedIndex: number = 0;

    /**
     * Scroll by.
     */
    protected scrollBy: number = 1;

    /**
     * Indicate controls are displayed
     */
    public showControls = true;

    //#endregion Properties

    //#region Triggers

    /**
     * Index is changed event.
     */
    public raiseReachedIndex(index: number): void { }

    /**
     * Is moved to previous event.
     */
    public raiseMovedToPrevious(): void { }

    /**
     * Is moved to next event.
     */
    public raiseMovedToNext(): void { }

    /**
     * First item reached event.
     */
    public raiseFirstItemReached(): void { }

    /**
     * Last item reached event.
     */
    public raiseLastItemReached(): void { }

    //#endregion Triggers

    //#region Actions

    /**
     * Action to go to given index.
     * @param index index to reach
     */
    public goToIndex(index: number): void
    {
    }

    /**
     * Action to go to given item's name.
     * @param name name of the item to reach
     */
    public goToItem(itemName: string): void
    {
    }

    /**
     * Action to go to next item.
     */
    public goToNext(): void
    {
    }

    /**
     * Action to go to previous item.
     */
    public goToPrevious(): void
    {
    }

    /**
     * Action to go to first item.
     */
    public goToFirst(): void
    {
    }

    /**
     * Action to go to last item.
     */
    public goToLast(): void
    {
    }

    //#endregion Actions

}
export interface IndexingBehavior extends CollectionBehavior {}

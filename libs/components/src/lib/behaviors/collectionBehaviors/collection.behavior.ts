import { IntuifaceElement } from '@intuiface/core';

/**
 * Behavior to manage a collection.
 */
export class CollectionBehavior
{
    //#region Properties

    /**
     * If true, show scrollbars.
     */
    public showScrollbars = true;

    //#endregion Properties

    //#region Fields

    /**
     * Items.
     */
    public visibleItems: IntuifaceElement[];

    /**
     * Indicates the start index of the current items requested from collection sources
     */
    public visibleItemsStartIndex: number = 0;

    /**
     * Total number of items aggregated from each source in this collection
     */
    public totalItemsCount: number = 0;

    /**
     * Indicates if this Collection has an infinite number of items.
     * If true, totalItemsCount if the number of currently known items
     */
    public hasInfiniteItems: boolean = false;

    /**
     * Indicated if the collection has any items
     * Needed to display ghosts in an empty collection
     */
    public hasItems: boolean;


    /**
     * List of sources (IntuifaceElement and DataFeed) for this collection
     */
    public readonly sources: (IntuifaceElement)[] = [];

    //#endregion Fields

    //#region Actions

    //#endregion

    //#region Public methods

    /**
     * Add a source
     * @param source : source to add
     */
    public addSource(source: IntuifaceElement, index: number | undefined = undefined): void {
        throw new Error('Method not implemented.');
    }

    /**
     * Remove a source
     * @param source : source to remove
     */
    public removeSource(source: IntuifaceElement): void {
        throw new Error('Method not implemented.');
    }

    /**
     * Requests items of the collection
     * @param start start index of the requested items
     * @param count number of requested items
     */
    public requestItems(start: number, count: number): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
     * Gets the start index in overall items for the given source
     * @param source soure to find
     */
    public getStartIndexForSource(source: IntuifaceElement): number {
        throw new Error('Method not implemented.');
    }
    //#endregion
}

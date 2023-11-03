import { ElementContainer } from './container';
import { IntuifaceElement } from './element';

/**
 * `IntuifaceCollection` is the base class to use to implements any kind of collection in Intuiface.
 *
 * _**This is experimental as there is currently no way to use a custom collection created with the CDK in Intuiface Composer.**_
 *
 * @experimental
 */
export class IntuifaceCollection<T extends ElementContainer> extends IntuifaceElement
{
    //#region Fields

    /**
     * Visible items
     */
    public visibleItems: IntuifaceElement[] = [];

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
    public hasItems: boolean = false;

    /**
     * List of sources (IntuifaceElement and DataFeed) for this collection
     */
    public readonly sources: (IntuifaceElement)[] = [];

    /**
     * Start index of the requested items
     */
    protected _requestedStartIndex: number | undefined = undefined;

    /**
     * Number of requested items
     */
    protected _requestedItemsCount: number | undefined = undefined;

    //#endregion Fields

    //#region Public methods

    /**
     * Requests items of the collection
     * @param start start index of the requested items
     * @param count number of requested items
     */
    public async requestItems(start: number, count: number): Promise<void> {

    }

    /**
     * Gets the start index in overall items for the given source
     * @param source soure to find
     */
    public getStartIndexForSource(source: IntuifaceElement): number {
        return 0;
    }

    //#endregion Public methods
}

/**
 * Configuration to create any IntuifaceCollection
 */
export interface ICollectionConfiguration {
    /**
     * List of Interface Assets in the experience
     */
    interfaceAssets?: [];

    /**
     * Items (children)
     */
    items?: [];
}


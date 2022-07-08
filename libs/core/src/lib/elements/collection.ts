import { ElementContainer } from './container';
import { IntuifaceElement } from './element';

/**
 * Intuiface Collection
 */
export class IntuifaceCollection<T extends ElementContainer> extends IntuifaceElement
{
    /**
     * Visible items
     */
    public visibleItems: IntuifaceElement[] = [];

    /**
     * Start index of the requested items
     */
    protected _requestedStartIndex: number | undefined = undefined;

    /**
     * Number of requested items
     */
    protected _requestedItemsCount: number | undefined = undefined;
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


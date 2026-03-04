import { CollectionBehavior } from './collection.behavior';

/**
 * Behavior to manage an indexing collection.
 */
export class ScrollableBehavior extends CollectionBehavior
{
    //#region Properties

    /**
     * The scroll offset
     */
    public scrollOffset = 0;

    /**
     * Horizontal offset
     */
    public scrollViewerHorizontalOffset = 0;

    /**
     * Vertical offset
     */
    public scrollViewerVerticalOffset = 0;

    /**
     * Show control indicator
     */
    public showScrollIndicator = true;

    /**
     * Indicates if there is an intial scroll effect or not.
     */
    public initialScrollEffect = true;

    /**
     * Initial recenter time.
     */
    public initialRecenterTime = 3;

    /**
     * Recenter time.
     */
    public recenterTime = 1;

    /**
     * Elasticity at boundary
     */
    public allowElasticity = true;

    /**
     * Indicates if the collection is being scrolled
     */
    public isScrolling = false;

    /**
     * Soft move speed
     */
    public softMoveSpeed = 0.95;

    //#endregion Properties

    //#region Triggers

    /**
     * Scrolled event.
     */
    public raiseIsScrolled(): void {}

    //#endregion Triggers

    //#region Actions

    /**
     * Scroll to a given offset in pixels
     * @param offset
     */
    public scrollToOffset(offset: number): void
    {
    }

    //#endregion Actions
}
export interface ScrollableBehavior extends CollectionBehavior {}

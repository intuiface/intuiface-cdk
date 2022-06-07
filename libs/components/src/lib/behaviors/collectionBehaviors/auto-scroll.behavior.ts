import { IndexingBehavior } from './indexing.behavior';

/**
 * Behavior to manage autoscroll in collection.
 */
export class AutoScrollBehavior extends IndexingBehavior
{
    //#region Properties

    /**
     * Autoscroll.
     */
    public autoscroll: boolean = false;

    /**
     * Duration by item.
     */
    public itemDuration: number = 5;

    //#endregion Properties

    //#region Actions

    /**
     * Start autoscroll.
     * @param delayMode delay mode
     */
    public startAutoscroll(delayMode: string): void
    {
        this.autoscroll = true;
    }

    /**
     * Stop autoscroll.
     */
    public stopAutoscroll(): void
    {
        this.autoscroll = false;
    }

    /**
     * Toggle autoscroll.
     */
    public toggleAutoscroll(): void
    {
        this.autoscroll = !this.autoscroll;
    }

    //#endregion Actions
}

import { PlayableFacade } from './playable.facade';

/**
 * Facade to use audio API.
 */
export class PlayableMediaFacade implements PlayableFacade {
    //#region Accessors

    /**
     * Get current time of the playable element.
     */
    public getCurrentTime(): number
    {
        return 0;
    }

    /**
     * Set current time to the playable element.
     * @param currentTime current time to set
     */
    public setCurrentTime(currentTime: number): void
    {
    }

    /**
     * Get duration of the playable element.
     */
    public getDuration(): number
    {
        return 0;
    }

    /**
     * Return true if playable element is paused.
     */
    public isPaused(): boolean
    {
        return true;
    }

    /**
     * Change volume
     * @param volume
     */
    public setVolume(volume: number): void
    {
    }

    //#endregion Accessors

    //#region Operations

    /**
     * Play the playable element.
     */
    public play(): void
    {
    }

    /**
     * Pause the playable element.
     */
    public pause(): void
    {
    }

    //#endregion Operations

    //#region Handlers

    /**
     * Listen playable ready event.
     * @param callback callback to call when event is emited
     */
    public listenIsReadyEvent(callback: Function): void
    {
    }

    /**
     * Unlisten playable ready event.
     * @param callback callback to remove
     */
    public unlistenIsReadyEvent(callback: Function): void
    {
    }

    /**
     * Listen to seeked event
     * @param callback callback to call
     */
    public listenToSeekedEvent(callback: Function): void
    {
    }

    /**
     * Unlisten to seeked event
     * @param callback callback to remove
     */
    public unlistenToSeekedEvent(callback: Function): void
    {
    }

    /**
     * Listen to ended event
     * @param callback  callback to call when event is emitted
     */
    public listenToEndedEvent(callback: Function): void
    {
    }

    /**
     * Unlisten to ended event.
     * @param callback callback to remove
     */
    public unlistenToEndedEvent(callback: Function): void
    {
    }

    //#endregion Handlers
}

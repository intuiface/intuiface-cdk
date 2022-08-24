export interface PlayableFacade {
    //#region Accessors

    /**
     * Get current time of the playable element.
     */
    getCurrentTime(): number;

    /**
     * Set current time to the playable element.
     * @param currentTime current time to set
     */
    setCurrentTime(currentTime: number): void;

    /**
     * Get duration of the playable element.
     */
    getDuration(): number;

    /**
     * Return true if playable element is paused.
     */
    isPaused(): boolean;

    //#endregion Accessors

    //#region Operations

    /**
     * Play the playable element.
     */
    play(): void;

    /**
     * Pause the playable element.
     */
    pause(): void;

    //#endregion Operations

    //#region Handlers

    /**
     * Listen playable ready event.
     * @param callback callback to call when event is emited
     */
    listenIsReadyEvent(callback: Function): void;

    /**
     * Unlisten playable ready event.
     * @param callback callback to remove
     */
    unlistenIsReadyEvent(callback: Function): void;

    /**
     * Listen to ended event
     * @param callback  callback to call when event is emitted
     */
    listenToEndedEvent(callback: Function): void;

    /**
     * Unlisten to ended event.
     * @param callback callback to remove
     */
    unlistenToEndedEvent(callback: Function): void;

    //#endregion Handlers
}

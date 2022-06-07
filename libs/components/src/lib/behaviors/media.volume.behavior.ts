import { PlayableMediaFacade } from "./playable-media.facade";

/**
 * Behavior to manage the media volume (audio, video, ...).
 */
export class MediaVolumeBehavior
{
    //#region Fields

    /**
     * Media with volume element 
     */
    public mediaVolumeElement: PlayableMediaFacade | undefined = undefined;

    //#endregion Fields

    //#region Properties

    /**
     * Current volume.
     */
    public _volume = 0;

    /**
     * Show volume.
     */
    public showVolume: boolean = false ;

    //#endregion Properties

    //#region Actions

    /**
     * Set volume of the media.
     */
    public setVolume(volume: number): void
    {
    }

    //#endregion Actions

    //#region Triggers

    /**
     * Volume changed
     */
    public raiseVolumeChanged(): void { }

    //#endregion Triggers
}

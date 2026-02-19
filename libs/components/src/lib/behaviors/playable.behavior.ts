import { Time } from '@intuiface/core';
import { PlayableFacade } from './playable.facade';

/**
 * Playable states
 */
export enum EPlayableState
{
    STOPPED = 'Stopped',
    PAUSED = 'Paused',
    PLAYING = 'Playing'
}

/**
 * Poster Type
 */
export enum EShowControlsBehavior
{
    Temporary = 'Temporary',
    Always = 'Always'
}

/**
 * Behavior to manage a playable media.
 */
export class PlayableBehavior
{
    //#region Properties

    /**
     * State.
     */
    public playableState = EPlayableState.STOPPED;

    /**
     * Current time.
     */
    public currentTime: Time = Time.ZERO;

    /**
     * Duration.
     */
    public duration: Time = Time.ONE;

    /**
     * Speed.
     */
    public speed = 1;

    /**
     * Autoplay.
     */
    public isAutoplay = false;

    /**
     * AutoplayOnRewind.
     */
    public isAutoplayOnRewind = true;

    /**
     * Loop.
     */
    public isLoop = false;

    /**
     * Show controls.
     */
    public showControls = true;

    /**
     * Show controls behavior.
     */
    public showControlsBehavior = EShowControlsBehavior.Temporary;

    /**
     * Playing is activity
     */
    public playingIsActivity = true;

    /**
     * Pause when hidden
     */
    public pauseWhenHidden = true;

    //#endregion Properties

    //#region Triggers

    /**
     * Is played
     */
    public raisePlayRequested(): void { }

    /**
     * Is paused
     */
    public raisePauseRequested(): void { }

    /**
     * Is rewound
     */
    public raiseRewindRequested(): void { }

    /**
     * Is looped
     */
    public raiseLooped(): void { }

    /**
     * Time Changes
     */
    public raiseTimeReached(time: Time): void { }

    /**
     * Timeline moved
     */
    public raiseTimelineMoved(): void { }

    /**
     * Timeline moved
     */
    public raiseEnded(): void { }

    //#endregion Triggers

    //#region Actions

    /**
     * Action to play the media.
     */
    public play(): void
    {
    }

    /**
     * Action to stop the media.
     */
    public stop(): void
    {
    }

    /**
     * Pause the media.
     */
    public pause(): void
    {
    }

    /**
     * Toggle Play/Pause the media.
     */
    public togglePlayPause(): void
    {
    }

    /**
     * Rewind the media.
     */
    public rewind(): void
    {
    }

    /**
     * Set current time in the media.
     */
    public setTimeline(position: Time
    ): void
    {
    }

    /**
     * Turn on autoplay.
     */
    public turnOnAutoplay(): void
    {
    }

    /**
     * Turn off autoplay.
     */
    public turnOffAutoplay(): void
    {
    }

    /**
     * Turn on loop.
     */
    public turnOnLoop(): void
    {
    }

    /**
     * Turn off loop.
     */
    public turnOffLoop(): void
    {
    }

    //#endregion Actions

    //#region Fields

    /**
     * Playable element accessors.
     */
    public playableElement: PlayableFacade | undefined;

    //#endregion Fields
}

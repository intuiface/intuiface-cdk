import { PlayableMediaFacade } from './playable-media.facade';

/**
 * Behavior to manage the timeline on media element (audio, video, ...).
 */
export class MediaTimelineBehavior {

    /**
     * Show timeline.
     */
    public showTimeline: boolean = false;

    /**
     * Timeline moved
     */
    public raiseTimelineMoved(): void { }


    /**
     * Media with timeline element accessors.
     */
    public mediaTimelineElement: PlayableMediaFacade | undefined = undefined;
}

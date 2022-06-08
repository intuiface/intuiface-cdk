import { Color as ColorType } from '@intuiface/core';

/**
 * Background types
 */
export enum EBackgroundType
    {
    Color = 'Color',
    Image = 'Image',
    Video = 'Video',
    None = 'None'
}

/**
 * Background behavior: can be a color, an image or a video.
 */
export class BackgroundBehavior {

    //#region Properties

    /**
     * BackgroundType.
     */
    public backgroundType = EBackgroundType.Color;

    /**
     * BackgroundColor.
     */
    public backgroundColor = ColorType.Black;

    /**
     * BackgroundImage.
     */
    public backgroundImage = 'assets/defaultAssets/DefaultImage.png';

    /**
     * BackgroundVideo.
     */
    public backgroundVideo = 'assets/defaultAssets/DefaultVideo.mp4';

    /**
     * Outline color.
     */
    public outlineColor = ColorType.Black;

    /**
     * Outline thickness.
     */
    public outlineThickness = 0;

    /**
     * Radius
     */
    public radius = 0;

    /**
     * Box shadow.
     */
    public displayShadow = false;

    //#endregion Properties

    //#region Actions

    /**
     * Action to change the background color.
     * @param color new background color to set
     */
    public changeBackgroundColor(color: ColorType): void
    {
    }

    /**
     * Action to change the outline color.
     * @param color new outline color to set
     */
    public changeOutlineColor(color: ColorType): void
    {
    }

    /**
     * Action to change the outline thickness.
     * @param thickness new outline thickness to set
     */
    public changeOutlineThickness(thickness: number): void
    {
    }

    //#endregion Actions
}

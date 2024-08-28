import { Watchable } from '../base/watchable';

/**
 * Css units
 */
export enum CssUnits {
    Pixel = 'px',
    Percent = '%',
    Point = 'pt',
    Em = 'em',
    Rem = 'rem'
}

/**
 * Translate direction
 */
export enum ETranslateDirection {
    Both = 'Both',
    Horizontal = 'Horizontal',
    Vertical = 'Vertical'
}

/**
 * Base class for all Container
 */
export class ElementContainer extends Watchable
{
    //#region Fields

    /**
     * Value of the CSS top property
     */
    public top: number;
    /**
     * Unit for the CSS top property
     */
    public topUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS bottom property
     */
    public bottom: number;
    /**
     * Unit for the CSS top property
     */
    public bottomUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS left property
     */
    public left: number;
    /**
     * Unit for the CSS left property
     */
    public leftUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS right property
     */
    public right: number;
    /**
     * Unit for the CSS right property
     */
    public rightUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS zIndex property
     */
    public zIndex: number;

    /**
     * Value of the CSS width property
     */
    public width: number;
    /**
     * Unit for the CSS width property
     */
    public widthUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS height property
     */
    public height: number;
    /**
     * Unit for the CSS height property
     */
    public heightUnit: CssUnits | string = CssUnits.Pixel;

    /**
     * Value of the CSS margin property
     */
    public margin: string;

    /**
     * Value for the orientation of this element
     */
    public orientation: number;

    /**
     * Value for the CSS transform property
     */
    public transform: any;

    /**
     * Value of the CSS position property
     */
    public position: string = '';

    /**
     * Value for the CSS transition property
     */
    public transition: string = '';

    /**
     * Value for the CSS transform origin property
     */
    public transformOrigin: string = 'center';
    //#endregion Fields

    //#region Effect
    //#region Properties

    /**
     * Opacity.
     */
    public opacity: number = 1;

    /**
     * Blur.
     */
    public blur: number = 0;

    /**
     * Sepia.
     */
    public sepia: number = 0;

    /**
     * Hue Rotation.
     */
    public hueRotation: number = 0;

    /**
     * Brightness.
     */
    public brightness: number = 100;

    /**
     * Backface visibility
     * Useful for carousel container
     */
    public backfaceVisibility: string = 'visible';

    /**
     * Item Shadow
     * Useful for carousel container
     */
    public itemShadow: string = 'unset';

    //#endregion Properties

    //#region Actions

    /**
     * Action to set opacity.
     */
    public setOpacity(opacity: number): void {}

    //#endregion Actions
    //#endregion Effect

    //#region Visibility
    //#region Properties

    /**
     * Is Visible property of the current container.
     */
    public isShown: boolean = true;

    /**
     * Indicates whether or not the current container is displayed on the screen
     * Takes into account both isShown and isShownByInheritance properties
     */
    public isDisplayed = true;


    //#endregion Properties


    //#endregion Visibility

    //#region Touches
    //#region Properties

    /**
     * Is Visible to Interactivity
     */
    public isVisibleToInteractivity: boolean = true;

    //#endregion Properties

    //#region Actions

    /**
     * Action to toggle the isVisibleToInteractivity property
     */
    public toggleVisibleToInteractivity(): void {}

    /**
     * Function to enable the isVisibleToInteractivity property
     */
    public enableVisibleToInteractivity(): void {}

    /**
     * Function to disable the isVisibleToInteractivity property
     */
    public disableVisibleToInteractivity(): void {}

    //#endregion Actions
    //#endregion Touches
}

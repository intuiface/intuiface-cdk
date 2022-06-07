import { IFont } from '@intuiface/core';
/**
 * Horizontal alignment values for a text.
 */
export enum ETextHorizontalAlignment
    {
    LEFT = 'Left',
    CENTER = 'Center',
    RIGHT = 'Right'
}

/**
 * Vertical alignment values for a text.
 */
export enum ETextVerticalAlignment
    {
    TOP = 'Top',
    CENTER = 'Center',
    BOTTOM = 'Bottom'
}

/**
 * Overflow values for a text.
 */
export enum ETextOverflow
    {
    CLIP = 'Clip',
    ELLIPSIS = 'Ellipsis',
    SCROLLBAR = 'Scrollbars'
}

/**
 * Behavior to manage a text.
 */
export class TextBehavior {
    //#region Properties

    /**
     * Text.
     */
    public text;

    /**
     * Font color.
     */
    public fontColor;

    /**
     * Font size.
     */
    public fontSize;

    /**
     * Font.
     */
    public font: IFont;

    /**
     * Minimum Font size.
     */
    public minFontSize;

    /**
     * Indicates text is bold.
     */
    public isBold;

    /**
     * Indicates text is italic.
     */
    public isItalic;

    /**
     * Indicates text is underline.
     */
    public isUnderline;

    /**
     * Indicates horizontal text alignment.
     */
    public horizontalAlignment;

    /**
     * Indicates vertical text alignment.
     */
    public verticalAlignment;

    /**
     * Indicates line is wrap.
     */
    public isLineWrap;

    /**
     * Indicates text overflow.
     */
    public overflow;

    /**
     * Indicates text adapt font size.
     */
    public isAdaptFontSize;

    /**
     * Text margin.
     */
    public textMargin: number = 0;

    //#endregion Properties

    //#region Internal Properties

    /**
     * Font size computed after font size algorithm
     */
    public adaptedFontSize: number;

    /**
     * Text height computed after font size algorithm
     */
    public heightAfterAdaptFontSize: number;

    //#endregion Internal Properties

    //#region Actions

    /**
     * Action to change the font color.
     * @param color new font color to set
     */
    public changeFontColor(color: string): void
    {
    }

    /**
     * Action to change the font size.
     * @param size new font size to set
     */
    public changeFontSize(size: number): void
    {
    }

    /**
     * Action to change the text.
     * @param text new text to set
     */
    public changeText(text: string): void {
    }

    /**
     * Action to change the style.
     * @param isBold true to bold
     * @param isItalic true to italic
     * @param isUnderline true to underline
     * @param isLineWrap true to line wrap
     */
    public changeFontStyle(isBold: boolean, isItalic: boolean, isUnderline: boolean, isLineWrap: boolean): void {
    }

    /**
     * Action to change the font.
     * @param family
     * @param stretch
     * @param style
     * @param weight
     */
    public changeFont(value: unknown): void
    {
    }

    //#endregion Actions
}

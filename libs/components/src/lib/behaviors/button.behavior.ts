import { Color } from '@intuiface/core';

/**
 * Behavior to manage a text.
 */
export class ButtonBehavior {
    //#region Properties

    /**
     * Enable.
     */
    public enable = true;

    /**
     * Pressed color.
     */
    public pressedColor = '#80000000';

    /**
     * Is Pressed.
     */
    public isPressed: boolean = false;

    /**
     * Text margin.
     */
    public textMargin: number = 0;

    //#endregion Properties

    //#region Triggers

    /**
     * Trigger when button is pressed
     */
    public raiseButtonPressed(): void { }

    /**
     * Trigger when button is pressed
     */
    public raiseButtonReleased(): void { }

    //#endregion Triggers

    //#region Actions

    /**
     * Action to disable the button.
     */
    public disableButton(): void {
    }

    /**
     * Action to enable the button.
     */
    public enableButton(): void {
    }

    /**
     * Action to simulate a single tap on the button.
     */
    public simulateTap(): void {
    }

    //#endregion Actions
}

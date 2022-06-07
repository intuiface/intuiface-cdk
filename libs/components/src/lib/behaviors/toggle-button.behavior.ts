import { Watchable } from '@intuiface/core';

/**
 * Behavior to manage a text.
 */
export class ToggleButtonBehavior
{
    //#region Properties

    /**
     * Is Checked
     */
    public isChecked: boolean = false;

    /**
     * Checked color.
     */
    public checkedColor = '#83D3F6FF';


    /**
     * Logic Group Name
     */
    public logicGroupName: string = null;

    /**
     * Allow to uncheck
     */
    public allowToUncheck: boolean = false;

    /**
     * Boolean to know if the toggle button is member of toggle set
     */
    public isMemberOfToggleSet: boolean = false;

    //#endregion Properties

    //#region Triggers

    /**
     * Trigger when button is checked
     */
    public raiseButtonChecked(): void { }

    /**
     * Trigger when button is unchecked
     */
    public raiseButtonUnchecked(): void { }


    //#endregion Triggers

    //#region Actions

    /**
     * Action to check the button
     */
    public check(): void
    {
    }

    /**
     * Action to unckeck the button
     */
    public uncheck(): void
    {
    }

    /**
     * Action to toggle the button.
     */
    public toggleCheckUncheck(): void
    {
    }

    //#endregion Actions
}

export interface ToggleButtonBehavior extends Watchable {}

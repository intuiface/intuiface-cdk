import { Action, Property, Trigger, Parameter, Resource } from '@intuiface/core';


/**
 * Loading states
 */
export enum LoadingState {
    Unloaded = 'Unloaded',
    Loaded = 'Loaded',
    Failed = 'Failed'
}

/**
 * Behavior to manage a source.
 */
export class SourceBehavior
{
    //#region Properties

    /**
     * Source of the resource.
     */
    public source = 'assets/defaultAssets/DefaultImage.png';

    //#endregion Properties

    //#region Triggers

    /**
     * Source changed event.
     */
    public raiseSourceChanged(): void { }

    //#endregion Triggers

    //#region Actions

    /**
     * Action to change the source.
     * @param source source to set
     */
    public changeSource(source: string): void
    {
    }

    //#endregion Actions

    //#region Operations

    /**
     * Get source relativepath
     */
    public getSourceRelativePath(): string
    {
        return this.source;
    }
    //#endregion Operations
}

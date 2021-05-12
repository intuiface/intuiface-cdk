/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/**
 * Options when use inject decorator.
 */
export interface IInjectOptions
{
    /**
     * Behaviors to inject to decorated element.
     */
    behaviors: Function[];
}

/**
 * Options when use inject decorator.
 */
export interface IElementOptions extends IInjectOptions
{
    /**
     * Name used for serialization and identification
     */
    name: string;

    /**
     * Name displayed in Composer.
     */
    displayName?: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;
}

/**
 * Options when use inject decorator.
 */
export interface ICollectionOptions extends IInjectOptions
{
    /**
     * Name used for serialization and identification
     */
    name: string;

    /**
     * Constructor of the container to use.
     */
    container?: Function;

    /**
     * Name displayed in Composer.
     */
    displayName?: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;
}

/**
 * Asset decorator to add metadatas to asset.
 * @param options of the asset (display name, description, ...)
 */
export function Asset(options?: IElementOptions): (cls: any) => any
{
    return (ctor: Function) =>
    {};
}

/**
 * Collection decorator to add metadatas to collection.
 * @param options of the collection (display name, description, ...)
 */
export function Collection(options?: ICollectionOptions): (cls: any) => any
{
    return (ctor: Function) =>
    {};
}

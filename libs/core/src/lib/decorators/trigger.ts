/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';

/**
 * Options when use trigger decorator.
 */
export interface ITriggerOptions
{
    /**
     * Name used for serialization and identification
     */
    name: string;

    /**
     * Name displayed in Composer.
     */
    displayName: string;

    /**
     * Description displayed in Composer.
     */
    description?: string;

    /**
     * Indicates whether this trigger needs to propagate to other elements
     */
    isPropagating?: boolean;

    /**
     * Propagation mode
     */
    mode?: string;
}

/**
 * Trigger decorator to add metadatas to trigger.
 * @param options options of the trigger (display name, description, ...)
 */
export function Trigger(options?: ITriggerOptions)
{
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void =>
    {
        let properties = {};
        if (globalThis.intuiface_ifd_params[propertyKey]) {
            properties = globalThis.intuiface_ifd_params[propertyKey];
        }
        globalThis.intuiface_ifd_triggers[propertyKey] = {
            id: propertyKey,
            title: options.displayName,
            properties: properties
        }
    };
}

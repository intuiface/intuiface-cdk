/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Watchable } from '../base/watchable';
import { IntuifaceCollection } from '../elements/collection';
import { ElementContainer } from '../elements/container';
import { IntuifaceElement } from '../elements/element';

// Registries intuiface-cli reads to write the descriptor (.ifd) of an item. The CLI defines the globals before loading the
// item; the Player uses its own core and never defines them, so these functions do nothing at runtime.

/**
 * Title, description and category of an element, as `@Asset` or `@Collection` declares them.
 * The descriptor takes those of the class of the item, whatever the order the decorators run in.
 *
 * @internal
 */
export interface IElementDetails
{
    displayName?: string;
    description?: string;
    category?: string;
}

/**
 * Record the class of an element (`@Asset`, `@Collection`) and its details.
 * @param name name of the element (`options.name`)
 * @param ctor class of the element
 * @param details title, description and category of the element
 *
 * @internal
 */
export function registerElementClass(name: string, ctor: Function, details: IElementDetails): void
{
    const globalThisAny = globalThis as any;
    if (globalThisAny.intuiface_ifd_element_classes != null)
    {
        globalThisAny.intuiface_ifd_element_classes[name] = ctor;
    }
    if (globalThisAny.intuiface_ifd_element_details != null)
    {
        globalThisAny.intuiface_ifd_element_details[name] = details;
    }
}

/**
 * Record a class a property uses as `type` or `itemType`, for the descriptor to describe it under its name (the `$ref`
 * of the property), with or without `@Asset`.
 *
 * Only a class that extends {@link Watchable} is recorded, as the Player can only watch the properties of a Watchable.
 * The types of the core are not: `Font`, `Time` or `Resource` (not Watchable), and `IntuifaceElement`,
 * `ElementContainer` or `IntuifaceCollection`.
 * @param type `type` or `itemType` of the property
 *
 * @internal
 */
export function registerReferencedClass(type: unknown): void
{
    const referencedClasses = (globalThis as any).intuiface_ifd_referenced_classes;
    if (referencedClasses == null || typeof type !== 'function' || !(type.prototype instanceof Watchable))
    {
        return;
    }

    const coreClasses: Function[] = [IntuifaceElement, ElementContainer, IntuifaceCollection];
    if (!coreClasses.includes(type))
    {
        referencedClasses[type.name] = type;
    }
}

import { Watchable } from '../base/watchable';
import { ElementContainer } from './container';

/**
 * An `IntuifaceElement` represents the base of any kind of element that compose an Intuiface experience: asset, collection, interface asset, layer, scene, experience...
 *
 * All this elements extends `IntuifaceElement` and use the appropriate decorator to make it usable in the experience, such as {@link Asset | `@Asset`} or {@link Collection | `@Collection`}.
 */
export class IntuifaceElement extends Watchable
{
    /**
     * Container of this element
     */
    public container: ElementContainer;

    /**
     * Parent of this element.
     */
    public parent: IntuifaceElement | null;

    /**
     * Name of the element.
     */
    public name = '';

    /**
     * Initialize default value of each property.
     * @param configuration : configuration
     */
    public initialize(configuration?: any): void {
    }

    /**
     * Dispose the element.
     */
    public dispose(): void{}
}

import { Watchable } from '../base/watchable';
import { ElementContainer } from './container';

/**
 * An `IntuifaceElement` represents the base of any kind of element that compose an Intuiface experience: asset, collection, interface asset, layer, scene, experience...
 *
 * All these elements extend `IntuifaceElement` and use the appropriate decorator to make them usable in the experience, such as {@link Asset | `@Asset`} or {@link Collection | `@Collection`}.
 * 
 * Each element or collection has the same life cycle :\
 * 1 - Constructor : Can be use to declare properties, set default values.\
 * 2 - Initialize : Initialize the element with the configuration. The configuration contains the values of each properties defined in Composer.\
 * 3 - Reset (when requested by Composer): Restore the element's values and call its before/after reset methods.\
 * 4 - Dispose : Dispose the element, remove all listeners, clear memory.
 * 
 * It is important to call the `super()` in each method to ensure the correct behavior of the element.
 *
 * **Advanced usage:** See [Handle resets in an Interface Asset](/docs/reset.md)
 * to choose which values reset and stop work such as timers when a reset occurs.
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
     * Reset this element to the values set in Composer or its starting values.
     * Calls `beforeResetFromConfiguration()` and `afterResetFromConfiguration()` so your code can
     * stop pending work and update other values. Bindings between properties continue to work.
     * @param resetChildren Also reset child elements. Defaults to false.
     */
    public resetFromConfiguration(resetChildren: boolean = false): void {}

    /**
     * Called before this element's values reset. Use it to stop timers, downloads or other work started by your code.
     * Always call `super.beforeResetFromConfiguration()` when overriding this method.
     * Keep variables needed after the reset with `@ResetValue({ enabled: false })`.
     * Player does not wait for asynchronous work, such as downloads, started in this method.
     */
    protected beforeResetFromConfiguration(): void {}

    /**
     * Called after this element and any child elements included in the reset have reset.
     * Use it to update values your code manages, such as a status message.
     * Always call `super.afterResetFromConfiguration()` when overriding this method.
     * Player does not wait for asynchronous work, such as downloads, started in this method.
     */
    protected afterResetFromConfiguration(): void {}

    /**
     * Dispose the element.
     */
    public dispose(): void{}
}

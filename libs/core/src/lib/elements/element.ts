import { Watchable } from "../base/watchable";
import { ElementContainer } from "./container";

/**
 * Element
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

import { Watchable } from "../base/watchable";
import { ElementContainer } from "./container";

/**
 * Element
 */
export class IntuifaceElement extends Watchable
{
    public container: ElementContainer;

    /**
     * Init
     * @param configuration 
     */
    public initialize(configuration?: any): void {
    }
}

import { ElementContainer } from './container';
import { IntuifaceElement } from './element';

/**
 * Intuiface Collection
 */
export class IntuifaceCollection<T extends ElementContainer> extends IntuifaceElement
{
    public visibleItems: IntuifaceElement[] = [];
}

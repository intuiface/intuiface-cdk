/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import { ElementComponent } from './element.component';
import { ElementContainer, IntuifaceCollection, IntuifaceElement } from '@intuiface/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Collection component
 */
@Component({
    selector: 'intuiface-collection',
    template: '',
    styles: ['']
})
export class CollectionComponent<T extends IntuifaceCollection<ElementContainer>>
    extends ElementComponent<T>
{
    /**
     * Constructor
     * @param domSanitizer 
     * @param elementReference 
     * @param changeDetector 
     * @param renderer 
     */
    public constructor(
        protected domSanitizer: DomSanitizer,
        elementReference: ElementRef,
        changeDetector: ChangeDetectorRef,
        protected renderer: Renderer2
    )
    {
        super(elementReference);
    }

    /**
     * On collection visible items changed
     */
    protected onCollectionVisibleItemsChanged(): void
    {
    }

    /**
     * Track by fn
     * @param index
     * @param item
     * @returns
     */
    public trackByFn(index: number, item: IntuifaceElement): number
    {
        return (item as any)?.intuifaceId;
    }
}

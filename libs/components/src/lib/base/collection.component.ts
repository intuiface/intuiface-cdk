/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef } from '@angular/core';
import { ElementComponent } from './element.component';
import { ElementContainer, IntuifaceCollection, IntuifaceElement } from '@intuiface/core';
import { SelectionService } from '../services/selection.service';
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
     * @param selectionService 
     * @param domSanitizer 
     * @param elementReference 
     */
    public constructor(
        protected selectionService: SelectionService,
        protected domSanitizer: DomSanitizer,
        protected elementReference: ElementRef
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
        return (item as any)?.id;
    }
}

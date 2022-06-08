import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IntuifaceElement } from '@intuiface/core';
import { CollectionBehavior } from '../behaviors/collectionBehaviors/collection.behavior';
import { SelectionService } from '../services/selection.service';

/**
 * Component for element's container.
 */
@Component({
    selector: 'intuiface-element-container',
    template: '',
    styles: ['']
})
export class ElementContainerComponent {
    //#region Inputs

    /**
     * Intuiface element.
     */
    @Input()
    public element: IntuifaceElement;

    /**
     * Asset is in collection.
     */
    @Input()
    public parentCollection: CollectionBehavior = null;

    /**
     * True if the element is selected by user.
     */
    @Input()
    public isSelected: boolean = false;

    //#endregion Inputs

    //#region Outputs

    /**
     * Clicked event.
     */
    @Output()
    public clicked = new EventEmitter();

    //#endregion Outputs

    //#region ViewChild

    @ViewChild('container')
    public container: ElementRef;

    //#endregion ViewChild

    //#region Fields

    /**
     * The parent collection item width
     */
    public parentItemWidth;
    /**
     * The parent collection item height
     */
    public parentItemHeight;

    /**
     * Current compouted opacity.
     */
    public computedOpacity = 1;

    //#endregion Fields

    //#region Life Cycle

    public constructor(protected selectionService: SelectionService,
                       protected sanitizer: DomSanitizer,
                       protected changeDetector: ChangeDetectorRef) { }


}

import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IntuifaceElement } from '@intuiface/core';
import { CollectionBehavior } from '../behaviors/collection-behaviors/collection.behavior';

/**
 * Component for element's container.
 */
@Component({
    selector: 'intuiface-element-container',
    template: '',
    styles: [''],
    standalone: true
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

    /**
     * Constructor
     * @param sanitizer 
     * @param changeDetector 
     * @param elementReference 
     * @param renderer 
     */
    public constructor(protected sanitizer: DomSanitizer,
                       protected changeDetector: ChangeDetectorRef,
                       protected elementReference: ElementRef,
                       protected renderer: Renderer2) { }


}

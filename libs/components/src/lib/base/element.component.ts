/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef, Input } from '@angular/core';
import { IntuifaceElement } from '@intuiface/core';

/**
 * Base element view component
 * 
 */
@Component({
    selector: 'intuiface-cdk',
    template: '',
    styles: ['']
})
export class ElementComponent<T extends IntuifaceElement>
{
    
    @Input()
    public element: T;

    public constructor(protected elementReference: ElementRef)
    {

    }
}

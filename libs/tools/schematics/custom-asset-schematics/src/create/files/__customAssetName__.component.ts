import { Component, ElementRef } from '@angular/core';
import { IntuifaceComponent } from '@intuiface/components';
<% if (isCollection) { %>import { <%= classify(customAssetName) %> } from './<%= dasherize(customAssetName) %>.collection';
import { CollectionComponent, SelectionService } from '@intuiface/components';
import { DomSanitizer } from '@angular/platform-browser';
<% } else { %>import { <%= classify(customAssetName) %> } from './<%= dasherize(customAssetName) %>.asset';
import { ElementComponent} from '@intuiface/components';
<% } %>

@IntuifaceComponent({
    model: <%= classify(customAssetName) %>
})
@Component({
    selector: 'app-<%= dasherize(customAssetName) %>',
    templateUrl: './<%= dasherize(customAssetName) %>.component.html',
    styleUrls: ['./<%= dasherize(customAssetName) %>.component.scss']
})
<% if (isCollection) { %>
export class <%= classify(customAssetName) %>Component extends CollectionComponent<<%= classify(customAssetName) %>> {
    public constructor(
        protected selectionService: SelectionService,
        protected domSanitizer: DomSanitizer,
        protected elementReference: ElementRef
    ) {
        super(selectionService, domSanitizer, elementReference);
    }
<% } else { %>
export class <%= classify(customAssetName) %>Component extends ElementComponent<<%= classify(customAssetName) %>> {
    public constructor(protected elementReference: ElementRef) {
        super(elementReference);
    }
<% } %>
    
    /**
     * You Stuff here (you can use ngOnInit, ngAfterViewInit, ngOnDestroy ...etc)
     */
}

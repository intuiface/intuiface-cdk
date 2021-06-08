import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  <%= classify(customAssetName) %>Component } from './<%= dasherize(customAssetName) %>.component';
import { ComponentsModule } from '@intuiface/components';

@NgModule({
    declarations: [
        <%= classify(customAssetName) %>Component
    ],
    imports: [
        CommonModule,
        ComponentsModule
    ],
    exports: [<%= classify(customAssetName) %>Component]
})
export class <%= classify(customAssetName) %>Module { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementContainerComponent } from './base/element-container.component';

/**
 * NG Module
 */
@NgModule({
    declarations: [ElementContainerComponent],
    imports: [
        CommonModule
    ],
    exports: [ElementContainerComponent]
})
export class ComponentsModule {}

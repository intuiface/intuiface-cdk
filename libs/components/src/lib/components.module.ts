import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ElementContainerComponent } from './base/element-container.component';

@NgModule({
  declarations: [ElementContainerComponent],
  imports: [
    CommonModule
  ],
  exports: [ElementContainerComponent]
})
export class ComponentsModule {}

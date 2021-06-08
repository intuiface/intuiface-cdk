import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@intuiface/core';
import { ElementContainerComponent } from './base/element-container.component';

@NgModule({
  declarations: [ElementContainerComponent],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [ElementContainerComponent]
})
export class ComponentsModule {}

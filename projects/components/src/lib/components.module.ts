import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { InputComponent } from './controls/input/input.component';
import { SliderComponent } from './controls/slider/slider.component';
import { ResizeDirective } from './directives/resize.directive';



@NgModule({
  declarations: [
    ComponentsComponent,
    InputComponent,
    SliderComponent,
    ResizeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComponentsComponent,
    InputComponent,
    SliderComponent,
    ResizeDirective
  ]
})
export class ComponentsModule { }

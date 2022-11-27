import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { InputComponent } from './controls/input/input.component';
import { SliderComponent } from './controls/slider/slider.component';
import { ResizeDirective } from './directives/resize.directive';
import { RaButtonComponent } from './ra-button/ra-button.component';



@NgModule({
  declarations: [
    ComponentsComponent,
    InputComponent,
    SliderComponent,
    ResizeDirective,
    RaButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComponentsComponent,
    InputComponent,
    SliderComponent,
    ResizeDirective,
    RaButtonComponent
  ]
})
export class ComponentsModule { }

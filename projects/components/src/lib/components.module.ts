import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { InputComponent } from './controls/input/input.component';
import { SliderComponent } from './controls/slider/slider.component';



@NgModule({
  declarations: [
    ComponentsComponent,
    InputComponent,
    SliderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComponentsComponent,
    InputComponent,
    SliderComponent
  ]
})
export class ComponentsModule { }

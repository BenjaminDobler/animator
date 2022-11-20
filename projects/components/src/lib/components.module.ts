import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsComponent } from './components.component';
import { InputComponent } from './controls/input/input.component';



@NgModule({
  declarations: [
    ComponentsComponent,
    InputComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ComponentsComponent,
    InputComponent
  ]
})
export class ComponentsModule { }

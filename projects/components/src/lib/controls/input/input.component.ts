import { Component, Input } from '@angular/core';

@Component({
  selector: 'ra-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  @Input()
  label: string = '';

  @Input()
  value: any;

  @Input()
  type: 'color' | 'number' | 'text' = 'text';

}

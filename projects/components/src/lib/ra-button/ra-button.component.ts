import { Component, Input } from '@angular/core';

@Component({
  selector: 'ra-button',
  templateUrl: './ra-button.component.html',
  styleUrls: ['./ra-button.component.scss']
})
export class RaButtonComponent {

  @Input()
  label = '';
}

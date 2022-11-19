import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[containerHost]',
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
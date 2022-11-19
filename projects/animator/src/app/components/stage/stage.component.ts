import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fromEvent, takeUntil } from 'rxjs';
import { AnimatableElement } from '../../model/Timeline';
import { ComponentHostDirective } from '../helper/component-host.directive';

@Component({
    selector: 'stage',
    templateUrl: './stage.component.html',
    styleUrls: ['./stage.component.scss'],
})
export class StageComponent implements OnInit, AfterViewInit {
    @Input()
    public animatebleElements: BehaviorSubject<AnimatableElement[]>;

    @ViewChild(ComponentHostDirective, {static: true}) componentHost!: ComponentHostDirective;


    constructor(public el: ElementRef) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {        
      console.log('on init');
        this.animatebleElements.subscribe((animatableElements: AnimatableElement[]) => {
          console.log('animatable elements ', animatableElements);
          this.componentHost.viewContainerRef.clear();

            animatableElements.forEach((animatableElement: AnimatableElement) => {
                console.log('add ', animatableElement.componentClass)
                const componentRef = this.componentHost.viewContainerRef.createComponent<any>(animatableElement.componentClass);
                componentRef.instance.animatebleElement = animatableElement;
            });
        });
    }
}

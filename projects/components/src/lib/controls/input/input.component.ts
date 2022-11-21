import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { makeDraggable } from '../../utils/drag';

@Component({
    selector: 'ra-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements AfterViewInit {
    @Input()
    label: string = '';

    @Input()
    value: any;

    @Input()
    type: 'color' | 'number' | 'text' = 'text';

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        const drag = makeDraggable(this.el.nativeElement);
        let startVal = 0;
        drag.dragStart$.subscribe(() => {
            startVal = this.value;
        });
        drag.dragMove$.subscribe((data) => {
            this.value = startVal - data.deltaY;
        });
    }
}

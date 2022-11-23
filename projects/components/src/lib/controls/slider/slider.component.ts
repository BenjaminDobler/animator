import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { makeDraggable } from '../../utils/drag';

@Component({
    selector: 'ra-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements AfterViewInit {
    @ViewChild('thumb')
    private thumbRef: ElementRef;

    @Input()
    min = 0;

    @Input()
    max = 0;

    @Input()
    value = 0;

    trackRect;

    thumbPosition = 0;

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        this.trackRect = this.el.nativeElement.getBoundingClientRect();
        const drag = makeDraggable(this.thumbRef.nativeElement);
        let initialThumbPosition = 0;
        drag.dragStart$.subscribe((data) => {
            initialThumbPosition = this.thumbPosition;
        });
        drag.dragMove$.subscribe((data) => {
            let p = Math.max(0, initialThumbPosition + data.deltaX);
            p = Math.min(this.trackRect.width, p);
            this.thumbPosition = p;
        });
    }
}

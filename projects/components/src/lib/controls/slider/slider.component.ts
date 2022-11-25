import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';
import { makeDraggable } from '../../utils/drag';

@Component({
    selector: 'ra-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements AfterViewInit {
    @ViewChild('thumb')
    private thumbRef: ElementRef;

    @ViewChild('track')
    private trackRef: ElementRef;

    @Input()
    min = 0;

    @Input()
    max = 0;

    @Input()
    value = 0;

    @Output()
    change: EventEmitter<number> = new EventEmitter<number>();

    trackRect: {width: number, height: number};

    thumbPosition = 0;

    constructor(private el: ElementRef) {}

    ngOnChanges(change: SimpleChange) {
        console.log('Change', change);
    }

    updateThumbPosition() {
        const total = this.max - this.min;
        const totalValue = this.value - this.min;
        const percentage = totalValue / total;
        this.thumbPosition = this.trackRect.width * percentage;
        console.log('thumb position ', this.thumbPosition);
    }

    trackResized(size:{width: number, height: number}) {
      console.log('track resized ', size.width, size.height);
      this.trackRect = size;
      this.updateThumbPosition();
    }

    ngAfterViewInit(): void {
      console.log('view init');
        //this.trackRect = this.trackRef.nativeElement.getBoundingClientRect();
        // this.updateThumbPosition();
        const drag = makeDraggable(this.thumbRef.nativeElement);
        let initialThumbPosition = 0;
        drag.dragStart$.subscribe((data) => {
            // this.trackRect = this.trackRef.nativeElement.getBoundingClientRect();
            console.log('track ', this.trackRect.width);
            initialThumbPosition = this.thumbPosition;
        });
        drag.dragMove$.subscribe((data) => {

            let p = Math.max(0, initialThumbPosition + data.deltaX);
            p = Math.min(this.trackRect.width, p);
            this.thumbPosition = p;
            const percentage = this.thumbPosition / this.trackRect.width;
            this.value = this.min + percentage * (this.max - this.min);
            this.change.emit(this.value);
        });
    }
}

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ElementTimeline } from 'projects/animator/src/app/model/Timeline';
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'all-drag',
    templateUrl: './all-drag.component.html',
    styleUrls: ['./all-drag.component.scss'],
})
export class AllDragComponent implements OnInit, OnChanges {
    @Input()
    public pixelsPerMillisecond = 0.001;

    @Input()
    public minMax: any;

    @Input()
    public timeline: ElementTimeline;
      

    constructor(private el: ElementRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['minMax']) {
            const min = changes['minMax'].currentValue.min;
            const max = changes['minMax'].currentValue.max;
            console.log('MM', min, max);

            if (this.el?.nativeElement) {
                this.el.nativeElement.style.transform = 'translateX(' + min * this.pixelsPerMillisecond + 'px)';
                this.el.nativeElement.style.width = (max - min) * this.pixelsPerMillisecond + 'px';
            }
        }
    }

    ngAfterViewInit() {
      this.initDragDrop();
    }
    ngOnInit(): void {}

    initDragDrop() {
        console.log('start drag ', this.el);

        const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');

        let containerRect = this.el.nativeElement.parentNode.getBoundingClientRect();
        let rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
        let startX = rect.left - containerRect.left - 100;
        let startY = rect.top - containerRect.top;

        const keyframeElement = this.el.nativeElement as HTMLElement;

        const mouseUp$ = fromEvent(window, 'mouseup');
        let startMouseX = 0;
        let startMouseY = 0;

        let newTime = 0;

        let positionX = 0;
        let positionY = 0;


      let startTime = 0;
        const move$ = fromEvent(window, 'mousemove').pipe(
            takeUntil(mouseUp$),
            tap(
                (event: MouseEvent) => {
                    positionX = startX + event.clientX - startMouseX;
                    positionY = startY + event.clientY - startMouseY;

                    positionX = Math.max(0, positionX);

                    const time = positionX / this.pixelsPerMillisecond;

                    this.timeline.moveKeyframesBy.next(time-startTime);
                    startTime = time;
                  

                    keyframeElement.style.transform = `translate(${positionX}px)`;
                },
                () => {},
                () => {
                    // this.animatebleElement.x.next(positionX);
                    // this.animatebleElement.y.next(positionY);
                }
            )
        );

        mouseDown$
            .pipe(
                tap((event: MouseEvent) => {
                  console.log('start drag');
                    startTime = this.minMax.min;
                    containerRect = this.el.nativeElement.parentNode.getBoundingClientRect();
                    rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
                    startX = rect.left - containerRect.left;
                    startY = rect.top - containerRect.top;
                    startMouseX = event.clientX;
                    startMouseY = event.clientY;
                }),
                switchMap(() => move$)
            )
            .subscribe();
    }
}

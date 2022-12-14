import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, skip, takeUntil } from 'rxjs';
import { ElementTimeline, Timeline } from '../../model/Timeline';
import { TimelineService } from '../../services/timeline.service';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
    @ViewChild('scrubbar')
    private scrubbarElement: ElementRef;

    @Input()
    set timeline(value: Timeline) {
        this._timeline = value;

        this._timeline.position.pipe(skip(0)).subscribe((position) => {
            if (this.scrubbarElement) {
                const positionX = position * this.pixelsPerMillisecond;
                this.scrubbarElement.nativeElement.style.transform = `translate(${positionX}px`;
            }
        });
    }

    get timeline() {
        return this._timeline;
    }
    private _timeline: Timeline;

    @Input()
    public pixelsPerMillisecond = 0.1;

    constructor(private el: ElementRef, private timelineService: TimelineService) {}

    ngOnInit(): void {}

    play() {
        this.timelineService.gsapTimeline.play(0);
    }

    dragStart(event: MouseEvent) {
        const containerRect = this.el.nativeElement.getBoundingClientRect();
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        const startX = rect.left - containerRect.left - 100;
        const startY = rect.top - containerRect.top;

        const keyframeElement = event.currentTarget as HTMLElement;

        const mouseUp$ = fromEvent(window, 'mouseup');
        const startMouseX = event.clientX;
        const startMouseY = event.clientY;

        this.timelineService.gsapTimeline.pause(); // TODO not cool here!
        let newTime = 0;
        fromEvent(window, 'mousemove')
            .pipe(takeUntil(mouseUp$))
            .subscribe(
                (event: MouseEvent) => {
                    let positionX = startX + event.clientX - startMouseX;
                    // let positionY = startY + event.clientY - startMouseY;
                    positionX = Math.max(0, positionX);
                    keyframeElement.style.transform = `translate(${positionX}px`;

                    const scrubtime = positionX / this.pixelsPerMillisecond;
                    this.timeline.position.next(scrubtime);
                },
                () => {},
                () => {}
            );
    }
}

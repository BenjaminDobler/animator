import { AfterViewInit, ElementRef, Host, HostListener } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import { AnimatableElement, AnimatableHTMLElement, Timeline } from '../../../model/Timeline';
import { TimelineService } from '../../../services/timeline.service';
import { StageComponent } from '../../stage/stage.component';
import { TimelineComponent } from '../../timeline/timeline.component';

@Component({
    selector: 'animatable-element',
    templateUrl: './animatable-element.component.html',
    styleUrls: ['./animatable-element.component.scss'],
})
export class AnimatableElementComponent implements OnInit, AfterViewInit {
    @Input()
    set timeline(value: Timeline) {
        this._timeline = value;
    }

    get timeline() {
        return this._timeline;
    }
    private _timeline: Timeline;

    @Input()
    public pixelsPerMillisecond = 0.1;

    private _animatebleElement: AnimatableElement;
    public get animatebleElement(): AnimatableElement {
        return this._animatebleElement;
    }
    @Input()
    public set animatebleElement(value: AnimatableElement) {
        this._animatebleElement = value;
        const a = this._animatebleElement as AnimatableHTMLElement;

        combineLatest([a.x, a.y, a.opacity, a.rotation, a.width, a.height]).subscribe(([positionX, positionY, opacity, rotation, width, height]) => {
            this.el.nativeElement.style.transform = `translate(${positionX}px,${positionY}px) rotate(${rotation}deg)`;
            this.el.nativeElement.style.opacity = opacity;
            this.el.nativeElement.style.width = width + 'px';
            this.el.nativeElement.style.height = height + 'px';

        });

        a.borderRadius.subscribe((value) => {
            this.el.nativeElement.style.borderRadius = value + 'px';
        });

        a.backgroundColor.subscribe((value) => {
            this.el.nativeElement.style.backgroundColor = value;
        });

        this._animatebleElement.ref = this.el.nativeElement;
    }

    constructor(@Host() private parent: StageComponent, private el: ElementRef, private timelineService: TimelineService) {
        console.log('Parent', this.parent);
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.initDragDrop();
    }

    @HostListener('click', ['$event.target'])
    onClick(btn) {
        this.timelineService.setSelectedAnimatable(this.animatebleElement);
    }

    initDragDrop() {
        console.log('start drag ', this.el);

        const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');

        let containerRect = this.parent.el.nativeElement.getBoundingClientRect();
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

        const move$ = fromEvent(window, 'mousemove').pipe(
            takeUntil(mouseUp$),
            tap(
                (event: MouseEvent) => {
                    positionX = startX + event.clientX - startMouseX;
                    positionY = startY + event.clientY - startMouseY;

                    keyframeElement.style.transform = `translate(${positionX}px,${positionY}px)`;
                },
                () => {},
                () => {
                    const a = this.animatebleElement as AnimatableHTMLElement;
                    a.x.next(positionX);
                    a.y.next(positionY);
                }
            )
        );

        mouseDown$
            .pipe(
                tap((event: MouseEvent) => {
                    containerRect = this.parent.el.nativeElement.getBoundingClientRect();
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

    ngOnDestroy() {
        console.log('destroy');
    }
}

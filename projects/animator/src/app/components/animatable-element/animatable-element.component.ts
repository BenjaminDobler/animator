import { AfterViewInit, ElementRef, Host } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { fromEvent, switchMap, takeUntil, tap } from 'rxjs';
import { AnimatableElement, Timeline } from '../../model/Timeline';
import { StageComponent } from '../stage/stage.component';
import { TimelineComponent } from '../timeline/timeline.component';

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
    this._animatebleElement.ref = this.el.nativeElement;
  }

  constructor(@Host() private parent: StageComponent, private el: ElementRef) {
    console.log('Parent', this.parent);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.initDragDrop();
  }

  initDragDrop() {

    console.log('start drag ', this.el);

    const mouseDown$ = fromEvent(this.el.nativeElement, 'mousedown');

    let containerRect = this.parent.el.nativeElement.getBoundingClientRect();
    let rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    let startX = rect.left - containerRect.left - 100;
    let startY = rect.top - containerRect.top;

    const keyframeElement = this.el.nativeElement as HTMLElement;
    console.log(startX);

    const mouseUp$ = fromEvent(window, 'mouseup');
    let startMouseX = 0;
    let startMouseY = 0;

    let newTime = 0;

    let positionX = 0;
    let positionY = 0;


    const move$ = fromEvent(window, 'mousemove').pipe(
      takeUntil(mouseUp$),
      tap((event: MouseEvent) => {

        positionX = startX + event.clientX - startMouseX;
        positionY = startY + event.clientY - startMouseY;

        keyframeElement.style.transform = `translate(${positionX}px,${positionY}px)`;

        

      }, ()=>{}, ()=>{
        this.animatebleElement.x.next(positionX);
        this.animatebleElement.y.next(positionY);
      })
    );

    mouseDown$.pipe(
      tap((event: MouseEvent) => {
        console.log('down');
        containerRect = this.parent.el.nativeElement.getBoundingClientRect();
        rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();

        console.log(this.el.nativeElement);
        console.log(this.parent.el.nativeElement);

        startX = rect.left - containerRect.left;
        startY = rect.top - containerRect.top;
        startMouseX = event.clientX;
        startMouseY = event.clientY;
      }),
      switchMap(() => move$)
    ).subscribe();
  }

  ngOnDestroy() {
    console.log('destroy');
  }
}

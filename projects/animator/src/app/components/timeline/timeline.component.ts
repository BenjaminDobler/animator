import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { fromEvent, skip, takeUntil } from 'rxjs';
import { ElementTimeline, Timeline } from '../../model/Timeline';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @ViewChild('scrubbar')
  private scrubbarElement: ElementRef;

  @Input()
  set timeline(value: Timeline) {
    
    this._timeline = value;

    this._timeline.position.pipe(skip(0)).subscribe((position)=>{
      const positionX = position * this.pixelsPerMillisecond;
      this.scrubbarElement.nativeElement.style.transform = `translate(${positionX}px`;
    });
  }
  
  get timeline() {
    return this._timeline;
  }
  private _timeline: Timeline;

  @Input()
  public pixelsPerMillisecond = 0.1;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }

  dragStart(event: MouseEvent) {
    console.log('start drag ', this.el);

    const containerRect = this.el.nativeElement.getBoundingClientRect();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const startX = rect.left - containerRect.left - 100;
    const startY = rect.top - containerRect.top;

    const keyframeElement = event.currentTarget as HTMLElement;
    console.log(startX);

    const mouseUp$ = fromEvent(window, 'mouseup');
    const startMouseX = event.clientX;
    const startMouseY = event.clientY;

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
          console.log(positionX, scrubtime);
          this.timeline.position.next(scrubtime);


        },
        () => {},
        () => {
          
        }
      );
  }

}

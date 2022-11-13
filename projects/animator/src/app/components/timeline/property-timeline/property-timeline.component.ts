import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, takeUntil } from 'rxjs';
import { Keyframe, PropertyTimeline } from '../../../model/Timeline';
import { TimelineServiceService } from '../../../services/timeline-service.service';

@Component({
  selector: 'property-timeline',
  templateUrl: './property-timeline.component.html',
  styleUrls: ['./property-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyTimelineComponent implements OnInit {
  @Input()
  pixelsPerMillisecond: number = 0.1;

  @Input()
  set timeline(value: PropertyTimeline) {
    console.log('timeline changed ', value);
    this._timeline = value;
  }

  get timeline() {
    return this._timeline;
  }
  private _timeline: PropertyTimeline;

  @ViewChild('container')
  private container: ElementRef;

  constructor(private timelineService: TimelineServiceService) {}

  ngOnInit(): void {}

  dragStart(keyframe: Keyframe, event: MouseEvent) {
    console.log('start drag ', this.container);

    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const startX = rect.left - containerRect.left;
    const keyframeElement = event.target as HTMLElement;
    console.log(startX);

    const mouseUp$ = fromEvent(window, 'mouseup');
    const startMouse = event.clientX;
    let newTime = 0;
    fromEvent(window, 'mousemove')
      .pipe(takeUntil(mouseUp$))
      .subscribe(
        (event: MouseEvent) => {
          console.log('move ', event.clientX - startMouse);
          console.log('set to ', startX + event.clientX - startMouse);

          let position = startX + event.clientX - startMouse;
          position = Math.max(0, position);
          keyframeElement.style.transform = `translateX(${position}px)`;

          const time = position / this.pixelsPerMillisecond;
          console.log(time);

          newTime = time;
          keyframe.time = newTime;
          const keyframes = this.timeline.keyframes.getValue();

          this.timeline.keyframes.next(keyframes);
        },
        () => {},
        () => {
          console.log('complete');
          // this.timelineService.updateTime(this.timeline, keyframe, newTime);
          const keyframes = this.timeline.keyframes.getValue();
          keyframe.time = newTime;
          this.timeline.keyframes.next(keyframes);
        }
      );
  }
}

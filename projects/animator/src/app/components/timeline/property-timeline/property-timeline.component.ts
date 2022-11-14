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
import { TimelineService } from '../../../services/timeline.service';

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
    this._timeline = value;
  }

  get timeline() {
    return this._timeline;
  }
  private _timeline: PropertyTimeline;

  @ViewChild('container')
  private container: ElementRef;

  constructor(private timelineService: TimelineService) {}

  ngOnInit(): void {}

  selectTween(tween) {
    this.timelineService.selectedKeyframe.next(tween.keyframe);
  }

  dragStart(keyframe: Keyframe, event: MouseEvent) {
    const containerRect = this.container.nativeElement.getBoundingClientRect();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const startX = rect.left - containerRect.left;
    const keyframeElement = event.currentTarget as HTMLElement;

    const mouseUp$ = fromEvent(window, 'mouseup');
    const startMouse = event.clientX;
    let newTime = keyframe.time;
    fromEvent(window, 'mousemove')
      .pipe(takeUntil(mouseUp$))
      .subscribe(
        (event: MouseEvent) => {
          let position = startX + event.clientX - startMouse;
          position = Math.max(0, position);
          keyframeElement.style.transform = `translateX(${position}px)`;
          const time = position / this.pixelsPerMillisecond;
          newTime = time;
          keyframe.time = newTime;
          const keyframes = this.timeline.keyframes.getValue();

          this.timeline.keyframes.next(keyframes);
        },
        () => {},
        () => {
          // this.timelineService.updateTime(this.timeline, keyframe, newTime);
          const keyframes = this.timeline.keyframes.getValue();
          keyframe.time = newTime;
          this.timeline.keyframes.next(keyframes);
        }
      );
  }
}

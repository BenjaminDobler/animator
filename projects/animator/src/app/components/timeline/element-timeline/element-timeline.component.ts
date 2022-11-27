import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ElementTimeline } from '../../../model/Timeline';

@Component({
  selector: 'element-timeline',
  templateUrl: './element-timeline.component.html',
  styleUrls: ['./element-timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElementTimelineComponent implements OnInit {

  @Input()
  set timeline(value: ElementTimeline) {
    console.log('timeline 2 changed ', value);
    this._timeline = value;
  }
  
  get timeline() {
    return this._timeline;
  }

  expanded = true;
  private _timeline: ElementTimeline;

  @Input()
  public pixelsPerMillisecond = 0.001;

  constructor() {}

  ngOnInit(): void {}
}

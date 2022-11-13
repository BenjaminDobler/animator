import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PropertyTimeline } from './model/Timeline';
import { TimelineServiceService } from './services/timeline-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'animator';

  constructor(public timelineService: TimelineServiceService) {

  }

  addProperty() {
    //this.timelineService.addProperty();
    // this.timelineService.timeline.properties.next([...this.timelineService.timeline.properties.getValue(), new PropertyTimeline('y')])
  }

  updateValue() {
    // const first = this.timelineService.timeline.properties.getValue()[0];
    // first.keyframes.next([...first.keyframes.getValue(), {time: 0, value: 100}]);
    


  }

  updateTime() {
    

  }

  deleteProperty() {
  }

  play() {
    this.timelineService.gsapTimeline.play(0);
  }

  newElement() {
    this.timelineService.addNewAnimatebleElement();
  }
  
}

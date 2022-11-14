import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'property-inspector',
  templateUrl: './property-inspector.component.html',
  styleUrls: ['./property-inspector.component.scss']
})
export class PropertyInspectorComponent implements OnInit {


  constructor(public timelineService: TimelineService) { }

  ngOnInit(): void {
  }

  updateValue(prop: BehaviorSubject<any>, value) {
    prop.next(value);
  }

  newElement() {
    this.timelineService.addNewAnimatebleElement();
  }

}

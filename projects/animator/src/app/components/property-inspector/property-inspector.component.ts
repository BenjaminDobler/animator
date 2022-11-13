import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TimelineServiceService } from '../../services/timeline-service.service';

@Component({
  selector: 'property-inspector',
  templateUrl: './property-inspector.component.html',
  styleUrls: ['./property-inspector.component.scss']
})
export class PropertyInspectorComponent implements OnInit {


  constructor(public timelineService: TimelineServiceService) { }

  ngOnInit(): void {
  }

  updateValue(prop: BehaviorSubject<any>, value) {
    prop.next(value);
  }

}

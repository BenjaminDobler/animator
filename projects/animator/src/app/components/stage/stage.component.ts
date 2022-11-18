import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { fromEvent, takeUntil } from 'rxjs';
import { AnimatableElement } from '../../model/Timeline';

@Component({
  selector: 'stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.scss']
})
export class StageComponent implements OnInit {

  @Input()
  public animatebleElements: BehaviorSubject<AnimatableElement[]>;

  constructor(public el: ElementRef) { }

  ngOnInit(): void {

  }

  ngOnViewInit() {
    
  }


}

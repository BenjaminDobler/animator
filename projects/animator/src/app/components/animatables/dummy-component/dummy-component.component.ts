import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AnimatableElement } from '../../../model/Timeline';
import { TimelineService } from '../../../services/timeline.service';

@Component({
    selector: 'app-dummy-component',
    templateUrl: './dummy-component.component.html',
    styleUrls: ['./dummy-component.component.scss'],
})
export class DummyComponentComponent implements OnInit {
    private _animatebleElement: AnimatableElement;
    public get animatebleElement(): AnimatableElement {
        return this._animatebleElement;
    }
    @Input()
    public set animatebleElement(value: AnimatableElement) {
        this._animatebleElement = value;
        // this._animatebleElement.ref = this.el.nativeElement;
        this._animatebleElement.ref = this;
    }

    private _value: number = 0;

    get value() {
      return this._value;
    }

    set value(v: number) {
      console.log('set value ', v);
      this.value$.next(v);
      this._value = v;
    }

    value$ = new Subject();

    @HostListener('click', ['$event.target'])
    onClick(btn) {
        this.timelineService.setSelectedAnimatable(this.animatebleElement);
    }

    constructor(private timelineService: TimelineService) {}

    ngOnInit(): void {}
}

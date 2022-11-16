import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit {
    @Input()
    property: BehaviorSubject<any> = new BehaviorSubject<any>(0);

    @Input()
    label: string;

    @Input()
    type: string;

    constructor() {}

    ngOnInit(): void {}

    updateValue(prop: BehaviorSubject<any>, value) {
        prop.next(value);
    }
}

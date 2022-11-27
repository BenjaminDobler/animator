import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { makeDraggable } from '../../utils/drag';

@Component({
    selector: 'ra-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements AfterViewInit {
    @Input()
    label: string = '';

    private _value: any;
    public get value(): any {
        return this._value;
    }
    @Input()
    public set value(value: any) {
        console.log('set value', value);
        this._value = value;
    }

    @Input()
    type: 'color' | 'number' | 'text' = 'text';

    @Output()
    onChange: EventEmitter<number | string> = new EventEmitter<number | string>();

    constructor(private el: ElementRef) {}

    ngAfterViewInit(): void {
        const drag = makeDraggable(this.el.nativeElement);
        let startVal = 0;
        drag.dragStart$.subscribe(() => {
            startVal = this.value;
            console.log('drag start ');
        });
        drag.dragMove$.subscribe((data) => {
            this.value = startVal - data.deltaY;
            console.log('this.value', this.value);
            this.onChange.emit(this.value);
        });
    }

    onInput(event) {
        console.log("Val", event.target.value);
        this.value = event.target.value;
        console.log('Input value ', this.value);
        this.onChange.emit(this.value);
    }

    onColor(event) {
        console.log(event.target.value);
        this.value = event.target.value;
        this.onChange.emit(this.value);
    }
}

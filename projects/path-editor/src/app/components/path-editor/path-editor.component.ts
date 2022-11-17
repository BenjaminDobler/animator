import { Component, HostListener, OnInit } from '@angular/core';
import { fromEvent, takeUntil } from 'rxjs';

@Component({
    selector: 'path-editor',
    templateUrl: './path-editor.component.html',
    styleUrls: ['./path-editor.component.scss'],
})
export class PathEditorComponent implements OnInit {
    parts = [];
    path = 'M 10 10 C 20 20, 40 20, 50 10';
    controlLines = '';
    lastPart;

    constructor() {}

    ngOnInit(): void {}

    mouseDown = false;
    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        const part = {
            x: event.clientX,
            y: event.clientY,
        };
        this.lastPart = part;
        this.parts.push(part);
        this.mouseDown = true;
        this.updatePath();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.mouseDown) {
            if (this.lastPart && !this.lastPart.handle) {
                const handle = {
                    x: this.lastPart.x,
                    y: this.lastPart.y,
                };
                const handle2 = {
                    x: this.lastPart.x,
                    y: this.lastPart.y,
                };
                this.lastPart.handle = handle;
                this.lastPart.handle2 = handle2;
            } else {
                this.lastPart.handle.x = event.clientX;
                this.lastPart.handle.y = event.clientY;

                const diffX = this.lastPart.handle.x - this.lastPart.x;
                const diffY = this.lastPart.handle.y - this.lastPart.y;

                this.lastPart.handle2.x = this.lastPart.x + -1 * diffX;
                this.lastPart.handle2.y = this.lastPart.y + -1 * diffY;
            }
            this.updatePath();
        }
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent) {
        this.mouseDown = false;
        this.lastPart = null;
    }

    updatePath() {
        let p = '';
        this.controlLines = '';
        this.parts.forEach((part, i) => {
            if (i === 0) {
                p += `M ${part.x} ${part.y} `;
            } else if (!part.handle) {
                p += `L ${part.x} ${part.y} `;
            } else {
                const prev = this.parts[i - 1];
                p += `C ${prev.x} ${prev.y}, ${part.handle2.x} ${part.handle2.y}, ${part.x} ${part.y} `;
            }

            if (part.handle) {
                this.controlLines += `M ${part.handle.x} ${part.handle.y} L ${part.handle2.x} ${part.handle2.y}`;
            }
        });

        this.path = p;
    }

    onPart(part, event: MouseEvent) {
        event.stopPropagation();

        fromEvent(window, 'mousemove')
            .pipe(takeUntil(fromEvent(window, 'mouseup')))
            .subscribe((event: MouseEvent) => {
                part.x = event.clientX;
                part.y = event.clientY;
                this.updatePath();
            });
    }

    onHandle2(part, event: MouseEvent) {
        event.stopPropagation();

        fromEvent(window, 'mousemove')
            .pipe(takeUntil(fromEvent(window, 'mouseup')))
            .subscribe((event: MouseEvent) => {
                part.handle2.x = event.clientX;
                part.handle2.y = event.clientY;

                const diffX = part.handle2.x - part.x;
                const diffY = part.handle2.y - part.y;

                part.handle.x = part.x + -1 * diffX;
                part.handle.y = part.y + -1 * diffY;
                this.updatePath();
            });
    }

    onHandle1(part, event: MouseEvent) {
        event.stopPropagation();
        fromEvent(window, 'mousemove')
            .pipe(takeUntil(fromEvent(window, 'mouseup')))
            .subscribe((event: MouseEvent) => {
                part.handle.x = event.clientX;
                part.handle.y = event.clientY;

                const diffX = part.handle.x - part.x;
                const diffY = part.handle.y - part.y;

                part.handle2.x = part.x + -1 * diffX;
                part.handle2.y = part.y + -1 * diffY;
                this.updatePath();
            });
    }
}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'scrub-bar',
    templateUrl: './scrub-bar.component.html',
    styleUrls: ['./scrub-bar.component.scss'],
})
export class ScrubBarComponent implements OnInit {
    @Input()
    public pixelsPerMillisecond: number = 0;

    @ViewChild('canvas')
    private canvasRef: ElementRef;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor() {}

    ngAfterViewInit() {
        this.canvas = this.canvasRef.nativeElement;
        this.context = this.canvas.getContext('2d');

        let seconds = 1000 * this.pixelsPerMillisecond;
        let halfSecond = 500 * this.pixelsPerMillisecond;

        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 1;
        this.context.lineCap = 'square';

        for (let tick = 0; tick < 100; tick++) {
            const x = Math.round(tick * halfSecond) + 0.5;
            if (tick % 2 === 0) {
                this.context.moveTo(x, 16);
                this.context.lineTo(x, 10);
                this.context.stroke();
            } else {
                this.context.moveTo(x, 16);
                this.context.lineTo(x, 0);
                this.context.stroke();
            }
        }
    }

    ngOnInit(): void {}
}

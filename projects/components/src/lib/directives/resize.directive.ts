import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

const targets = new WeakMap();

const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (targets.has(entry.target)) {
            const comp = targets.get(entry.target);
            comp.resize(entry);
        }
    }
});

@Directive({
    selector: '[raResize]',
})
export class ResizeDirective {
    @Output()
    public onResize: EventEmitter<{ width: number; height: number }> = new EventEmitter<{ width: number; height: number }>();
    constructor(private el: ElementRef) {
        console.log('resize init ', this.el.nativeElement);
        targets.set(this.el.nativeElement, this);
        ro.observe(this.el.nativeElement);
    }

    resize(entry: ResizeObserverEntry) {
        console.log('resize ', entry);
        this.onResize.emit({ width: entry.contentRect.width, height: entry.contentRect.height });
    }

    ngOnDestroy(): void {
        const target = this.el.nativeElement;
        ro.unobserve(target);
        targets.delete(target);
    }
}

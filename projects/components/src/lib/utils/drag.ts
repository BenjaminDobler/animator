import { fromEvent, last, map, switchMap, takeUntil } from 'rxjs';

export function makeDraggable(element) {
    const mouseDown$ = fromEvent(element, 'mousedown');
    const mouseMove$ = fromEvent(document, 'mousemove');
    const mouseUp$ = fromEvent(document, 'mouseup');

    const dragStart$ = mouseDown$;
    const dragMove$ = dragStart$.pipe(
        switchMap((start: MouseEvent) =>
            mouseMove$.pipe(
                map((moveEvent: MouseEvent) => ({
                    originalEvent: moveEvent,
                    deltaX: moveEvent.pageX - start.pageX,
                    deltaY: moveEvent.pageY - start.pageY,
                    startOffsetX: start.offsetX,
                    startOffsetY: start.offsetY,
                })),
                takeUntil(mouseUp$)
            )
        )
    );

    const dragEnd$ = dragStart$.pipe(
        switchMap((start: MouseEvent) =>
            mouseMove$.pipe(
                map((moveEvent: MouseEvent) => ({
                    originalEvent: moveEvent,
                    deltaX: moveEvent.pageX - start.pageX,
                    deltaY: moveEvent.pageY - start.pageY,
                    startOffsetX: start.offsetX,
                    startOffsetY: start.offsetY,
                })),
                takeUntil(mouseUp$),
                last()
            )
        )
    );

    return {
        dragEnd$,
        dragMove$,
        dragStart$,
    };
}

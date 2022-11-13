import { BehaviorSubject } from "rxjs";



export class Timeline {
    elementTimelines: BehaviorSubject<ElementTimeline[]> = new BehaviorSubject<any>([]);
    position: BehaviorSubject<number> = new BehaviorSubject<number>(0);
}

export class ElementTimeline {
    target: AnimatableElement;
    properties: BehaviorSubject<PropertyTimeline[]> = new BehaviorSubject<any>([]);
}

export class PropertyTimeline {
    
    constructor(p: string) {
        this.property.next(p);
    }
    property: BehaviorSubject<string> = new BehaviorSubject<string>('');
    keyframes: BehaviorSubject<Keyframe[]> = new BehaviorSubject<Keyframe[]>([]);
    tweens: BehaviorSubject<Tween[]> = new BehaviorSubject<Tween[]>([]);
}

export interface Keyframe {
    time: number;
    value: number;
}

export class AnimatableElement {
    x: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    y: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    opacity: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    ref: HTMLElement;
}

export interface Tween {
    easing: string;
    fromValue: number;
    toValue: number;
    property: string;
    startTime: number;
    endTime: number;
}

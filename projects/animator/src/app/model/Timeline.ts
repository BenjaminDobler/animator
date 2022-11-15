import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

export class Timeline {
    elementTimelines: BehaviorSubject<ElementTimeline[]> = new BehaviorSubject<any>([]);
    position: BehaviorSubject<number> = new BehaviorSubject<number>(0);
}

export class ElementTimeline {
    target: AnimatableElement;
    properties: BehaviorSubject<PropertyTimeline[]> = new BehaviorSubject<any>([]);

    all: BehaviorSubject<any> = new BehaviorSubject<any>({ min: 0, max: 0 });

    moveKeyframesBy: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor() {
        this.properties
            .pipe(
                switchMap((propertyTimelines) => {
                    const allKeyframes = [];
                    propertyTimelines.forEach((p) => {
                        allKeyframes.push(p.keyframes);
                    });
                    return combineLatest(allKeyframes);
                })
            )
            .subscribe((k) => {
                console.log('property keyframe changed changes ', k);
                const all = k.reduce((prev, curr) => {
                    return [...prev, ...curr];
                }, []);

                console.log(all);
                const min = Math.min(...all.map((item) => item.time));
                const max = Math.max(...all.map((item) => item.time));
                console.log(min, max);
                this.all.next({ min, max });
            });

            this.moveKeyframesBy.subscribe((value)=>{
                const properties = this.properties.getValue();
                properties.forEach((p)=>{
                    const keyframes = p.keyframes.getValue();
                    keyframes.forEach((k)=>{
                        k.time = k.time + value;
                    });
                    p.keyframes.next(keyframes);
                });
                
            })
    }
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
    easing?: any;
    easingOption: string;
}

export class AnimatableElement {
    x: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    y: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    opacity: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    borderRadius: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    backgroundColor: BehaviorSubject<number | string> = new BehaviorSubject<number | string>('#00ff00');

    rotation: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    ref: HTMLElement;
}

export interface Tween {
    easing: string;
    fromValue: number;
    toValue: number;
    property: string;
    startTime: number;
    endTime: number;
    keyframe: Keyframe;
}

import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';
import { AnimatableElementComponent } from '../components/animatables/animatable-element/animatable-element.component';
import { DummyComponentComponent } from '../components/animatables/dummy-component/dummy-component.component';

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

        this.moveKeyframesBy.subscribe((value) => {
            const properties = this.properties.getValue();
            properties.forEach((p) => {
                const keyframes = p.keyframes.getValue();
                keyframes.forEach((k) => {
                    k.time = k.time + value;
                });
                p.keyframes.next(keyframes);
            });
        });
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

export interface AnimatableProperty {
    label: string;
    property: string;
    type: 'number' | 'color';
    step?: number;
    min?: number;
    max?: number; 
    controls: string[];
    group?: string;
    default?: any;
    flex?: number;
    sub?: string;
}

export interface AnimatableElement {
    properties: AnimatableProperty[];
    ref: any;
    componentClass:any;
}


export class AnimatableDummyElement implements AnimatableElement {
    properties: AnimatableProperty[] = [
        {
            label: 'Value',
            property: 'value',
            type: 'number',
            step: 1,
            min: 0,
            max: 200,
            controls: ['number']
        }
    ];
    value: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    ref: any;
    componentClass = DummyComponentComponent;
}

export class AnimatableHTMLElement implements AnimatableElement {
    properties: AnimatableProperty[] = [
        {
            label: 'Opacity',
            property: 'opacity',
            type: 'number',
            controls: ['slider', 'number'],
            step: 1,
            min: 0,
            max: 100,
            default: 100,
            flex: 1,
            sub: '%'
        },
        {
            label: 'x',
            property: 'x',
            type: 'number',
            controls: ['number'],
            step: 1,
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            default: 100,
            group: 'Position',
            flex: 1,
            sub: 'X'
        },
        {
            label: 'y',
            property: 'y',
            type: 'number',
            controls: ['number'],
            step: 1,
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            default: 100,
            group: 'Position',
            flex: 1,
            sub: 'Y'
        },
        {
            label: 'width',
            property: 'width',
            type: 'number',
            controls: ['number'],
            step: 1,
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            default: 100,
            group: 'Size',
            flex: 1,
            sub: 'W'
        },
        {
            label: 'height',
            property: 'height',
            type: 'number',
            controls: ['number'],
            step: 1,
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            default: 100,
            group: 'Size',
            flex: 1,
            sub: 'H'
        },
        {
            label: 'Radius',
            property: 'borderRadius',
            type: 'number',
            controls: ['number'],
            step: 1,
            default: 0,
            min: Number.NEGATIVE_INFINITY,
            max: Number.POSITIVE_INFINITY,
            flex: 0.4,
        },
        {
            label: 'Rotation',
            property: 'rotation',
            type: 'number',
            controls: ['number'],
            step: 1,
            min: -360,
            max: 360,
            default: 0,
            flex: 0.4,
            sub: '˚'
        },
        {
            label: 'Bg color',
            property: 'backgroundColor',
            controls: ['color'],
            type: 'color',
            group: 'BGColor',
            default: '#00ff00',
            flex: 1.6,
        },
        {
            label: 'Bg Opacity',
            property: 'bg-opacity',
            controls: ['number'],
            type: 'number',
            min: 0,
            max: 100,
            group: 'BGColor',
            default: 100,
            flex: 1,
            sub: '%'
        },
    ];

    x: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    y: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    width: BehaviorSubject<number> = new BehaviorSubject<number>(200);
    height: BehaviorSubject<number> = new BehaviorSubject<number>(200);

    opacity: BehaviorSubject<number> = new BehaviorSubject<number>(100);
    borderRadius: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    backgroundColor: BehaviorSubject<number | string> = new BehaviorSubject<number | string>('#00ff00');

    rotation: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    componentClass = AnimatableElementComponent;
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

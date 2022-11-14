import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { BehaviorSubject, distinctUntilChanged, filter, skip } from 'rxjs';
import { Keyframe, PropertyTimeline, ElementTimeline, Timeline, AnimatableElement, Tween } from '../model/Timeline';

@Injectable({
    providedIn: 'root',
})
export class TimelineServiceService {
    selectedAnimatable: BehaviorSubject<AnimatableElement> = new BehaviorSubject<AnimatableElement>(null);

    gsapTimeline;

    elements: BehaviorSubject<AnimatableElement[]> = new BehaviorSubject<AnimatableElement[]>([]);
    newElements: BehaviorSubject<AnimatableElement> = new BehaviorSubject<AnimatableElement>(null);

    public pixelsPerMillisecond = 0.1;

    public timeline: Timeline;

    constructor() {
        // const elementTimeline = new ElementTimeline();
        // elementTimeline.properties.next([new PropertyTimeline('x')]);

        this.timeline = new Timeline();
        // this.timeline.elementTimelines.next([elementTimeline]);

        this.newElements.pipe(filter((el) => el !== null)).subscribe(() => {
            console.log('on new element');
        });

        this.timeline.position.pipe(skip(1)).subscribe((time) => {
            this.gsapTimeline.seek(time / 1000);
        });
    }

    setSelectedAnimatable(animatable: AnimatableElement) {
        this.selectedAnimatable.next(animatable);
    }

    addNewAnimatebleElement() {
        const animateble = new AnimatableElement();
        this.newElements.next(animateble);
        this.elements.next([...this.elements.getValue(), animateble]);

        const elementTimeline = new ElementTimeline();

        const handlePropertyChange = (property: string) => {
            return (val) => {
                const properties = elementTimeline.properties.getValue();
                let propertyTimeline = properties.find((p) => p.property.getValue() === property);
                if (!propertyTimeline) {
                    propertyTimeline = new PropertyTimeline(property);
                    elementTimeline.properties.next([...elementTimeline.properties.getValue(), propertyTimeline]);
                }
                const time = this.timeline.position.getValue();

                let currentKeyframes = propertyTimeline.keyframes.getValue();
                const availableKeyframe = currentKeyframes.find((k) => k.time === time);
                if (availableKeyframe) {
                    currentKeyframes = currentKeyframes.filter((k) => k !== availableKeyframe);
                }
                const newKeyframe = {
                    time,
                    value: val,
                };
                propertyTimeline.keyframes.next([...currentKeyframes, newKeyframe]);
                this.updateTimeline();
            };
        };

        animateble.y.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('y'));
        animateble.x.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('x'));
        animateble.opacity.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('opacity'));
        animateble.rotation.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('rotation'));

        elementTimeline.target = animateble;
        this.timeline.elementTimelines.next([...this.timeline.elementTimelines.getValue(), elementTimeline]);
    }

    updateTimeline() {
        this.gsapTimeline = gsap.timeline({ duration: 10 });
        this.gsapTimeline.pause();
        const elements = this.timeline.elementTimelines.getValue();

        elements.forEach((el: ElementTimeline) => {
            const ref = el.target.ref;
            const properties = el.properties.getValue();
            properties.forEach((property: PropertyTimeline) => {
                const keyframes = property.keyframes.getValue();
                const tweens = [];
                keyframes.forEach((keyframe: Keyframe, i) => {
                    if (i < keyframes.length - 1) {
                        const toKeyframe = keyframes[i + 1];
                        const fromKeyframe = keyframe;
                        if (fromKeyframe.value !== toKeyframe.value) {
                            // new tween
                            const tween: Tween = {
                                fromValue: fromKeyframe.value,
                                toValue: toKeyframe.value,
                                easing: '',
                                startTime: fromKeyframe.time,
                                endTime: toKeyframe.time,
                                property: property.property.getValue(),
                            };

                            const fromVars = {};
                            fromVars[property.property.getValue()] = fromKeyframe.value;

                            const toVars = { duration: (toKeyframe.time - fromKeyframe.time) / 1000 };
                            toVars[property.property.getValue()] = toKeyframe.value;
                            this.gsapTimeline.fromTo(ref, fromVars, toVars, fromKeyframe.time / 1000);
                            tweens.push(tween);
                        }
                    }
                });
                property.tweens.next(tweens);
            });
        });
    }
}

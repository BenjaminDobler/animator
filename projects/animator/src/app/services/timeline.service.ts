import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import gsap, { Elastic } from 'gsap';
import { Bounce } from 'gsap';
import { BehaviorSubject, distinctUntilChanged, filter, skip } from 'rxjs';
import { Keyframe, PropertyTimeline, ElementTimeline, Timeline, AnimatableElement, Tween, AnimatableHTMLElement } from '../model/Timeline';

@Injectable({
    providedIn: 'root',
})
export class TimelineService {
    selectedAnimatable: BehaviorSubject<AnimatableElement> = new BehaviorSubject<AnimatableElement>(null);

    gsapTimeline;

    elements: BehaviorSubject<AnimatableElement[]> = new BehaviorSubject<AnimatableElement[]>([]);
    newElements: BehaviorSubject<AnimatableElement> = new BehaviorSubject<AnimatableElement>(null);
    selectedKeyframe: BehaviorSubject<Keyframe> = new BehaviorSubject<Keyframe>(null);
    public pixelsPerMillisecond = 0.1;

    public timeline: Timeline;

    constructor() {
        this.timeline = new Timeline();

        this.newElements.pipe(filter((el) => el !== null)).subscribe(() => {
            console.log('on new element');
        });

        this.timeline.position.pipe(skip(1)).subscribe((time) => {
            if (!this.gsapTimeline.isActive()) {
                this.gsapTimeline.seek(time / 1000);
            }
        });
    }

    setSelectedAnimatable(animatable: AnimatableElement) {
        this.selectedAnimatable.next(animatable);
    }

    addNewAnimatebleElement(typeClass) {
        const animateble = new typeClass();
        this.newElements.next(animateble);
        this.elements.next([...this.elements.getValue(), animateble]);

        const elementTimeline = new ElementTimeline();

        const handlePropertyChange = (property: string) => {
            return (val) => {
                const properties = elementTimeline.properties.getValue();
                let propertyTimeline = properties.find((p) => p.property.getValue() === property);
                if (!propertyTimeline) {
                    propertyTimeline = new PropertyTimeline(property);
                    propertyTimeline.keyframes.subscribe(() => {
                        this.updateTimeline();
                    });
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
                    easing: 'Default',
                    easingOption: '',
                };
                let updatedKeyframes = [...currentKeyframes, newKeyframe];
                updatedKeyframes.sort((a, b) => {
                    return a.time - b.time;
                });
                propertyTimeline.keyframes.next(updatedKeyframes);
                this.updateTimeline();
            };
        };

        animateble.properties.forEach((property) => {
            if (animateble[property.property]) {
                animateble[property.property].pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange(property.property));
            } else {
                console.warn('Property does not exist on animatable element ', property.property);
            }
        });

        elementTimeline.target = animateble;
        this.timeline.elementTimelines.next([...this.timeline.elementTimelines.getValue(), elementTimeline]);
    }

    updateTimeline() {
        this.gsapTimeline = gsap.timeline({ duration: 10 });
        this.gsapTimeline.eventCallback('onUpdate', (data) => {
            const time = this.gsapTimeline.progress() * this.gsapTimeline.duration();
            this.timeline.position.next(time * 1000);
        });
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
                                keyframe: fromKeyframe,
                            };

                            const fromVars: any = {};
                            fromVars[property.property.getValue()] = fromKeyframe.value;

                            const toVars: any = { duration: (toKeyframe.time - fromKeyframe.time) / 1000 };
                            if (fromKeyframe.easing === 'Default') {
                                toVars.ease = 'linear';
                            } else {
                                toVars.ease = fromKeyframe.easing + '.' + fromKeyframe.easingOption;
                            }

                            toVars[property.property.getValue()] = toKeyframe.value;
                            this.gsapTimeline.fromTo(ref, fromVars, toVars, fromKeyframe.time / 1000);
                            tweens.push(tween);
                        }
                    }
                });
                property.tweens.next(tweens);
            });
        });

        this.gsapTimeline.seek(this.timeline.position.getValue() / 1000);
    }
}

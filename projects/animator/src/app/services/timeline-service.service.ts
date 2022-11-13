import { keyframes } from '@angular/animations';
import { Injectable } from '@angular/core';
import gsap from 'gsap';
import { BehaviorSubject, distinctUntilChanged, filter, skip } from 'rxjs';
import { Keyframe, PropertyTimeline, ElementTimeline, Timeline, AnimatableElement, Tween } from '../model/Timeline';

@Injectable({
  providedIn: 'root',
})
export class TimelineServiceService {

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


    this.newElements.pipe(filter(el=>el!==null)).subscribe(()=>{
      console.log('on new element');
    });

    this.timeline.position.pipe(skip(1)).subscribe((time)=>{
      this.gsapTimeline.seek(time/1000);
    })

    
  }

  addNewAnimatebleElement() {
    const animateble = new AnimatableElement();
    this.newElements.next(animateble);
    this.elements.next([...this.elements.getValue(), animateble]);

    const elementTimeline = new ElementTimeline();

    const handlePropertyChange = (property: string)=>{

      return (val)=>{
        console.log('Property '+property+' changed', val);
        const properties = elementTimeline.properties.getValue();
        let propertyTimeline = properties.find(p=>p.property.getValue() === property);
        if (!propertyTimeline) {
          propertyTimeline = new PropertyTimeline(property);
          elementTimeline.properties.next([...elementTimeline.properties.getValue(), propertyTimeline]);
        }
        const time = this.timeline.position.getValue();
  
        let currentKeyframes = propertyTimeline.keyframes.getValue();
        const availableKeyframe = currentKeyframes.find(k=>k.time === time);
        if (availableKeyframe) {
          currentKeyframes = currentKeyframes.filter(k=>k!==availableKeyframe);
        } else {
          console.log('keyframe not available');
        }
        const newKeyframe = {
          time,
          value: val
        };
        propertyTimeline.keyframes.next([...currentKeyframes, newKeyframe]);
        this.updateTimeline();
  
      }
    }


    animateble.y.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('y'));
    animateble.x.pipe(skip(1), distinctUntilChanged()).subscribe(handlePropertyChange('x'));

      
      

    elementTimeline.target = animateble;
    this.timeline.elementTimelines.next([...this.timeline.elementTimelines.getValue(), elementTimeline]);
  }


  updateTimeline() {
    this.gsapTimeline = gsap.timeline({duration: 10});
    this.gsapTimeline.pause();
    // timeline.to('divA', {x: 100, y: 100, startAt: 2});

    const elements = this.timeline.elementTimelines.getValue();

    elements.forEach((el: ElementTimeline)=>{
      const ref = el.target.ref;
      const properties = el.properties.getValue();
      properties.forEach((property: PropertyTimeline)=>{
        const keyframes = property.keyframes.getValue();
        const tweens = [];
        keyframes.forEach((keyframe: Keyframe, i)=>{
          if (i>0) {
            const prev = keyframes[i-1];
            if (prev.value !== keyframe.value) {
              // new tween
              const tween: Tween = {
                fromValue: prev.value,
                toValue: keyframe.value,
                easing: '',
                startTime: prev.time,
                endTime: keyframe.time,
                property: property.property.getValue()
              }
              const toVars = {duration: (keyframe.time-prev.time)/1000};
              toVars[property.property.getValue()] = keyframe.value;
              console.log(toVars);
              this.gsapTimeline.to(ref, toVars, prev.time / 1000);
              tweens.push(tween);
            }
          }

          console.log("Keyframe", property.property.getValue(), keyframe.time, keyframe.value);
        });
        property.tweens.next(tweens);
      })
    });
    console.log("Elements", elements);



   

  }


}

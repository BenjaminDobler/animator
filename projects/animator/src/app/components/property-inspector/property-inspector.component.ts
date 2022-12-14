import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AnimatableDummyElement, AnimatableElement, AnimatableHTMLElement } from '../../model/Timeline';
import { TimelineService } from '../../services/timeline.service';

interface Easing {
    name: string;
    options: string[];
    parameters: any[];
    selectedOption: string;
    getEasingString(): string;
    clone(): Easing;
}

class Bounce implements Easing {
    name = 'Bounce';
    options = ['easeIn', 'easeOut', 'easeInOut'];

    selectedOption = 'easeIn';
    parameters = [];
    getEasingString() {
        return '';
    }

    clone() {
        const c = new Bounce();
        c.selectedOption = this.selectedOption;
        return c;
    }
}

class Default implements Easing {
    name = 'Default';
    options = [];

    selectedOption = '';
    parameters = [];
    getEasingString() {
        return '';
    }

    clone() {
        const c = new Default();
        c.selectedOption = this.selectedOption;
        return c;
    }
}

class Back implements Easing {
    name = 'Back';
    options = ['easeIn', 'easeOut', 'easeInOut'];
    selectedOption = 'easeInOut';

    parameters = [
        {
            type: 'number',
            value: 1,
            min: 0,
            max: 10,
        },
    ];
    getEasingString() {
        return '';
    }
    clone() {
        const c = new Back();
        c.selectedOption = this.selectedOption;
        return c;
    }
}

@Component({
    selector: 'property-inspector',
    templateUrl: './property-inspector.component.html',
    styleUrls: ['./property-inspector.component.scss'],
})
export class PropertyInspectorComponent implements OnInit {


  properties = [
    {
      label: 'Opacity',
      property: 'opacity',
      type: 'number',
      step: 0.01,
      min: 0,
      max: 1
    },
    {
      label: 'x',
      property: 'x',
      type: 'number',
      step: 1,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY
    },
    {
      label: 'y',
      property: 'y',
      type: 'number',
      step: 1,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY
    },
    {
      label: 'width',
      property: 'width',
      type: 'number',
      step: 1,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY
    },
    {
      label: 'height',
      property: 'height',
      type: 'number',
      step: 1,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY
    },
    {
      label: 'radius',
      property: 'borderRadius',
      type: 'number',
      step: 1,
      min: Number.NEGATIVE_INFINITY,
      max: Number.POSITIVE_INFINITY
    },
    {
      label: 'Bg color',
      property: 'backgroundColor',
      type: 'color'
    }

  ]

  groups$: Observable<any[]>;

  @Input()
  public selectedAnimatable: AnimatableElement;

    easings: Easing[] = [new Default(), new Bounce(), new Back()];

    selectedEasing: Easing = this.easings[0];

    constructor(public timelineService: TimelineService) {
        this.timelineService.selectedKeyframe.subscribe((k) => {
            if (k) {
                this.selectedEasing = this.easings.find((e) => e.name === k.easing);
                this.selectedEasing.selectedOption = k.easingOption;
            }
        });
    }


    changeSelectedEasingOption(e) {
        this.selectedEasing.selectedOption = e.target.value;
        this.timelineService.selectedKeyframe.getValue().easingOption = e.target.value;
        this.timelineService.updateTimeline();

    }

    changeSelectedEasing(e) {
        this.selectedEasing = this.easings[e.target.value];
        this.timelineService.selectedKeyframe.getValue().easing = this.selectedEasing.name;
        this.timelineService.updateTimeline();
        
    }
    ngOnInit(): void {
        this.groups$ = this.timelineService.selectedAnimatable.pipe(map((animatable)=>{
            console.log(animatable);
            if (!animatable) {
                return [];
            }
            const groups = [];
            const grouped = animatable.properties.reduce(function (r, a) {
                if (a.group) {
                    r[a.group] = r[a.group] || [];
                    r[a.group].push(a);
                } else {
                    r[a.property] = r[a.property] || [];
                    r[a.property].push(a);
                }
                return r;
            }, {} as any);
    
            for (let i in grouped) {
                console.log(i);
                groups.push({
                    label: grouped[i].length > 1 ? i : grouped[i][0].label,
                    data: grouped[i],
                });
            }
            console.log('groups ', groups);
            return groups;
        }))
    }

    updateValue(prop: BehaviorSubject<any>, value) {
        prop.next(value);
    }

    newElement() {
        this.timelineService.addNewAnimatebleElement(AnimatableHTMLElement);
    }

    newDummyElement() {
        this.timelineService.addNewAnimatebleElement(AnimatableDummyElement);
    }
}

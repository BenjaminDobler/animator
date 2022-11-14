import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
    ngOnInit(): void {}

    updateValue(prop: BehaviorSubject<any>, value) {
        prop.next(value);
    }

    newElement() {
        this.timelineService.addNewAnimatebleElement();
    }
}

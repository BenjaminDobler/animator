import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'component-demo';

    properties = [
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

    groups = [];

    constructor() {
        const grouped = this.properties.reduce(function (r, a) {
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
            this.groups.push({
                label: grouped[i].length > 1 ? i : grouped[i][0].label,
                data: grouped[i],
            });
        }

        console.log(this.groups);
    }
}

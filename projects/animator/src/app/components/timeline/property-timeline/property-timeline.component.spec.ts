import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyTimelineComponent } from './property-timeline.component';

describe('PropertyTimelineComponent', () => {
  let component: PropertyTimelineComponent;
  let fixture: ComponentFixture<PropertyTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

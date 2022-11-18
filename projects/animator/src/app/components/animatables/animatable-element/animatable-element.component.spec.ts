import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatableElementComponent } from './animatable-element.component';

describe('AnimatableElementComponent', () => {
  let component: AnimatableElementComponent;
  let fixture: ComponentFixture<AnimatableElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnimatableElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatableElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

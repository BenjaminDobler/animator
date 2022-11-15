import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDragComponent } from './all-drag.component';

describe('AllDragComponent', () => {
  let component: AllDragComponent;
  let fixture: ComponentFixture<AllDragComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDragComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDragComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaButtonComponent } from './ra-button.component';

describe('RaButtonComponent', () => {
  let component: RaButtonComponent;
  let fixture: ComponentFixture<RaButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

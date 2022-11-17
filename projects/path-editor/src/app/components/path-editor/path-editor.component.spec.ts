import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathEditorComponent } from './path-editor.component';

describe('PathEditorComponent', () => {
  let component: PathEditorComponent;
  let fixture: ComponentFixture<PathEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PathEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

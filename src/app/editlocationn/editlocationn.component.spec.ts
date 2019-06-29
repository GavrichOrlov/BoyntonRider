import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlocationnComponent } from './editlocationn.component';

describe('EditlocationnComponent', () => {
  let component: EditlocationnComponent;
  let fixture: ComponentFixture<EditlocationnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlocationnComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlocationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

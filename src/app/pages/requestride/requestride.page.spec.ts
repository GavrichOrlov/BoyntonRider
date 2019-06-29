import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestridePage } from './requestride.page';

describe('RequestridePage', () => {
  let component: RequestridePage;
  let fixture: ComponentFixture<RequestridePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestridePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestridePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

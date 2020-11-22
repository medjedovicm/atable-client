import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbButtonComponent } from './atb-button.component';

describe('SchdButtonComponent', () => {
  let component: AtbButtonComponent;
  let fixture: ComponentFixture<AtbButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

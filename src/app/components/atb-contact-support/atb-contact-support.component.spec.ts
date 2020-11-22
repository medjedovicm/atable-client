import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbContactSupportComponent } from './atb-contact-support.component';

describe('AtbContactSupportComponent', () => {
  let component: AtbContactSupportComponent;
  let fixture: ComponentFixture<AtbContactSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbContactSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbContactSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

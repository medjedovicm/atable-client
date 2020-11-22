import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbThreadModalComponent } from './atb-thread-modal.component';

describe('AtbThreadModalComponent', () => {
  let component: AtbThreadModalComponent;
  let fixture: ComponentFixture<AtbThreadModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbThreadModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbThreadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

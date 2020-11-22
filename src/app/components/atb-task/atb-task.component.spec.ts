import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbTaskComponent } from './atb-task.component';

describe('AtbTaskComponent', () => {
  let component: AtbTaskComponent;
  let fixture: ComponentFixture<AtbTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

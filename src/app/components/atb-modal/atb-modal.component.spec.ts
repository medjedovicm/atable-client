import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbModalComponent } from './atb-modal.component';

describe('AtbModalComponent', () => {
  let component: AtbModalComponent;
  let fixture: ComponentFixture<AtbModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

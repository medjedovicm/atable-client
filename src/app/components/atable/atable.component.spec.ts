import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtableComponent } from './atable.component';

describe('AtableComponent', () => {
  let component: AtableComponent;
  let fixture: ComponentFixture<AtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

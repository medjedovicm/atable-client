import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbNavigationComponent } from './atb-navigation.component';

describe('AtbNavigationComponent', () => {
  let component: AtbNavigationComponent;
  let fixture: ComponentFixture<AtbNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

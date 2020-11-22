import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthStartComponent } from './auth-start.component';

describe('AuthStartComponent', () => {
  let component: AuthStartComponent;
  let fixture: ComponentFixture<AuthStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

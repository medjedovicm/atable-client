import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtbChatComponent } from './atb-chat.component';

describe('AtbChatComponent', () => {
  let component: AtbChatComponent;
  let fixture: ComponentFixture<AtbChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtbChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtbChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

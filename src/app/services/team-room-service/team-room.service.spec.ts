import { TestBed } from '@angular/core/testing';

import { TeamRoomService } from './team-room.service';

describe('TeamRoomService', () => {
  let service: TeamRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

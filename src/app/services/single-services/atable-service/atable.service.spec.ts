import { TestBed } from '@angular/core/testing';

import { AtableService } from './atable.service';

describe('AtableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtableService = TestBed.get(AtableService);
    expect(service).toBeTruthy();
  });
});

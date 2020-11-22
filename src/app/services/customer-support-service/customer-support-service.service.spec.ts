import { TestBed } from '@angular/core/testing';

import { CustomerSupportServiceService } from './customer-support-service.service';

describe('CustomerSupportServiceService', () => {
  let service: CustomerSupportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSupportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TeamupService } from './teamup.service';

describe('TeamupService', () => {
  let service: TeamupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

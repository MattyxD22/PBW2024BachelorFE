import { TestBed } from '@angular/core/testing';

import { ClickupService } from './clickup.service';

describe('ClickupService', () => {
  let service: ClickupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

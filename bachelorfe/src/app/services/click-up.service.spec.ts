import { TestBed } from '@angular/core/testing';

import { ClickUpService } from './click-up.service';

describe('ClickUpService', () => {
  let service: ClickUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClickUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

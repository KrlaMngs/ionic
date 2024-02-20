import { TestBed } from '@angular/core/testing';

import { SharedReposServiceService } from './shared-repos-service.service';

describe('SharedReposServiceService', () => {
  let service: SharedReposServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedReposServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

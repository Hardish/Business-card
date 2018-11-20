import { TestBed } from '@angular/core/testing';

import { CloudVisionService } from './cloud-vision.service';

describe('CloudVisionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CloudVisionService = TestBed.get(CloudVisionService);
    expect(service).toBeTruthy();
  });
});

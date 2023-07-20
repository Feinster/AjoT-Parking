import { TestBed } from '@angular/core/testing';

import { AwsIotService } from './aws-iot.service';

describe('AwsIotService', () => {
  let service: AwsIotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsIotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

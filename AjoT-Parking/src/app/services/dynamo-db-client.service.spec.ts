import { TestBed } from '@angular/core/testing';

import { DynamoDbClientService } from './dynamo-db-client.service';

describe('DynamoDbClientService', () => {
  let service: DynamoDbClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamoDbClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MysqlService } from './mysql.service';

describe('MysqlService', () => {
  let service: MysqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MysqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

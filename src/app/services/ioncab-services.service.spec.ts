import { TestBed } from '@angular/core/testing';

import { IoncabServicesService } from './ioncab-services.service';

describe('IoncabServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IoncabServicesService = TestBed.get(IoncabServicesService);
    expect(service).toBeTruthy();
  });
});

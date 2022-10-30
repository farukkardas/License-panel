import { TestBed } from '@angular/core/testing';

import { ModalSubscriptionService } from './modal-subscription.service';

describe('ModalSubscriptionService', () => {
  let service: ModalSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

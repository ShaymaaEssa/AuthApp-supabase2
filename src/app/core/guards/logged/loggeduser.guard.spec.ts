import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggeduserGuard } from './loggeduser.guard';

describe('loggeduserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggeduserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

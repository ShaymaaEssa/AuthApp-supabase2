import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { userToken } from '../../environment/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const id = inject(PLATFORM_ID);

  if (isPlatformBrowser(id)) {
    //to know if user login or not
    if (localStorage.getItem(userToken.token) !== null) {
      return true;
    } else {
      //navigate to login
      router.navigate(['/login']);
      return false;
    }
  } else {
    return false;
  }
};

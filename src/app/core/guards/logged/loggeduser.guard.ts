import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';
import { CanActivateFn, Router } from '@angular/router';
import { userToken } from '../../environment/environment';

export const loggeduserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const id = inject(PLATFORM_ID);

  if(isPlatformBrowser(id)){
    if (localStorage.getItem(userToken.token) === null){
      return true;

    } else{
      router.navigate(['/home']);
      return false;
    }
  } else{
    return false;
  }
};

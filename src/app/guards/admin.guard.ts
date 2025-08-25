import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.getUser;
  if (!user || user.role !== 'Admin') {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

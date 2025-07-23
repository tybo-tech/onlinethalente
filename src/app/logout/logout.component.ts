import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  constructor(private userService: UserService, private router: Router) {
    this.userService.logout();
    router.navigate(['/login'], {
      queryParams: { logout: true },
      replaceUrl: true,
    });
  }
}

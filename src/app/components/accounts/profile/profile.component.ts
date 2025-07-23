import { Component } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | undefined;
  constructor(private userService: UserService, private router: Router) {
    this.user = this.userService.getUser;
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    if (this.isAdmin) {
      this.router.navigate(['/admin']);
    }
  }
  logout() {
    this.userService.logout(undefined);
    this.router.navigate(['/login']);
  }
  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }
}

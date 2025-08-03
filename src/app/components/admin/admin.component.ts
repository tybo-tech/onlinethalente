import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  routes = [
    {
      link: '/admin',
      label: 'Dashboard',
    },
    {
      link: '/admin/users',
      label: 'Users',
    },
    {
      link: '/admin/applications',
      label: 'Applications',
    },
    {
      link: '/admin/settings',
      label: 'Settings',
    },
    {
      link: '/logout',
      label: 'Logout',
    },
  ];

  user: User | undefined;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.user = this.userService.getUser;
      if (!this.user || this.user.role !== 'Admin') {
        this.router.navigate(['/login']);
      }
    });
  }
  logout() {
    this.userService.logout(undefined);
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User';


export interface NavItem {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for menu items
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  brand = 'Onlinethalente';
  logo = 'logo.png'; // replace with actual path
  showMobileMenu = false;

  navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: '' },
    // { label: 'How It Works', href: '/how-it-works', icon: '' },
    { label: 'About Us', href: '/about', icon: '' },
    { label: 'Contact', href: '/contact', icon: '' },
  ];

  user: User | undefined;

  constructor(private userService: UserService) {
    this.user = this.userService.getUser;
  }

  get isLoggedIn(): boolean {
    return !!this.user;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  get dashboardLabel(): string {
    return this.isAdmin ? 'Go to Dashboard' : 'Go to My Portal';
  }

  get dashboardLink(): string {
    return this.isAdmin ? '/admin' : '/profile';
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }
}

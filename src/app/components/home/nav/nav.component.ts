import { Component } from '@angular/core';
import { NavItem } from '../../../../models/schema';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  brand = 'Onlinethalente';
  logo = 'logo.png'; // Update with actual path

  navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: '' },
    { label: 'How It Works', href: '/how-it-works', icon: '' },
    { label: 'About Us', href: '/about', icon: '' },
    { label: 'Contact', href: '/contact', icon: '' },
    { label: 'Login', href: '/login', icon: '' },
  ];

  showMobileMenu = false;

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }
}

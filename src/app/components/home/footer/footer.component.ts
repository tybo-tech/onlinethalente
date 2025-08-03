import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
export interface FooterLink {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for footer links
}

export interface FooterContact {
  type: 'email' | 'phone' | 'address';
  value: string;
  icon: string;
}

export interface FooterSocial {
  icon: string; // e.g., 'fa-facebook-f'
  href: string;
}
@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  brand = 'OnlineTalente';
  tagline = 'Microloans. Big Impact. Simple Process.';
  subtext = ' Empowering everyday South Africans with quick, fair, and transparent microloans. No paperwork. No queues. Just opportunity.'
  year = new Date().getFullYear();

  navLinks: FooterLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Apply for Loan', href: '/apply', icon: 'fa-hand-holding-dollar' },
    { label: 'How It Works', href: '/how-it-works', icon: 'fa-diagram-project' },
    { label: 'FAQs', href: '/faq', icon: 'fa-circle-question' },
    { label: 'Contact Us', href: '/contact', icon: 'fa-envelope' },
  ];

  quickLinks: FooterLink[] = [
    { label: 'Start Application', href: '/apply' },
    { label: 'Loan Eligibility', href: '/how-it-works#eligibility' },
  ];

  contacts: FooterContact[] = [
    { type: 'phone', value: '+27 68 111 2222', icon: 'fa-phone' },
    { type: 'email', value: 'support@onlinetalente.co.za', icon: 'fa-envelope' },
    { type: 'address', value: '15 Loop St, Cape Town, South Africa', icon: 'fa-location-dot' },
  ];

  socials: FooterSocial[] = [
    { icon: 'fa-facebook-f', href: 'https://facebook.com/onlinetalente' },
    { icon: 'fa-instagram', href: 'https://instagram.com/onlinetalente' },
    { icon: 'fa-linkedin-in', href: 'https://linkedin.com/company/onlinetalente' },
  ];

}

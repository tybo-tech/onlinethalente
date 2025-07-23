import { Component } from '@angular/core';
import { CTAAction } from '../../../../models/schema';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cta',
  imports: [CommonModule, RouterModule],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CtaComponent {
 ctaHeading = "Ready to Elevate Your Brand?";
  ctaSubheading = "Get started now – order online, request a quote, or contact our team!";
  actions: CTAAction[] = [
    { label: 'Shop Now', icon: 'fa-shopping-cart', href: '/shop', variant: 'primary' },
    { label: 'Get a Quote', icon: 'fa-file-signature', href: '/contact', variant: 'accent' },
    { label: 'Contact Us', icon: 'fa-envelope', href: '/contact', variant: 'primary' },
  ];
}

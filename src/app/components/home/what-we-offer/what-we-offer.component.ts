import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-what-we-offer',
  imports: [CommonModule],
  templateUrl: './what-we-offer.component.html',
  styleUrl: './what-we-offer.component.scss',
})
export class WhatWeOfferComponent {
  services = [
    {
      icon: 'fa-print',
      title: 'Print Services',
      desc: 'Business cards, flyers, banners, and more with premium quality.',
    },
    {
      icon: 'fa-store',
      title: 'Product Sales',
      desc: 'Shop workwear, machines, and branded gifts—all in one place.',
    },
    {
      icon: 'fa-paint-brush',
      title: 'Custom Printing',
      desc: 'Personalized branding for clothing, mugs, bottles, and more.',
    },
    // Add more items easily!
  ];
}

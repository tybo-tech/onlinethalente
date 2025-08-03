import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  image?: string; // Avatar image URL or path
  quote: string;
  color?: string; // Background color for the testimonial card
}
@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
 testimonials: Testimonial[] = [
  {
    name: 'Noluthando M.',
    role: 'Entrepreneur',
    company: 'Luxe Events',
    quote: 'I applied on the 15th and received my loan by the 16th — it was quick, simple, and stress-free!',
    color: '#6366F1' // Indigo
  },
  {
    name: 'Tshepo Dlamini',
    role: 'Freelancer',
    company: '',
    quote: 'The repayment cycle fits perfectly with how I earn. I love how Onlinethalente keeps it transparent.',
    color: '#EC4899' // Pink
  },
  {
    name: 'Emily R.',
    role: 'Startup Founder',
    company: 'Ink & Ideas',
    quote: 'This is how loans should work — no paperwork, no queues. Just fast approval and next-day funding.',
    color: '#10B981' // Emerald
  },
  {
    name: 'Buhle Khumalo',
    role: 'Retail Owner',
    company: 'Zimbali Market',
    quote: 'I’ve used Onlinethalente three months in a row. Their consistency and service are unmatched.',
    color: '#F59E0B' // Amber
  },
  {
    name: 'Sibusiso M.',
    role: 'Delivery Driver',
    company: '',
    quote: 'I got approved instantly and paid my loan off in two months with no issues. Highly recommend!',
    color: '#3B82F6' // Blue
  },
  {
    name: 'Lebo Dlamini',
    role: 'Consultant',
    company: '',
    quote: 'Knowing exactly when I’ll get paid and when to repay gives me peace of mind. It just works.',
    color: '#8B5CF6' // Violet
  }
];


  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
}

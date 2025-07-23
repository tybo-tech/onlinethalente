import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Faq {
  question: string;
  answer: string;
  open?: boolean; // For toggling
}

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
  imports: [CommonModule],
})
export class FaqSectionComponent {
  faqs: Faq[] = [
    {
      question: 'What services does Viviid offer?',
      answer: 'We provide premium printing, branding, workwear, and promotional products, all available for easy online ordering or custom quote requests.',
    },
    {
      question: 'How do I place an order?',
      answer: 'Simply browse our categories, add products to your cart, and check out. For custom printables, use the “Get a Quote” button and we’ll get back to you.',
    },
    {
      question: 'What are your lead times?',
      answer: 'Most orders are processed within 3-7 working days, depending on the product type and order size.',
    },
    {
      question: 'Can I get bulk discounts?',
      answer: 'Yes! Bulk and business orders qualify for special pricing. Reach out for a quote on large quantities.',
    },
    {
      question: 'Where are you located?',
      answer: 'We’re based in Johannesburg, SA, but we deliver nationwide.',
    },
  ];

  toggle(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Faq {
  question: string;
  answer: string;
  open?: boolean;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
})
export class FaqSectionComponent {
  faqs: Faq[] = [
    {
      question: 'How long does it take to get approved?',
      answer: 'Our digital process ensures instant approval within minutes, provided all details are correctly submitted.',
    },
    {
      question: 'When will I receive the funds?',
      answer: 'Funds are released on the next business day after approval — typically the 16th, 26th, or 1st of each month, depending on your repayment cycle.',
    },
    {
      question: 'How do repayment cycles work?',
      answer: 'You choose a repayment cycle based on your salary date — 15th, 25th, or 31st. We align fund disbursement and collections accordingly.',
    },
    {
      question: 'Do I need to upload documents?',
      answer: 'Yes. During the loan application, you’ll upload authentic bank statements, which are verified automatically by our system.',
    },
    {
      question: 'Is my data safe?',
      answer: 'Absolutely. Our platform uses bank-level encryption and is PCI DSS compliant to ensure your information stays protected.',
    },
    {
      question: 'Can I apply more than once?',
      answer: 'Yes, you can reapply each month based on availability and your repayment history. Approved amounts and dates will vary accordingly.',
    },
  ];

  toggle(index: number) {
    this.faqs[index].open = !this.faqs[index].open;
  }
}

import { Component } from '@angular/core';
import { WhyChooseUsItem } from '../../../../models/schema';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-choose-us.component.html',
  styleUrl: './why-choose-us.component.scss'
})
export class WhyChooseUsComponent {
  reasons: WhyChooseUsItem[] = [
    {
      icon: 'fa fa-bolt',
      title: 'Instant Approvals',
      description: 'Get approved in minutes with no paperwork or waiting in lines.',
    },
    {
      icon: 'fa fa-shield-alt',
      title: 'Secure Platform',
      description: 'Bank-grade encryption keeps your data and transactions safe.',
    },
    {
      icon: 'fa fa-calendar-check',
      title: 'Flexible Repayment',
      description: 'Choose a cycle that suits your monthly income rhythm.',
    },
    {
      icon: 'fa fa-wallet',
      title: 'Next-Day Payouts',
      description: 'Funds are paid out the next business day after approval.',
    },
    {
      icon: 'fa fa-thumbs-up',
      title: 'Trusted by South Africans',
      description: 'Hundreds of clients rely on Onlinethalente every month.',
    },
    {
      icon: 'fa fa-mobile-alt',
      title: '100% Digital Process',
      description: 'Apply, track, and manage everything from your phone.',
    },
  ];
}

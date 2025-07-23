import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OverviewStat {
  label: string;
  value: string | number;
  icon: string;
  color: string; // Tailwind or CSS color class
  description?: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  stats: OverviewStat[] = [
    {
      label: 'Approved Loans',
      value: 742,
      icon: 'fas fa-check-circle',
      color: 'bg-green-500/80 text-green-900',
      description: 'Loans approved via the digital platform',
    },
    {
      label: 'Next-Day Payouts',
      value: 691,
      icon: 'fas fa-bolt',
      color: 'bg-yellow-400/80 text-yellow-900',
      description: 'Successful payouts made the next business day',
    },
    {
      label: 'Avg. Approval Time',
      value: '2.8 min',
      icon: 'fas fa-stopwatch',
      color: 'bg-blue-400/80 text-blue-900',
      description: 'Average time to decision from application',
    },
    {
      label: 'Active Clients',
      value: 312,
      icon: 'fas fa-user-check',
      color: 'bg-purple-500/80 text-purple-900',
      description: 'Clients actively using Onlinethalente monthly',
    },
  ];
}

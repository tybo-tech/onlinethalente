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
      label: 'Orders',
      value: 1284,
      icon: 'fas fa-box-open',
      color: 'bg-yellow-500/80 text-yellow-900',
      description: 'Total completed orders this year',
    },
    {
      label: 'Customers',
      value: 432,
      icon: 'fas fa-users',
      color: 'bg-blue-500/80 text-blue-900',
      description: 'Active business customers',
    },
    {
      label: 'Revenue',
      value: 'R285,900',
      icon: 'fas fa-chart-line',
      color: 'bg-green-500/80 text-green-900',
      description: '2025 Revenue (ZAR)',
    },
    {
      label: 'New Products',
      value: 36,
      icon: 'fas fa-tags',
      color: 'bg-pink-500/80 text-pink-900',
      description: 'Products added this month',
    },
  ];
}

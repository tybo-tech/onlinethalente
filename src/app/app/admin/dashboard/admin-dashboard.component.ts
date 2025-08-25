import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminUseCases } from '../../../../services/business/admin.usecases';
import { KpiGridComponent } from './kpi-grid.component';
import { PendingAppsComponent } from './pending-apps.component';
import { QuickActionsComponent, QuickAction } from './quick-actions.component';
import { RecentActivityComponent } from './recent-activity.component';
import { SlotsRemainingComponent } from './slots-remaining.component';
import { SystemHealthComponent } from './system-health.component';
import { SeedDevDataService } from '../../../../services/business/seed-dev-data.service';


@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    KpiGridComponent,
    QuickActionsComponent,
    SlotsRemainingComponent,
    PendingAppsComponent,
    RecentActivityComponent,
    SystemHealthComponent,
  ],
  template: `
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <div class="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-gray-600">Configure pay cycles, offers, counters & review applications.</p>
        </div>
        <app-quick-actions
          [actions]="actions"
          (navigate)="goTo($event)">
        </app-quick-actions>
      </header>

      <app-kpi-grid
        [submitted]="kpis()?.submitted || 0"
        [verified]="kpis()?.verified || 0"
        [approved]="kpis()?.approved || 0"
        [paid]="kpis()?.paid || 0"
        [disbursedCents]="kpis()?.disbursed_cents || 0"
        (refresh)="refresh()">
      </app-kpi-grid>

      <div class="grid lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <app-slots-remaining
            [remainingByOffer]="kpis()?.remainingByOffer || []"
            [offers]="kpis()?.offers || []"
            (manage)="goTo('counters')">
          </app-slots-remaining>

          <app-pending-apps (manageAll)="goTo('applications')"></app-pending-apps>

          <app-recent-activity (viewAll)="goTo('reports')"></app-recent-activity>
        </div>

        <div class="space-y-8">
          <app-system-health></app-system-health>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private router = inject(Router);
  private admin = inject(AdminUseCases);
  private seed = inject(SeedDevDataService);

  kpis = signal<any>(null);

  actions: QuickAction[] = [
    { id: 'pay-cycles',  label: 'Pay Cycles',  icon: '📆', route: '/admin/pay-cycles' },
    { id: 'loan-offers', label: 'Loan Offers', icon: '💸', route: '/admin/loan-offers' },
    { id: 'counters',    label: 'Counters',    icon: '🧮', route: '/admin/counters' },
    { id: 'applications',label: 'Applications',icon: '🗂️', route: '/admin/applications' },
    { id: 'banking',     label: 'Banking',     icon: '🏦', route: '/admin/banking' },
    { id: 'reports',     label: 'Reports',     icon: '📊', route: '/admin/reports' },
  ];

  ngOnInit(): void {
    // Ensure this month's counters exist (front-end in control)
    this.admin.seedMonthlyCounters$().subscribe();
    this.refresh();
  }

  refresh() {
    this.admin.kpis$().subscribe(k => this.kpis.set(k));
  }

  goTo(idOrRoute: string) {
    const route = this.actions.find(a => a.id === idOrRoute)?.route || idOrRoute;
    this.router.navigate([route]);
  }
}

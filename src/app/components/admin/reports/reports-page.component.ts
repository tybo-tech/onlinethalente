import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Observable, Subject, takeUntil } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { Application, LoanOffer, Payment } from '../../../../models/schema';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';

interface MonthlyStats {
  submitted: number;
  verified: number;
  approved: number;
  paid: number;
  disbursed_cents: number;
  approvalRate: number;
  conversionRate: number;
}

interface OfferStats {
  offerId: number;
  label: string;
  slotsTotal: number;
  slotsUsed: number;
  slotsRemaining: number;
  disbursed_cents: number;
}

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4">
      <!-- Header -->
      <h1 class="text-2xl font-bold mb-6">Reports</h1>

      <!-- Month Selector -->
      <div class="mb-6">
        <label for="month" class="block text-sm font-medium text-gray-700">Select Month</label>
        <input
          type="month"
          id="month"
          [ngModel]="selectedMonth"
          (ngModelChange)="onMonthChange($event)"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
      </div>

      <!-- KPIs -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-sm font-medium text-gray-500">Applications</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">{{ stats.submitted }}</p>
          <div class="mt-2 text-sm text-gray-600">
            <span>Verified: {{ stats.verified }}</span><br>
            <span>Approved: {{ stats.approved }}</span><br>
            <span>Paid: {{ stats.paid }}</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-sm font-medium text-gray-500">Conversion</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">{{ stats.approvalRate | percent:'1.0-0' }}</p>
          <div class="mt-2 text-sm text-gray-600">
            <span>Submitted → Approved</span><br>
            <span>Paid Rate: {{ stats.conversionRate | percent:'1.0-0' }}</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="text-sm font-medium text-gray-500">Disbursed</h3>
          <p class="mt-2 text-3xl font-semibold text-gray-900">R{{ stats.disbursed_cents / 100 }}</p>
          <div class="mt-2 text-sm text-gray-600">
            <span>Total amount paid out</span>
          </div>
        </div>
      </div>

      <!-- Offer Stats -->
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Per-Offer Breakdown</h2>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offer
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Slots
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Used
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disbursed
                </th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let offer of offerStats">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ offer.label }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ offer.slotsTotal }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ offer.slotsUsed }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ offer.slotsRemaining }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  R{{ offer.disbursed_cents / 100 }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Export -->
      <div>
        <button
          (click)="exportCSV()"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>
    </div>
  `
})
export class ReportsPageComponent implements OnInit, OnDestroy {
  selectedMonth: string;

  stats: MonthlyStats = {
    submitted: 0,
    verified: 0,
    approved: 0,
    paid: 0,
    disbursed_cents: 0,
    approvalRate: 0,
    conversionRate: 0
  };

  offerStats: OfferStats[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private la: LendingAdapter,
    private toast: ToastService
  ) {
    const now = new Date();
    this.selectedMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  ngOnInit() {
    this.loadStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMonthChange(month: string) {
    this.selectedMonth = month;
    this.loadStats();
  }

  private async loadStats() {
    // Get all data for the selected month
    const [offers, apps, payments] = await Promise.all([
      firstValueFrom(this.la.loanOffers$()),
      firstValueFrom(this.la.applications$()),
      firstValueFrom(this.la.payments$())
    ]);

    const periodStart = `${this.selectedMonth}-01`;
    const periodEnd = new Date(new Date(periodStart).getFullYear(), new Date(periodStart).getMonth() + 1, 0).toISOString();

    // Filter to month
    const monthApps = apps.filter(a =>
      a.data.created_at >= periodStart &&
      a.data.created_at < periodEnd
    );

    const monthPayments = payments.filter(p =>
      (p.data.processed_at || '') >= periodStart &&
      (p.data.processed_at || '') < periodEnd &&
      p.data.status === 'SUCCESS'
    );

    // Calculate stats
    this.stats = {
      submitted: monthApps.length,
      verified: monthApps.filter(a => a.data.status === 'VERIFIED').length,
      approved: monthApps.filter(a => a.data.status === 'APPROVED' || a.data.status === 'PAID').length,
      paid: monthApps.filter(a => a.data.status === 'PAID').length,
      disbursed_cents: monthPayments.reduce((sum, p) => sum + p.data.amount_cents, 0),
      approvalRate: monthApps.length ? (monthApps.filter(a => a.data.status === 'APPROVED' || a.data.status === 'PAID').length / monthApps.length) : 0,
      conversionRate: monthApps.length ? (monthApps.filter(a => a.data.status === 'PAID').length / monthApps.length) : 0
    };

    // Calculate per-offer stats
    this.offerStats = offers.map(offer => {
      const offerApps = monthApps.filter(a => a.data.offer_id === offer.id);
      const offerPayments = monthPayments.filter(p => {
        const app = apps.find(a => a.id === p.data.application_id);
        return app && app.data.offer_id === offer.id;
      });

      return {
        offerId: offer.id,
        label: offer.data.label || `R${offer.data.amount_cents/100}`,
        slotsTotal: offer.data.slots_total,
        slotsUsed: offerApps.filter(a => a.data.status === 'APPROVED' || a.data.status === 'PAID').length,
        slotsRemaining: offer.data.slots_total - offerApps.filter(a => a.data.status === 'APPROVED' || a.data.status === 'PAID').length,
        disbursed_cents: offerPayments.reduce((sum, p) => sum + p.data.amount_cents, 0)
      };
    });
  }

  async exportCSV() {
    try {
      // Get all payments for the month that are SUCCESS
      const [apps, payments] = await Promise.all([
        firstValueFrom(this.la.applications$()),
        firstValueFrom(this.la.payments$())
      ]);

      const periodStart = `${this.selectedMonth}-01`;
      const periodEnd = new Date(new Date(periodStart).getFullYear(), new Date(periodStart).getMonth() + 1, 0).toISOString();

      const successPayments = payments
        .filter(p =>
          p.data.status === 'SUCCESS' &&
          (p.data.processed_at || '') >= periodStart &&
          (p.data.processed_at || '') < periodEnd
        )
        .map(p => {
          const app = apps.find(a => a.id === p.data.application_id);
          return {
            processed_at: p.data.processed_at,
            application_id: p.data.application_id,
            amount_cents: p.data.amount_cents,
            offer_label: app?.data.offer_id || '',
            reference: p.data.reference || ''
          };
        });

      // Convert to CSV
      const headers = ['processed_at', 'application_id', 'amount_cents', 'offer_label', 'reference'];
      const csv = [
        headers.join(','),
        ...successPayments.map(p => headers.map(h => p[h as keyof typeof p]).join(','))
      ].join('\\n');

      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${this.selectedMonth}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      this.toast.success('CSV exported successfully');
    } catch (error) {
      this.toast.error('Failed to export CSV');
    }
  }
}

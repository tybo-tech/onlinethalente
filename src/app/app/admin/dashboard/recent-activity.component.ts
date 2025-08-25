import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LendingAdapter } from '../../../../services/business/lending.adapter';

type PaymentNode = { id: number; data: { amount_cents: number; processed_at?: string; status: string; reference?: string } };

@Component({
  standalone: true,
  selector: 'app-recent-activity',
  imports: [CommonModule],
  template: `
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Recent Activity</h2>
      <button (click)="viewAll.emit()" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
    </div>

    <div *ngIf="recent().length; else noActivity" class="space-y-3">
      <div *ngFor="let p of recent()" class="p-3 rounded-lg border border-gray-100 flex items-center justify-between">
        <div class="text-sm">
          <div class="font-medium">Payment</div>
          <div class="text-gray-600 text-xs">Ref: {{ p.data.reference || '-' }}</div>
        </div>
        <div class="text-sm font-semibold text-emerald-700">
          {{ toRand(p.data.amount_cents) }}
        </div>
      </div>
    </div>

    <ng-template #noActivity>
      <div class="text-center py-6 text-gray-600">No recent activity</div>
    </ng-template>
  </div>
  `
})
export class RecentActivityComponent {
  @Output() viewAll = new EventEmitter<void>();
  private la = inject(LendingAdapter);
  payments = signal<PaymentNode[]>([]);

  constructor() {
    this.la.payments$().subscribe(list => this.payments.set(list as any));
  }

  recent = computed(() =>
    this.payments()
      .filter(p => p.data.status === 'SUCCESS')
      .sort((a,b) => (b.data.processed_at || '').localeCompare(a.data.processed_at || ''))
      .slice(0, 6)
  );

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
  }
}

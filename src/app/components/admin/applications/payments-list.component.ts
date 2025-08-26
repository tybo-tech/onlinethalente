import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { Application, Payment, PaymentStatus } from '../../../../models/schema';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { BusinessTxService, Ok, Fail } from '../../../../services/business/business-tx.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <i class="fa fa-credit-card text-emerald-500" aria-hidden="true"></i> Payments
      </h3>

      <div class="space-y-2" *ngIf="!loading; else skel">
        <div *ngFor="let p of payments; trackBy: trackById" class="rounded-xl border p-3 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold">
              {{ (p.data.amount_cents/100) | currency:'ZAR':'symbol':'1.0-0' }}
            </p>
            <p class="text-xs text-gray-500">
              {{ p.data.status }} • {{ p.data.processed_at | date:'medium' }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                  [ngClass]="badge(p.data.status)">
              {{ p.data.status }}
            </span>
            <button *ngIf="p.data.status === 'PENDING'"
                    class="rounded-md bg-emerald-600 text-white text-xs px-3 py-1.5 hover:bg-emerald-700"
                    (click)="markPaid(p)">
              Mark Paid
            </button>
          </div>
        </div>
        <div *ngIf="payments.length === 0" class="text-sm text-gray-500 text-center py-6">No payments yet</div>
      </div>

      <ng-template #skel>
        <div class="space-y-2">
          <div class="h-14 rounded-xl border animate-pulse bg-gray-50"></div>
          <div class="h-14 rounded-xl border animate-pulse bg-gray-50"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class PaymentsListComponent implements OnInit, OnChanges {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Input() refreshTrigger?: any; // Used to trigger refresh when parent changes

  payments: ICollectionData<Payment>[] = [];
  loading = true;

  constructor(private la: LendingAdapter, private btx: BusinessTxService) {}

  async ngOnInit() {
    await this.loadPayments();
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Refresh when refreshTrigger input changes
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      await this.loadPayments();
    }
  }

  private async loadPayments() {
    this.loading = true;
    const all = await firstValueFrom(this.la.payments$());
    this.payments = (all || [])
      .filter(p => p.data.application_id === this.app.id)
      .sort((a, b) => (b.data.processed_at || '').localeCompare(a.data.processed_at || ''));
    this.loading = false;
  }

  trackById(_: number, x: { id: any }) { return x.id; }

  badge(s: string) {
    const k = (s||'').toUpperCase();
    return k === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
         : k === 'PAID'    ? 'bg-green-100 text-green-800'
         : k === 'FAILED'  ? 'bg-red-100 text-red-800'
         : 'bg-gray-100 text-gray-800';
  }

  async markPaid(p: ICollectionData<Payment>) {
    const res = await firstValueFrom(this.btx.markPaid$(p)) as Ok|Fail;
    if (res.ok) {
      // Refresh the entire list to get latest data
      await this.loadPayments();
    }
  }
}

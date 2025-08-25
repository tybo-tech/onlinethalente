import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

type OfferNode = { id: number; data: { label?: string; slots_total: number } };
type Remaining = { offer_id: number; slots_remaining: number };

@Component({
  standalone: true,
  selector: 'app-slots-remaining',
  imports: [CommonModule],
  template: `
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Slots Remaining</h2>
      <button (click)="manage.emit()" class="text-sm text-indigo-600 hover:text-indigo-700">Manage</button>
    </div>

    <div class="space-y-3">
      <div *ngFor="let r of remainingByOffer">
        <div class="flex justify-between text-sm">
          <div class="font-medium">
            {{ labelFor(r.offer_id) }}
          </div>
          <div class="font-semibold">{{ r.slots_remaining }}</div>
        </div>
        <div class="h-2 bg-gray-200 rounded">
          <div class="h-2 rounded"
               [style.width.%]="pct(r.offer_id, r.slots_remaining)"></div>
        </div>
      </div>
      <div *ngIf="!remainingByOffer?.length" class="text-gray-500 text-sm">No counters for current month.</div>
    </div>
  </div>
  `
})
export class SlotsRemainingComponent {
  @Input() offers: OfferNode[] = [];
  @Input() remainingByOffer: Remaining[] = [];
  @Output() manage = new EventEmitter<void>();

  labelFor(offerId: number) {
    const o = this.offers.find(x => x.id === offerId);
    return o?.data?.label || `Offer #${offerId}`;
    }

  pct(offerId: number, remaining: number) {
    const total = this.offers.find(o => o.id === offerId)?.data?.slots_total || 1;
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OfferCardVM = {
  id: number;
  amount_cents: number;
  slots_remaining: number;
  label?: string;
  sold_out_message?: string;
};

@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-1.5">
        <h3 class="text-xl font-bold">{{ toRand(offer.amount_cents) }}</h3>
        <span class="text-xs text-gray-500">{{ offer.label || (selectedDay + 'th') }}</span>
      </div>

      <p class="text-sm" [ngClass]="offer.slots_remaining === 0 ? 'text-rose-600' : 'text-gray-600'">
        {{ offer.slots_remaining }} slot{{ offer.slots_remaining === 1 ? '' : 's' }} remaining
      </p>

      <div class="mt-4 flex items-center justify-between">
        <button
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
          (click)="apply.emit(offer.id)"
          [disabled]="!isWindowOpen || offer.slots_remaining === 0">
          <i class="i-heroicons-arrow-right-circle text-base"></i>
          Apply
        </button>
        <i class="i-heroicons-shield-check text-gray-400 text-lg"></i>
      </div>

      <p *ngIf="offer.sold_out_message && offer.slots_remaining === 0" class="text-xs text-rose-600 mt-3">
        {{ offer.sold_out_message }}
      </p>
    </article>
  `
})
export class OfferCardComponent {
  @Input({ required: true }) offer!: OfferCardVM;
  @Input({ required: true }) selectedDay!: number;
  @Input() isWindowOpen = false;
  @Output() apply = new EventEmitter<number>();

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
  }
}

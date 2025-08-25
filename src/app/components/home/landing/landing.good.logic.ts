import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicAdapter } from '../../../../services/public.adapter';
import { SalaryDay } from '../../../../models/schema';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

type OfferCard = {
  id: number;
  amount_cents: number;
  slots_remaining: number;
  label?: string;              // optional if your adapter returns it
  sold_out_message?: string;   // optional if your adapter returns it
};

@Component({
  selector: 'app-landing-good-logic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <!-- Salary Day Selection -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Select Your Salary Day</h2>
        <div class="flex gap-3">
          <button
            *ngFor="let day of salaryDays; trackBy: trackByDay"
            (click)="selectSalaryDay(day)"
            class="px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
            [ngClass]="selectedDay === day ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'"
            [attr.aria-pressed]="selectedDay === day"
          >
            {{ day }}th
          </button>
        </div>
      </div>

      <!-- Window Status Banner -->
      <div *ngIf="selectedDay"
           class="p-4 rounded-lg mb-8 flex items-center gap-2"
           [ngClass]="isWindowOpen ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'"
           aria-live="polite">
        <i class="text-2xl" [ngClass]="isWindowOpen ? 'i-heroicons-check-circle text-green-600' : 'i-heroicons-clock text-yellow-600'"></i>
        <span class="text-sm">
          {{ isWindowOpen ? 'Applications are open!' : getWindowMessage() }}
        </span>
      </div>

      <!-- Offers Grid -->
      <div *ngIf="selectedDay" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          *ngFor="let offer of visibleOffers$ | async; trackBy: trackByOfferId"
          class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-bold">{{ toRand(offer.amount_cents) }}</h3>
            <span class="text-xs text-gray-500">{{ offer.label || (selectedDay + 'th') }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm"
                  [ngClass]="offer.slots_remaining === 0 ? 'text-rose-600' : 'text-gray-600'">
              {{ offer.slots_remaining }} slot{{ offer.slots_remaining === 1 ? '' : 's' }} remaining
            </span>

            <button
              (click)="applyForOffer(offer.id)"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
              [disabled]="!isWindowOpen || offer.slots_remaining === 0"
            >
              <i class="i-heroicons-arrow-right-circle text-base"></i>
              Apply
            </button>
          </div>

          <p *ngIf="offer.sold_out_message && offer.slots_remaining === 0"
             class="text-xs text-rose-600 mt-3">
            {{ offer.sold_out_message }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LandingGoodLogicComponent implements OnInit {
  private publicAdapter = inject(PublicAdapter);
  private router = inject(Router);

  salaryDays: SalaryDay[] = [15, 25, 31];
  selectedDay: SalaryDay = 15;
  isWindowOpen = false;

  visibleOffers$!: Observable<OfferCard[]>;

  ngOnInit(): void {
    // default selection on first render
    this.selectSalaryDay(this.selectedDay);
  }

  selectSalaryDay(day: SalaryDay) {
    this.selectedDay = day;
    this.visibleOffers$ = this.publicAdapter.visibleOffers$(day).pipe(
      tap(() => this.checkWindowStatus())
    );
  }

  checkWindowStatus() {
    this.isWindowOpen = this.publicAdapter.isWindowOpen(this.selectedDay);
  }

  getWindowMessage(): string {
    return this.publicAdapter.getWindowMessage(this.selectedDay);
  }

  applyForOffer(offerId: number) {
    this.router.navigate(['/apply'], { queryParams: { offer: offerId } });
  }

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
  }

  trackByDay = (_: number, d: SalaryDay) => d;
  trackByOfferId = (_: number, o: OfferCard) => o.id;
}

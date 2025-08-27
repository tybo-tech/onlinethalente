import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PublicAdapter, VisibleOffer } from '../../../../services/public.adapter';
import { SalaryDay } from '../../../../models/schema';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="relative bg-gradient-to-br from-gray-50 to-white py-24 px-4 md:px-6 overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute -top-20 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-amber-200 to-pink-300 opacity-20 blur-3xl rounded-full animate-float-slow z-0 pointer-events-none"></div>
    <div class="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-100 to-cyan-200 opacity-15 blur-3xl rounded-full animate-float-slow delay-2000 z-0 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
      <!-- Left: Marketing copy + selector + offers -->
      <div class="animate-fade-in-up transition duration-700">
        <!-- Tag -->
        <div class="mb-6">
          <span class="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <i class="i-heroicons-bolt-solid mr-1"></i>
            Fast Financing
          </span>
        </div>

        <!-- Headline & Sub -->
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4 text-balance">
          Smart <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Monthly Loans</span> Tailored For You
        </h1>
        <p class="text-lg text-gray-600 mb-6 max-w-prose">
          Choose your salary day to see available offers for your cycle. Instant verification, funds as soon as the next business day after approval.
        </p>

        <!-- Feature Badges -->
        <div class="flex flex-wrap gap-3 mb-8">
          <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full shadow-xs">
            <i class="i-heroicons-check-badge text-green-600"></i> Instant Approval
          </div>
          <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full shadow-xs">
            <i class="i-heroicons-rocket-launch text-blue-600"></i> Next-Day Funding
          </div>
          <div class="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-full shadow-xs">
            <i class="i-heroicons-lock-closed text-purple-600"></i> Bank-Level Security
          </div>
        </div>

        <!-- Salary Day Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            <i class="i-heroicons-calendar-days mr-1"></i> Select Your Salary Day
          </label>
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

        <!-- Window Banner -->
        <div *ngIf="selectedDay"
             class="p-3 rounded-lg mb-6 flex items-center gap-2"
             [ngClass]="isWindowOpen ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'"
             aria-live="polite">
          <i class="text-xl" [ngClass]="isWindowOpen ? 'i-heroicons-check-circle text-green-600' : 'i-heroicons-clock text-yellow-600'"></i>
          <span class="text-sm">
            {{ isWindowOpen ? 'Applications are open!' : getWindowMessage() }}
          </span>
        </div>

        <!-- Offers Cards -->
        <div *ngIf="selectedDay" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <article
            *ngFor="let offer of visibleOffers$ | async; trackBy: trackByOfferId"
            class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-1.5">
              <h3 class="text-xl font-bold">{{ toRand(offer.amount_cents) }}</h3>
              <span class="text-xs text-gray-500">{{ offer.pay_cycle_label || (selectedDay + 'th') }}</span>
            </div>
            <p class="text-sm"
               [ngClass]="offer.slots_remaining === 0 ? 'text-rose-600' : 'text-gray-600'">
              {{ offer.slots_remaining }} slot{{ offer.slots_remaining === 1 ? '' : 's' }} remaining
            </p>
            <div class="mt-4 flex items-center justify-between">
              <button
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
                (click)="applyForOffer(offer.id)"
                [disabled]="offer.disabled">
                <i class="i-heroicons-arrow-right-circle text-base"></i>
                Apply
              </button>
              <i class="i-heroicons-shield-check text-gray-400 text-lg"></i>
            </div>
            <p *ngIf="offer.sold_out_message && offer.slots_remaining === 0"
               class="text-xs text-rose-600 mt-3">
              {{ offer.sold_out_message }}
            </p>
          </article>
        </div>
      </div>

      <!-- Right: Illustration -->
      <div class="hidden md:flex justify-center animate-fade-in-up transition duration-700 delay-200 relative">
        <div class="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-10 left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        <div class="relative z-10">
          <img
            src="hero.png"
            alt="Modern loan application process"
            class="w-full max-w-md xl:max-w-lg object-contain drop-shadow-2xl"
            loading="lazy"
          />
          <!-- Floating card element -->
          <div class="absolute -bottom-6 -left-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float">
            <div class="flex items-center gap-3">
              <div class="bg-green-100 p-3 rounded-full">
                <i class="i-heroicons-banknotes text-green-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-500">Typical Offer</p>
                <p class="font-bold text-gray-800">{{ toRand(exampleAmountCents) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class LandingHeroComponent implements OnInit {
  private publicAdapter = inject(PublicAdapter);
  private router = inject(Router);

  salaryDays: SalaryDay[] = [15, 25, 31];
  selectedDay: SalaryDay = 15;
  isWindowOpen = false;

  visibleOffers$!: Observable<VisibleOffer[]>;
  exampleAmountCents = 70000;

  ngOnInit(): void {
    this.selectSalaryDay(this.selectedDay);
  }

  selectSalaryDay(day: SalaryDay) {
    this.selectedDay = day;
    this.visibleOffers$ = this.publicAdapter.visibleOffers$(day).pipe(
      tap(() => this.isWindowOpen = this.publicAdapter.isWindowOpen(this.selectedDay))
    );
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
  trackByOfferId = (_: number, o: VisibleOffer) => o.id;
}

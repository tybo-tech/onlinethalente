import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PublicAdapter } from '../../../../services/public.adapter';
import { SalaryDay } from '../../../../models/schema';
import { OfferCardVM } from './offer-card';
import { OffersGridComponent } from './offers-grid';
import { SalaryDaySelectorComponent } from './salary-day-selector';
import { WindowBannerComponent } from './window-banner';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [
    CommonModule,
    OffersGridComponent,
    SalaryDaySelectorComponent,
    WindowBannerComponent,
  ],
  template: `
    <section
      class="relative bg-gradient-to-br from-gray-50 to-white py-24 px-4 md:px-6 overflow-hidden"
    >
      <!-- Background blobs -->
      <div
        class="absolute -top-20 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-amber-200 to-pink-300 opacity-20 blur-3xl rounded-full animate-float-slow z-0 pointer-events-none"
      ></div>
      <div
        class="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-100 to-cyan-200 opacity-15 blur-3xl rounded-full animate-float-slow delay-2000 z-0 pointer-events-none"
      ></div>

      <div
        class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10"
      >
        <!-- Left column -->
        <div class="animate-fade-in-up transition duration-700">
          <div class="mb-6">
            <span
              class="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
            >
              <i class="i-heroicons-bolt-solid mr-1"></i> Fast Financing
            </span>
          </div>

          <h1
            class="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4 text-balance"
          >
            Smart
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
              >Monthly Loans</span
            >
            Tailored For You
          </h1>
          <p class="text-lg text-gray-600 mb-6 max-w-prose">
            Choose your salary day to see live offers from our system. Instant
            verification and quick payouts.
          </p>

          <div class="space-y-6">
            <app-salary-day-selector
              [salaryDays]="salaryDays"
              [selected]="selectedDay"
              (select)="onDaySelect($event)"
            >
            </app-salary-day-selector>

            <app-window-banner
              [selectedDay]="selectedDay"
              [isOpen]="isWindowOpen"
              [message]="getWindowMessage()"
            >
            </app-window-banner>

            <app-offers-grid
              [offers]="visibleOffers | async"
              [selectedDay]="selectedDay"
              [isWindowOpen]="isWindowOpen"
              (apply)="applyForOffer($event)"
            >
            </app-offers-grid>
          </div>
        </div>

        <!-- Right column: image -->
        <div
          class="hidden md:flex justify-center animate-fade-in-up transition duration-700 delay-200 relative"
        >
          <div
            class="absolute -top-10 -right-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
          ></div>
          <div
            class="absolute -bottom-10 left-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
          ></div>

          <div class="relative z-10">
            <img
              src="hero.png"
              alt="Modern loan application process"
              class="w-full max-w-md xl:max-w-lg object-contain drop-shadow-2xl"
              loading="lazy"
            />
            <div
              class="absolute -bottom-6 -left-10 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float"
            >
              <div class="flex items-center gap-3">
                <div class="bg-green-100 p-3 rounded-full">
                  <i class="i-heroicons-banknotes text-green-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Live Offers</p>
                  <p class="font-bold text-gray-800">
                    <!-- shows a typical amount from the stream if available -->
                    {{ (visibleOffers | async)?.[0]?.amount_cents ? toRand((visibleOffers | async)![0].amount_cents) : '—' }}
                  </p>
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

  visibleOffers!: Observable<OfferCardVM[]>;

  ngOnInit(): void {
    this.onDaySelect(this.selectedDay);
  }

  onDaySelect(day: SalaryDay) {
    this.selectedDay = day;
    this.visibleOffers = this.publicAdapter
      .visibleOffers$(day)
      .pipe(
        tap(
          () =>
            (this.isWindowOpen = this.publicAdapter.isWindowOpen(
              this.selectedDay
            ))
        )
      );
  }

  getWindowMessage(): string {
    return this.publicAdapter.getWindowMessage(this.selectedDay);
  }

  applyForOffer(offerId: number) {
    this.router.navigate(['/apply'], { queryParams: { offer: offerId } });
  }

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    });
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  combineLatest,
  firstValueFrom,
  map,
  of,
  switchMap,
  tap,
  take,
} from 'rxjs';
import { PublicAdapter } from '../../../../services/public.adapter';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import {
  SalaryDay,
  Application,
  ApplicationStatus,
} from '../../../../models/schema';
import { DocumentUploaderComponent, LocalDoc } from './document-uploader';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/User';

type Node<T> = { id: number; data: T };
type LoanOffer = {
  pay_cycle_id: number;
  amount_cents: number;
  slots_total: number;
  is_active: boolean;
  label?: string;
};
type PayCycle = {
  salary_day: SalaryDay;
  label: string;
  release_day: number;
  sold_out_message?: string;
};

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DocumentUploaderComponent],
  template: `
    <section
      class="relative bg-gradient-to-br from-gray-50 to-white py-24 px-4 md:px-6 overflow-hidden"
    >
      <!-- blobs -->
      <div
        class="absolute -top-20 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-amber-200 to-pink-300 opacity-20 blur-3xl rounded-full animate-float-slow z-0 pointer-events-none"
      ></div>
      <div
        class="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-gradient-to-br from-blue-100 to-cyan-200 opacity-15 blur-3xl rounded-full animate-float-slow delay-2000 z-0 pointer-events-none"
      ></div>

      <div
        class="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start relative z-10"
      >
        <!-- Left: Form -->
        <div class="animate-fade-in-up transition duration-700">
          <div class="mb-6">
            <span
              class="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
            >
              <i class="i-heroicons-clipboard-document-list mr-1"></i> Apply
            </span>
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              Complete your application
            </h1>
            <p class="text-gray-600 mt-2">
              Provide your details and upload your bank statements. We’ll verify
              and update you shortly.
            </p>
          </div>

          <!-- Applying as banner -->
          <div
            *ngIf="currentUser"
            class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center justify-between"
          >
            <div class="flex items-center gap-2">
              <i class="i-heroicons-user-circle"></i>
              <span
                >Applying as <strong>{{ currentUser.name }}</strong> ({{
                  currentUser.role
                }})</span
              >
            </div>
            <button
              type="button"
              class="btn-ghost text-blue-700 underline"
              (click)="prefillFromUser()"
            >
              Refresh from profile
            </button>
          </div>

          <div
            *ngIf="error"
            class="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm"
          >
            <i class="i-heroicons-exclamation-triangle mr-1"></i>{{ error }}
          </div>

          <form
            [formGroup]="form"
            (ngSubmit)="submit()"
            class="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <!-- Personal -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Full name</label
                >
                <input
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="full_name"
                  autocomplete="name"
                />
                <p
                  *ngIf="
                    form.get('full_name')?.invalid &&
                    form.get('full_name')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  Full name is required.
                </p>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >ID number</label
                >
                <input
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="id_number"
                  inputmode="numeric"
                  maxlength="13"
                  [disabled]="lockIdentity"
                />
                <p
                  *ngIf="
                    form.get('id_number')?.invalid &&
                    form.get('id_number')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  SA ID must be 13 digits.
                </p>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Email</label
                >
                <input
                  type="email"
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="email"
                  autocomplete="email"
                  [disabled]="lockIdentity"
                />
                <p
                  *ngIf="
                    form.get('email')?.invalid && form.get('email')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  Enter a valid email.
                </p>
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Phone</label
                >
                <input
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="phone"
                  autocomplete="tel"
                />
                <p
                  *ngIf="
                    form.get('phone')?.invalid && form.get('phone')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  Phone is required.
                </p>
              </div>
            </div>

            <!-- Banking -->
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Bank name</label
                >
                <input
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="bank_name"
                />
                <p
                  *ngIf="
                    form.get('bank_name')?.invalid &&
                    form.get('bank_name')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  Bank name is required.
                </p>
              </div>
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700"
                  >Salary account</label
                >
                <input
                  class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  formControlName="salary_account"
                />
                <p
                  *ngIf="
                    form.get('salary_account')?.invalid &&
                    form.get('salary_account')?.touched
                  "
                  class="text-xs text-rose-600"
                >
                  Account is required.
                </p>
              </div>
            </div>

            <!-- Documents -->
            <app-document-uploader [(files)]="docs"></app-document-uploader>

            <!-- Options -->
            <div class="flex flex-col gap-2">
              <label
                class="inline-flex items-start gap-2 text-sm text-gray-700"
              >
                <input
                  id="terms"
                  type="checkbox"
                  formControlName="accept_terms"
                  class="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  >I confirm the documents are authentic and agree to the
                  terms.</span
                >
              </label>

              <label
                *ngIf="currentUser"
                class="inline-flex items-start gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  formControlName="update_profile"
                  class="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span
                  >Update my profile with these details
                  (email/phone/ID/banking)</span
                >
              </label>
            </div>

            <p
              *ngIf="
                form.get('accept_terms')?.invalid &&
                form.get('accept_terms')?.touched
              "
              class="text-xs text-rose-600"
            >
              You must accept the terms.
            </p>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button type="button" class="btn-secondary" (click)="cancel()">
                <i class="i-heroicons-arrow-left mr-1"></i> Back
              </button>
              <button
                type="submit"
                [disabled]="submitting || form.invalid"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium disabled:opacity-50"
              >
                <i class="i-heroicons-paper-airplane"></i>
                {{ submitting ? 'Submitting…' : 'Submit Application' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Right: Offer Summary -->
        <aside
          class="hidden md:block animate-fade-in-up transition duration-700 delay-150"
        >
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-5"
          >
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Your Offer</h2>
              <i class="i-heroicons-currency-rand text-indigo-600 text-xl"></i>
            </div>

            <div class="text-3xl font-bold text-gray-900">
              {{ amountLabel }}
            </div>
            <div class="text-sm text-gray-600">
              Salary day: <span class="font-medium">{{ selectedDay }}th</span>
            </div>

            <div
              class="p-3 rounded-lg"
              [ngClass]="
                isWindowOpen
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              "
            >
              <div class="flex items-center gap-2">
                <i
                  [ngClass]="
                    isWindowOpen
                      ? 'i-heroicons-check-circle'
                      : 'i-heroicons-clock'
                  "
                ></i>
                <span class="text-sm">
                  {{ isWindowOpen ? 'Applications are open!' : windowMessage }}
                </span>
              </div>
            </div>

            <ul class="space-y-2 text-sm text-gray-700">
              <li class="flex items-center gap-2">
                <i class="i-heroicons-check-badge text-emerald-600"></i> AI
                checks on documents
              </li>
              <li class="flex items-center gap-2">
                <i class="i-heroicons-banknotes text-emerald-600"></i> Fast
                payout after approval
              </li>
              <li class="flex items-center gap-2">
                <i class="i-heroicons-shield-check text-emerald-600"></i>
                Bank-level security
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `,
})
export class ApplyPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private publicAdapter = inject(PublicAdapter);
  private lendingAdapter = inject(LendingAdapter);
  private userService = inject(UserService);

  submitting = false;
  error = '';

  offerId!: number;
  offerNode?: Node<LoanOffer>;
  payCycleNode?: Node<PayCycle>;

  selectedDay!: SalaryDay;
  isWindowOpen = false;
  windowMessage = '';
  amountLabel = '—';

  currentUser?: User;
  /** If user is verified, lock identity fields to avoid accidental edits. */
  lockIdentity = false;

  docs: LocalDoc[] = [];

  form = this.fb.group({
    full_name: ['', [Validators.required]],
    id_number: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    bank_name: ['', [Validators.required]],
    salary_account: ['', [Validators.required]],
    accept_terms: [false, [Validators.requiredTrue]],
    update_profile: [false], // only shown when currentUser exists
  });

  ngOnInit(): void {
    // 1) Prefill from current user once (if available)
    this.userService.$user?.pipe(take(1)).subscribe((u) => {
      if (!u) return;
      this.currentUser = u;
      this.lockIdentity = !!(u.is_verified || u.verified_at);
      this.prefillFromUser(false); // don't override later typing
    });

    // 2) Load offer + cycle from query string
    this.route.queryParamMap
      .pipe(
        map((q) => Number(q.get('offer') || 0)),
        switchMap((id) => {
          if (!id) {
            this.error =
              'Missing offer. Please select an offer from the landing page.';
            return of(null);
          }
          this.offerId = id;
          return combineLatest([
            this.lendingAdapter.loanOffers$(),
            this.lendingAdapter.payCycles$(),
          ]).pipe(
            map(([offers, cycles]) => {
              const offer = (offers as Node<LoanOffer>[]).find(
                (o) => o.id === id
              );
              if (!offer) return null;
              const cycle =
                (cycles as Node<PayCycle>[]).find(
                  (c) => c.id === offer.data.pay_cycle_id
                ) || null;
              return { offer, cycle };
            })
          );
        }),
        tap((pair) => {
          if (!pair) return;
          this.offerNode = pair.offer;
          this.payCycleNode = pair.cycle || undefined;
          this.selectedDay = (this.payCycleNode?.data.salary_day ??
            15) as SalaryDay;

          const cents = this.offerNode?.data.amount_cents ?? 0;
          this.amountLabel = this.toRand(cents);

          this.isWindowOpen = this.publicAdapter.isWindowOpen(this.selectedDay);
          this.windowMessage = this.publicAdapter.getWindowMessage(
            this.selectedDay
          );
        })
      )
      .subscribe({
        error: () => (this.error = 'Failed to load offer. Please try again.'),
      });
  }

  /** Manually re-apply profile values into the form (with optional override). */
  prefillFromUser(overrideTyped = true) {
    if (!this.currentUser) return;
    const u = this.currentUser;

    const patch: any = {
      full_name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      id_number: u.id_number || '',
    };

    // Banking from metadata if you store it there
    // e.g., u.metadata?.banking = { bank_name, salary_account }
    const meta = (u as any).metadata;
    if (meta && typeof meta === 'object') {
      if (meta.banking?.bank_name) patch.bank_name = meta.banking.bank_name;
      if (meta.banking?.salary_account)
        patch.salary_account = meta.banking.salary_account;
    }

    if (overrideTyped) this.form.reset(patch, { emitEvent: false });
    else this.form.patchValue(patch, { emitEvent: false });

    // Lock identity if verified
    if (this.lockIdentity) {
      this.form.get('id_number')?.disable({ emitEvent: false });
      this.form.get('email')?.disable({ emitEvent: false });
    }
  }

  async submit() {
    this.error = '';
    if (this.form.invalid || !this.offerNode || !this.payCycleNode) {
      this.form.markAllAsTouched();
      return;
    }

    // Re-check window + slots just-in-time
    try {
      const latest = await firstValueFrom(
        this.publicAdapter
          .visibleOffers$(this.selectedDay)
          .pipe(map((list) => list.find((o) => o.id === this.offerId)))
      );
      if (!latest) {
        this.error =
          'This offer is no longer available. Please choose another.';
        return;
      }
      if (!this.publicAdapter.isWindowOpen(this.selectedDay)) {
        this.error = this.publicAdapter.getWindowMessage(this.selectedDay);
        return;
      }
      if (latest.slots_remaining <= 0) {
        this.error = 'This offer is sold out for the current cycle.';
        return;
      }
    } catch {
      this.error = 'Could not verify availability. Please try again.';
      return;
    }

    this.submitting = true;

    try {
      const nowISO = new Date().toISOString();
      const v = this.form.getRawValue();
      const app: Application = {
        user_id: this.currentUser?.id ?? 0, // 🔗 link to logged-in user if present
        pay_cycle_id: this.payCycleNode!.id,
        offer_id: this.offerNode!.id,
        requested_amount_cents: this.offerNode!.data.amount_cents,
        bank_name: v.bank_name!,
        salary_account: v.salary_account!,
        salary_day: this.selectedDay,
        full_name: v.full_name!,
        email: v.email!, // may be disabled -> getRawValue preserves it
        phone: v.phone!,
        status: ApplicationStatus.SUBMITTED,
        ai_verification: 'PENDING' as any,
        submitted_at: nowISO,
        created_at: nowISO,
      };

      // 1) Create application
      const saved = await firstValueFrom(
        this.publicAdapter.createApplication(app)
      );

      // 2) Optionally update user profile (if logged-in and checkbox ticked)
      if (this.currentUser && this.form.value.update_profile) {
        const updated: User = {
          ...this.currentUser,
          name: v.full_name || this.currentUser.name,
          email: v.email || this.currentUser.email,
          phone: v.phone || this.currentUser.phone,
          id_number: v.id_number || this.currentUser.id_number,
          updated_by: this.currentUser.id,
          updated_at: nowISO,
          // store banking under metadata.banking for future prefills
          metadata: {
            ...(this.currentUser.metadata || {}),
            banking: {
              ...(this.currentUser.metadata?.banking || {}),
              bank_name: v.bank_name,
              salary_account: v.salary_account,
            },
          },
        };
        await firstValueFrom(this.userService.save(updated));
        // Refresh local state so future pages get the new values
        this.userService.updateUserState(updated);
      }

      // 3) Upload documents
      if (this.docs.length) {
        const enc = await Promise.all(
          this.docs.map((d) => this.encode(d.file))
        );
        await Promise.all(
          enc.map((b64) =>
            firstValueFrom(
              this.publicAdapter.addApplicationDoc(
                saved.id,
                b64,
                'BANK_STATEMENT'
              )
            )
          )
        );
      }

      // 4) Navigate to thank-you
      this.router.navigate(['/application', saved.id, 'done']);
    } catch {
      this.error = 'Submit failed. Please check your details and try again.';
    } finally {
      this.submitting = false;
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    });
  }

  private encode(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onerror = () => rej(r.error);
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
  }
}

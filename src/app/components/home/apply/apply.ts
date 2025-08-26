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
import { UserService } from '../../../../services/user.service';
import { EmailService } from '../../../../services/email.service';

import {
  SalaryDay,
  Application,
  ApplicationStatus,
  AIVerification,
} from '../../../../models/schema';
import { User } from '../../../../models/User';

import { DocumentUploaderComponent, LocalDoc } from './document-uploader';
import { ApplyHeaderComponent } from './components/apply-header.component';
import { BankingInfoComponent } from './components/banking-info.component';
import { OfferSummaryComponent } from './components/offer-summary.component';
import { PersonalInfoComponent } from './components/personal-info.component';
import { UploadService } from '../../shared/upload-input/UploadService';

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
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ApplyHeaderComponent,
    PersonalInfoComponent,
    BankingInfoComponent,
    OfferSummaryComponent,
    DocumentUploaderComponent,
  ],
  template: `
    <section
      class="relative bg-gradient-to-br from-gray-50 to-white py-24 px-4 md:px-6 overflow-hidden"
    >
      <!-- Background Elements -->
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
          <app-apply-header
            [currentUser]="currentUser"
            [error]="error"
            [offerId]="offerId"
            (refreshProfile)="prefillFromUser()"
            (logout)="logout()"
          >
          </app-apply-header>

          <form
            [formGroup]="form"
            (ngSubmit)="submit()"
            class="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <!-- Personal Info Section -->
            <app-personal-info
              [form]="form"
              [currentUser]="currentUser"
              [lockIdentity]="lockIdentity"
            >
            </app-personal-info>

            <!-- Banking Info Section -->
            <app-banking-info [form]="form"></app-banking-info>

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
              <button type="button" class="btn-tertiary" (click)="cancel()">
                <i class="i-heroicons-arrow-left"></i> Back
              </button>
              <button
                type="submit"
                [disabled]="submitting || form.invalid"
                class="btn-primary"
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
          <app-offer-summary
            [amountLabel]="amountLabel"
            [selectedDay]="selectedDay"
            [isWindowOpen]="isWindowOpen"
            [windowMessage]="windowMessage"
          >
          </app-offer-summary>
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
  private uploadService = inject(UploadService);
  private emailService = inject(EmailService);

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
    update_profile: [false],
  });
  applicationId?: number;

  ngOnInit(): void {
    this.initializeUserData();
    this.initializeOfferData();
  }

  private initializeUserData() {
    this.userService.$user?.pipe(take(1)).subscribe((u) => {
      if (!u) return;
      this.currentUser = u;
      this.lockIdentity = !!(u.is_verified || u.verified_at);
      this.prefillFromUser(false);
    });
  }

  private initializeOfferData() {
    this.route.queryParamMap
      .pipe(
        map((q) => Number(q.get('offer') || q.get('offerId') || 0)),
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

          this.amountLabel = this.toRand(
            this.offerNode?.data.amount_cents ?? 0
          );
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

  prefillFromUser(overrideTyped = true) {
    if (!this.currentUser) return;
    const u = this.currentUser;

    const patch: any = {
      full_name: u.name || '',
      email: u.email || '',
      phone: u.phone || '',
      id_number: u.id_number || '',
    };

    const meta = (u as any).metadata;
    if (meta?.banking) {
      patch.bank_name = meta.banking.bank_name;
      patch.salary_account = meta.banking.salary_account;
    }

    if (overrideTyped) this.form.reset(patch, { emitEvent: false });
    else this.form.patchValue(patch, { emitEvent: false });
  }

  async submit() {
    debugger
    this.error = '';
    if (this.form.invalid || !this.offerNode || !this.payCycleNode) {
      this.form.markAllAsTouched();
      return;
    }

    // Validate bank statements
    if (!this.publicAdapter.validateBankStatements(this.docs)) {
      return;
    }

    // Check if user has any pending applications
    if (
      this.currentUser &&
      !(await this.publicAdapter.validateApplicationEligibility(
        this.currentUser.id
      ))
    ) {
      return;
    }

    // Just-in-time validation
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
      await this.processSubmission();
      this.router.navigate(['/application', this.applicationId, 'done']);
    } catch {
      this.error = 'Submit failed. Please check your details and try again.';
    } finally {
      this.submitting = false;
    }
  }

  private async processSubmission() {
    const nowISO = new Date().toISOString();
    const v = this.form.getRawValue();

    // 1. Create application
    const app: Application = {
      user_id: this.currentUser?.id ?? 0,
      pay_cycle_id: this.payCycleNode!.id,
      offer_id: this.offerNode!.id,
      requested_amount_cents: this.offerNode!.data.amount_cents,
      bank_name: v.bank_name!,
      salary_account: v.salary_account!,
      salary_day: this.selectedDay,
      full_name: v.full_name!,
      email: v.email!,
      phone: v.phone!,
      status: ApplicationStatus.SUBMITTED,
      ai_verification: AIVerification.PASS, // Set initial AI verification status
      submitted_at: nowISO,
      created_at: nowISO,
    };

    const saved = await firstValueFrom(
      this.publicAdapter.createApplication(app)
    );

    if(!saved || !saved.id) {
      this.error = 'Failed to create application. Please try again.';
      this.applicationId = undefined;
      return;
    }

    this.applicationId = saved.id;

    // 2. Update user profile if requested
    if (this.currentUser && v.update_profile) {
      await this.updateUserProfile(v, nowISO);
    }

    // 3. Upload documents
    if (this.docs.length) {
      await this.uploadDocuments(saved.id);
    }

    // 4. Send emails (don't block on email failures)
    this.sendApplicationEmails(saved);
  }

  private sendApplicationEmails(app: any) {
    // Send confirmation email to customer (non-blocking)
    this.emailService.sendCustomerApplicationSubmitted(app).subscribe({
      next: (response) => {
        console.log('Customer confirmation email sent successfully:', response);
      },
      error: (error) => {
        console.error('Failed to send customer confirmation email:', error);
        // Don't show error to user as this is non-critical
      }
    });

    // Send notification email to admins (non-blocking)
    this.emailService.notifyAdminsNewApplication(app, 'application').subscribe({
      next: (responses) => {
        console.log('Admin notification emails sent successfully:', responses);
      },
      error: (error) => {
        console.error('Failed to send admin notification emails:', error);
        // Don't show error to user as this is non-critical
      }
    });
  }

  private async updateUserProfile(formValues: any, timestamp: string) {
    const updated: User = {
      ...this.currentUser!,
      name: formValues.full_name || this.currentUser!.name,
      email: formValues.email || this.currentUser!.email,
      phone: formValues.phone || this.currentUser!.phone,
      id_number: formValues.id_number || this.currentUser!.id_number,
      updated_by: this.currentUser!.id,
      updated_at: timestamp,
      metadata: {
        ...(this.currentUser!.metadata || {}),
        banking: {
          ...(this.currentUser!.metadata?.banking || {}),
          bank_name: formValues.bank_name,
          salary_account: formValues.salary_account,
        },
      },
    };

    await firstValueFrom(this.userService.save(updated));
    this.userService.updateUserState(updated);
  }

  private async uploadDocuments(applicationId: number) {
    await Promise.all(
      this.docs.map(async (doc) => {
        const formData = new FormData();
        formData.append('file', doc.file, doc.file.name);
        formData.append('dir', 'docs');

        try {
          const result = await firstValueFrom(
            this.uploadService.uploadFile(formData)
          );
          if (result.success) {
            const fileUrl = `${this.uploadService.url}/upload/${result.url}`;
            await firstValueFrom(
              this.publicAdapter.addApplicationDoc(
                applicationId,
                fileUrl,
                'BANK_STATEMENT'
              )
            );
          } else {
            throw new Error(result.message || 'Upload failed');
          }
        } catch (error) {
          console.error('Document upload failed:', error);
          throw error;
        }
      })
    );
  }

  logout() {
    this.userService.logout();
    this.currentUser = undefined;
    this.lockIdentity = false;
    this.form.enable();
    this.form.reset();
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
}

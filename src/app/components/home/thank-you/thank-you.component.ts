import {
  Component, OnInit, ChangeDetectionStrategy, inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { ICollectionData } from '../../../../models/ICollection';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container max-w-4xl mx-auto px-4 py-10">
      <div class="space-y-8">

        <!-- Header -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg ring-4 ring-green-100">
            <i class="fa-solid fa-circle-check text-white text-4xl"></i>
          </div>
          <h1 class="text-3xl font-extrabold mt-4 text-gray-900">Thank you for your application!</h1>
          <p class="text-sm text-gray-500 mt-1">
            We’ve received your request and sent a confirmation to <span class="font-medium">{{ data()?.email || 'your email' }}</span>.
          </p>
        </div>

        <!-- KPI Summary -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <i class="fa-solid fa-sack-dollar text-indigo-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Amount Requested</div>
                <div class="text-lg font-semibold">R{{ (data()?.requested_amount_cents || 0) / 100 | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <i class="fa-solid fa-percent text-amber-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Interest Rate</div>
                <div class="text-lg font-semibold">{{ data()?.interest_rate_percent || 0 }}%</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
                <i class="fa-solid fa-arrow-trend-up text-rose-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Interest Amount</div>
                <div class="text-lg font-semibold">R{{ (data()?.interest_amount_cents || 0) / 100 | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <i class="fa-solid fa-money-check-dollar text-emerald-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Total Repayment</div>
                <div class="text-lg font-semibold">R{{ totalRepaymentRands() }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50">
                <i class="fa-solid fa-calendar-days text-cyan-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Loan Term</div>
                <div class="text-lg font-semibold">{{ data()?.loan_term_months || 1 }} month{{ (data()?.loan_term_months || 1) > 1 ? 's' : '' }}</div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-fuchsia-50">
                <i class="fa-solid fa-hand-holding-dollar text-fuchsia-600"></i>
              </span>
              <div>
                <div class="text-xs text-gray-500">Estimated Monthly Installment</div>
                <div class="text-lg font-semibold">R{{ monthlyInstallmentRands() }}</div>
                <div class="text-[11px] text-gray-500" *ngIf="(data()?.loan_term_months || 1) > 1">Total divided across the term.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Application Card -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Application Details</h2>
              <p class="text-xs text-gray-500">Submitted on {{ data()?.created_at | date:'medium' }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold" [class]="getStatusColor(data()?.status)">
                <i class="fa-solid fa-circle mr-1 text-[9px]"></i> {{ data()?.status || 'PENDING' }}
              </span>
              <span *ngIf="data()?.ai_verification"
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                    [class]="data()?.ai_verification === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                <i class="fa-solid fa-shield-halved mr-1"></i> AI {{ data()?.ai_verification }}
              </span>
            </div>
          </div>

          <div class="px-6 py-5 space-y-6">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <div class="text-[12px] text-gray-500">Reference</div>
                <div class="font-mono text-sm">#{{ applicationId }}</div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Full Name</div>
                <div class="font-medium">{{ data()?.full_name || '-' }}</div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Email</div>
                <div class="font-medium">{{ data()?.email || '-' }}</div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Phone</div>
                <div class="font-medium">{{ data()?.phone || '-' }}</div>
              </div>
            </div>

            <div class="grid sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div>
                <div class="text-[12px] text-gray-500">Bank</div>
                <div class="font-medium flex items-center gap-2">
                  <i class="fa-solid fa-building-columns text-gray-500"></i>
                  {{ data()?.bank_name || '-' }}
                </div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Salary Account</div>
                <div class="font-medium">{{ maskedAccount() }}</div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Salary Day</div>
                <div class="font-medium">Every {{ data()?.salary_day || '-' }}</div>
              </div>
              <div>
                <div class="text-[12px] text-gray-500">Outstanding Balance</div>
                <div class="font-medium">R{{ (data()?.outstanding_balance_cents || data()?.total_repayment_amount_cents || 0) / 100 | number:'1.2-2' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 space-y-4">
          <h3 class="text-lg font-semibold text-indigo-900">What happens next?</h3>
          <ol class="space-y-3">
            <li class="flex gap-3 items-start text-sm">
              <i class="fa-solid fa-magnifying-glass text-indigo-600 mt-0.5"></i>
              <span>Our AI system verifies your documents.</span>
            </li>
            <li class="flex gap-3 items-start text-sm">
              <i class="fa-solid fa-user-check text-indigo-600 mt-0.5"></i>
              <span>Our team reviews your application and may contact you if anything is missing.</span>
            </li>
            <li class="flex gap-3 items-start text-sm">
              <i class="fa-solid fa-mobile-screen-button text-indigo-600 mt-0.5"></i>
              <span>You’ll receive a <span class="font-medium">DebiCheck</span> authorization on your phone. Approve to continue.</span>
            </li>
            <li class="flex gap-3 items-start text-sm">
              <i class="fa-solid fa-money-bill-transfer text-indigo-600 mt-0.5"></i>
              <span>Once approved, the funds are released to your account.</span>
            </li>
          </ol>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap justify-center gap-3 pt-2">
          <a routerLink="/status"
             [queryParams]="{ ref: applicationId }"
             class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="fa-solid fa-clipboard-list mr-2"></i>
            Track Status
          </a>
          <a routerLink="/"
             class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="fa-solid fa-house mr-2"></i>
            Home
          </a>
        </div>

      </div>
    </div>
  `
})
export class ThankYouComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private collectionService = inject(CollectionDataService);

  applicationId = this.route.snapshot.paramMap.get('id') || 'Unknown';
  application = signal<ICollectionData<Application> | null>(null);

  /** Convenience accessor for data blob */
  data = computed(() => this.application()?.data || null);

  ngOnInit() {
    if (this.applicationId !== 'Unknown') {
      this.collectionService.getDataById(Number(this.applicationId))
        .subscribe(app => this.application.set(app));
    }
  }

  /** Format cents -> "1,234.56" (without R) for template composition */
  private centsToRands(cents = 0): string {
    return ((cents || 0) / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  totalRepaymentRands(): string {
    return this.centsToRands(this.data()?.total_repayment_amount_cents || 0);
  }

  monthlyInstallmentRands(): string {
    const total = this.data()?.total_repayment_amount_cents || 0;
    const months = Math.max(1, this.data()?.loan_term_months || 1);
    const perMonth = total / months;
    return this.centsToRands(Math.round(perMonth));
  }

  maskedAccount(): string {
    const acc = this.data()?.salary_account || '';
    if (!acc) return '-';
    const last4 = acc.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

  getStatusColor(status?: ApplicationStatus): string {
    switch (status) {
      case 'SUBMITTED': return 'bg-yellow-100 text-yellow-800';
      case 'VERIFIED':  return 'bg-blue-100 text-blue-800';
      case 'APPROVED':  return 'bg-emerald-100 text-emerald-800';
      case 'DECLINED':  return 'bg-rose-100 text-rose-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  }
}

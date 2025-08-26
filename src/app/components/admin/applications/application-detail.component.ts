import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import {
  Application,
  DebiCheckEvent,
  Payment,
} from '../../../../models/schema';
import { ICollectionData } from '../../../../models/ICollection';
import {
  BusinessTxService,
  Ok,
  Fail,
} from '../../../../services/business/business-tx.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';
import { CollectionDataService } from '../../../../services/collection.data.service';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule],
  host: {
    '(document:keydown.escape)': 'onEsc()',
  },
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 z-50"
      aria-labelledby="app-detail-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
        (click)="close.emit()"
      ></div>

      <!-- Modal panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all
                 animate-[modalIn_.18s_ease-out]"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="flex items-start gap-3 p-5 border-b">
            <div class="grow">
              <h2
                id="app-detail-title"
                class="text-xl font-semibold text-gray-900 flex items-center gap-2"
              >
                Application Details
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  [ngClass]="statusBadge(app?.data?.status)"
                >
                  {{ app?.data?.status || 'UNKNOWN' }}
                </span>
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ app?.data?.full_name || '—' }} •
                {{ app?.data?.email || '—' }} • {{ app?.data?.phone || '—' }}
              </p>
            </div>

            <button
              #closeBtn
              type="button"
              (click)="close.emit()"
              class="shrink-0 rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Close"
            >
              <!-- X icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 8.586l4.95-4.95a1 1 0 111.414 1.415L11.415 10l4.95 4.95a1 1 0 01-1.415 1.414L10 11.415l-4.95 4.95A1 1 0 013.636 15.95L8.586 11 3.636 6.05A1 1 0 115.05 4.636L10 9.586z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="max-h-[72vh] overflow-y-auto p-5">
            <!-- Summary cards -->
            <div class="grid gap-4 md:grid-cols-3 mb-5">
              <div class="rounded-xl border p-4">
                <p class="text-xs text-gray-500">Requested Amount</p>
                <p class="mt-1 text-lg font-semibold">
                  {{
                    (app?.data?.requested_amount_cents || 0) / 100
                      | currency : 'ZAR' : 'symbol' : '1.0-0'
                  }}
                </p>
              </div>
              <div class="rounded-xl border p-4">
                <p class="text-xs text-gray-500">Salary Day</p>
                <p class="mt-1 text-lg font-semibold">
                  {{ app?.data?.salary_day || '—' }}
                </p>
              </div>
              <div class="rounded-xl border p-4">
                <p class="text-xs text-gray-500">AI Verification</p>
                <p class="mt-1">
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                    [ngClass]="aiBadge(app?.data?.ai_verification)"
                  >
                    {{ app?.data?.ai_verification || 'PENDING' }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Banking -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700">Banking Details</h3>
              <div class="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-gray-500">Bank</p>
                  <p class="font-medium text-gray-900 break-words">
                    {{ app?.data?.bank_name || '—' }}
                  </p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-gray-500">Account</p>
                  <p class="font-medium text-gray-900 break-words">
                    {{ app?.data?.salary_account || '—' }}
                  </p>
                </div>
                <div class="rounded-lg bg-gray-50 p-3">
                  <p class="text-gray-500">Status</p>
                  <p class="font-medium text-gray-900">
                    {{ app?.data?.status || '—' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-700">Documents</h3>
                <button
                  type="button"
                  class="text-xs text-indigo-600 hover:text-indigo-800"
                  (click)="copyAllDocLinks()"
                >
                  Copy all links
                </button>
              </div>

              <div
                class="mt-3 space-y-2"
                *ngIf="!loadingDocs; else docsSkeleton"
              >
                <div
                  *ngFor="let doc of documents; trackBy: trackById"
                  class="rounded-xl border p-3 flex items-start justify-between gap-4"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ doc?.data?.kind || 'Document' }}
                      </p>
                      <span
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                        [ngClass]="verdictBadge(doc?.data?.ai_result?.verdict)"
                      >
                        {{ doc?.data?.ai_result?.verdict || 'PENDING' }}
                      </span>
                    </div>
                    <p
                      class="mt-1 text-xs text-gray-500 break-all"
                      *ngIf="doc?.data?.storage_url as url"
                    >
                      {{ url }}
                    </p>
                    <ul
                      class="mt-1 text-xs text-gray-600 list-disc ps-4"
                      *ngIf="doc?.data?.ai_result?.reasons?.length"
                    >
                      <li *ngFor="let reason of doc.data.ai_result.reasons">
                        {{ reason }}
                      </li>
                    </ul>
                  </div>

                  <div class="shrink-0 flex items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm
                                               hover:bg-gray-50"
                      (click)="openUrl(doc?.data?.storage_url)"
                    >
                      <!-- eye icon -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-3a2 2 0 100-4 2 2 0 000 4z"
                        />
                      </svg>
                      View
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm
                                               hover:bg-gray-50"
                      (click)="copy(doc?.data?.storage_url)"
                    >
                      <!-- link icon -->
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M3.9 12a5 5 0 017.78-3.9l.7.54-1.26 1.58-.7-.55a3 3 0 10-.1 4.84l2.83 2.2a5 5 0 11-6.22 7.9l-.7-.55 1.25-1.57.7.55a3 3 0 10.1-4.84l-2.83-2.21A5 5 0 013.9 12z"
                        />
                      </svg>
                      Copy
                    </button>
                  </div>
                </div>

                <div
                  *ngIf="!documents?.length"
                  class="text-sm text-gray-500 text-center py-6"
                >
                  No documents uploaded yet
                </div>
              </div>

              <ng-template #docsSkeleton>
                <div class="space-y-2">
                  <div
                    class="h-16 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                  <div
                    class="h-16 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                </div>
              </ng-template>
            </div>

            <!-- DebiCheck Timeline -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-700">
                DebiCheck Timeline
              </h3>
              <div
                class="mt-3 space-y-2"
                *ngIf="!loadingEvents; else eventsSkeleton"
              >
                <div
                  *ngFor="let event of debiCheckEvents; trackBy: trackById"
                  class="rounded-xl border p-3"
                >
                  <p class="text-sm font-medium text-gray-900">
                    {{ event?.data?.status }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ event?.data?.created_at | date : 'medium' }}
                  </p>
                </div>
                <div
                  *ngIf="!debiCheckEvents?.length"
                  class="text-sm text-gray-500 text-center py-6"
                >
                  No DebiCheck events yet
                </div>
              </div>
              <ng-template #eventsSkeleton>
                <div class="space-y-2">
                  <div
                    class="h-12 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                  <div
                    class="h-12 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                </div>
              </ng-template>
            </div>

            <!-- Payments -->
            <div class="mb-2">
              <h3 class="text-sm font-medium text-gray-700">Payments</h3>
              <div
                class="mt-3 space-y-2"
                *ngIf="!loadingPayments; else paymentsSkeleton"
              >
                <div
                  *ngFor="let payment of payments; trackBy: trackById"
                  class="rounded-xl border p-3 flex items-center justify-between"
                >
                  <div>
                    <p class="text-sm font-semibold">
                      {{
                        (payment?.data?.amount_cents || 0) / 100
                          | currency : 'ZAR' : 'symbol' : '1.0-0'
                      }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ payment?.data?.status }} •
                      {{ payment?.data?.processed_at | date : 'medium' }}
                    </p>
                  </div>
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                    [ngClass]="paymentBadge(payment?.data?.status)"
                  >
                    {{ payment?.data?.status || 'UNKNOWN' }}
                  </span>
                </div>
                <div
                  *ngIf="!payments?.length"
                  class="text-sm text-gray-500 text-center py-6"
                >
                  No payments yet
                </div>
              </div>
              <ng-template #paymentsSkeleton>
                <div class="space-y-2">
                  <div
                    class="h-14 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                  <div
                    class="h-14 rounded-xl border animate-pulse bg-gray-50"
                  ></div>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Actions -->
          <div class="sticky bottom-0 bg-white border-t p-4">
            <div class="flex flex-wrap gap-2 justify-end">
              <button *ngIf="canVerify" class="btn-indigo" (click)="onVerify()">
                Verify
              </button>

              <button
                *ngIf="canInitDebiCheck"
                class="btn-indigo"
                (click)="onInitDebiCheck()"
              >
                Init DebiCheck
              </button>

              <button
                *ngIf="canConfirmDebiCheck"
                class="btn-indigo"
                (click)="onConfirmDebiCheck()"
              >
                Confirm DebiCheck
              </button>

              <button
                *ngIf="canApprove"
                class="btn-green"
                (click)="onApprove()"
              >
                Approve
              </button>

              <button *ngIf="canDecline" class="btn-red" (click)="onDecline()">
                Decline
              </button>

              <button
                *ngIf="canMarkPaid"
                class="btn-green"
                (click)="onMarkPaid()"
              >
                Mark Paid
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes modalIn {
        from {
          opacity: 0.9;
          transform: translateY(4px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .btn-indigo {
        @apply inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500;
      }
      .btn-green {
        @apply inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500;
      }
      .btn-red {
        @apply inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500;
      }
    `,
  ],
})
export class ApplicationDetailComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() app!: ICollectionData<Application>;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  @ViewChild('closeBtn') closeBtn!: ElementRef<HTMLButtonElement>;

  debiCheckEvents: ICollectionData<DebiCheckEvent>[] = [];
  payments: ICollectionData<Payment>[] = [];
  documents: ICollectionData<any>[] = [];
  userDetails: any = null;

  loadingEvents = true;
  loadingPayments = true;
  loadingDocs = true;

  private destroy$ = new Subject<void>();

  constructor(
    private btx: BusinessTxService,
    private la: LendingAdapter,
    private toast: ToastService,
    private collectionService: CollectionDataService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  ngAfterViewInit() {
    // Initial focus for accessibility
    queueMicrotask(() => this.closeBtn?.nativeElement?.focus());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async loadData() {
    // DebiCheck
    this.loadingEvents = true;
    firstValueFrom(this.btx.debiCheckEvents$(this.app))
      .then((res) => (this.debiCheckEvents = res || []))
      .finally(() => (this.loadingEvents = false));

    // Payments
    this.loadingPayments = true;
    firstValueFrom(this.la.payments$())
      .then((all) => {
        this.payments = (all || [])
          .filter(
            (p: ICollectionData<Payment>) =>
              p?.data?.application_id === this.app?.id
          )
          .sort((a, b) =>
            (b?.data?.processed_at || '').localeCompare(
              a?.data?.processed_at || ''
            )
          );
      })
      .finally(() => (this.loadingPayments = false));

    // User (live subscription ok)
    if (this.app?.parent_id) {
      this.collectionService
        .getDataById(this.app.parent_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((userData) => (this.userDetails = userData));
    }

    // Documents (live subscription ok)
    this.loadingDocs = true;
    this.collectionService
      .getChildren(this.app.id, 'application_documents')
      .pipe(takeUntil(this.destroy$))
      .subscribe((docs) => {
        this.documents = docs || [];
        this.loadingDocs = false;
      });
  }

  // === UI helpers ===
  statusBadge(status?: string) {
    switch ((status || '').toUpperCase()) {
      case 'SUBMITTED':
        return 'bg-gray-100 text-gray-800';
      case 'VERIFIED':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  aiBadge(val?: string) {
    switch ((val || '').toUpperCase()) {
      case 'PASS':
        return 'bg-green-100 text-green-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAIL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  verdictBadge(v?: string) {
    switch ((v || '').toUpperCase()) {
      case 'PASS':
        return 'bg-green-100 text-green-800';
      case 'WARN':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAIL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  paymentBadge(s?: string) {
    switch ((s || '').toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  trackById = (_: number, x: { id?: any }) => x?.id ?? x;

  openUrl(url?: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  async copy(url?: string) {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      this.toast.success('Link copied to clipboard');
    } catch {
      this.toast.error('Failed to copy link');
    }
  }

  async copyAllDocLinks() {
    const all = this.documents
      ?.map((d) => d?.data?.storage_url)
      .filter(Boolean)
      .join('\n');
    if (!all) {
      this.toast.error('No document links to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(all);
      this.toast.success('All document links copied');
    } catch {
      this.toast.error('Copy failed');
    }
  }

  onEsc() {
    this.close.emit();
  }

  // === State-derived guards ===
  get canVerify() {
    return this.app?.data?.status === 'SUBMITTED';
  }
  get canApprove() {
    return this.app?.data?.status === 'VERIFIED';
  }
  get canDecline() {
    const s = this.app?.data?.status;
    return s === 'SUBMITTED' || s === 'VERIFIED';
  }
  get canInitDebiCheck() {
    return (
      this.app?.data?.status === 'APPROVED' &&
      !this.debiCheckEvents.some((e) => e?.data?.status === 'INITIATED')
    );
  }
  get canConfirmDebiCheck() {
    return (
      this.app?.data?.status === 'APPROVED' &&
      this.debiCheckEvents.some((e) => e?.data?.status === 'INITIATED') &&
      !this.debiCheckEvents.some((e) => e?.data?.status === 'CONFIRMED')
    );
  }
  get canMarkPaid() {
    return (
      this.app?.data?.status === 'APPROVED' &&
      this.payments.some((p) => p?.data?.status === 'PENDING')
    );
  }

  // === Actions ===
  async onVerify() {
    // TODO: Wire your verify endpoint
    this.toast.error('Verify not implemented');
  }

  async onApprove() {
    const result = (await firstValueFrom(
      this.btx.approveApplication$(this.app)
    )) as Ok | Fail;
    if (result.ok) {
      this.toast.success('Application approved');
      this.refresh.emit();
    } else {
      this.toast.error(result.error);
    }
  }

  async onDecline() {
    // TODO: Wire your decline endpoint
    this.toast.error('Decline not implemented');
  }

  async onInitDebiCheck() {
    const result = (await firstValueFrom(this.btx.initDebiCheck$(this.app))) as
      | Ok
      | Fail;
    if (result.ok) {
      this.toast.success('DebiCheck initiated');
      await this.loadData();
    } else {
      this.toast.error(result.error);
    }
  }

  async onConfirmDebiCheck() {
    const result = (await firstValueFrom(
      this.btx.confirmDebiCheck$(this.app)
    )) as Ok | Fail;
    if (result.ok) {
      this.toast.success('DebiCheck confirmed');
      await this.loadData();
    } else {
      this.toast.error(result.error);
    }
  }

  async onMarkPaid() {
    const pendingPayment = this.payments.find(
      (p) => p?.data?.status === 'PENDING'
    );
    if (!pendingPayment) {
      this.toast.error('No pending payment found');
      return;
    }
    const result = (await firstValueFrom(
      this.btx.markPaid$(pendingPayment)
    )) as Ok | Fail;
    if (result.ok) {
      this.toast.success('Payment marked as paid');
      this.refresh.emit();
    } else {
      this.toast.error(result.error);
    }
  }
}

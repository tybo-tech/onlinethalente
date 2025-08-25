import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Application, DebiCheckEvent, Payment } from '../../../../models/schema';
import { ICollectionData } from '../../../../models/ICollection';
import { BusinessTxService, Ok, Fail } from '../../../../services/business/business-tx.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" (click)="close.emit()"></div>
    <div class="fixed inset-y-0 right-0 flex max-w-full">
      <div class="relative w-screen max-w-md">
        <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
          <!-- Header -->
          <div class="px-4 sm:px-6">
            <h2 class="text-lg font-medium text-gray-900">Application Details</h2>
          </div>

          <!-- Content -->
          <div class="relative mt-6 flex-1 px-4 sm:px-6">
            <!-- Applicant Info -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500">Applicant Information</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-900">{{ app.data.full_name }}</p>
                <p class="text-sm text-gray-600">{{ app.data.email }}</p>
                <p class="text-sm text-gray-600">{{ app.data.phone }}</p>
              </div>
            </div>

            <!-- Bank Info -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500">Banking Details</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-900">{{ app.data.bank_name }}</p>
                <p class="text-sm text-gray-600">Account: {{ app.data.salary_account }}</p>
                <p class="text-sm text-gray-600">Salary day: {{ app.data.salary_day }}</p>
              </div>
            </div>

            <!-- Offer Info -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500">Loan Details</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-900">Amount: R{{ app.data.requested_amount_cents / 100 }}</p>
                <p class="text-sm text-gray-600">Status: {{ app.data.status }}</p>
                <p class="text-sm text-gray-600">AI Verdict: {{ app.data.ai_verification || 'Pending' }}</p>
              </div>
            </div>

            <!-- DebiCheck Timeline -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500">DebiCheck Timeline</h3>
              <div class="mt-2">
                <div *ngFor="let event of debiCheckEvents" class="mb-2">
                  <p class="text-sm text-gray-900">{{ event.data.status }}</p>
                  <p class="text-xs text-gray-600">{{ event.data.created_at | date:'medium' }}</p>
                </div>
              </div>
            </div>

            <!-- Payments -->
            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500">Payments</h3>
              <div class="mt-2">
                <div *ngFor="let payment of payments" class="mb-2">
                  <p class="text-sm text-gray-900">R{{ payment.data.amount_cents / 100 }}</p>
                  <p class="text-xs text-gray-600">{{ payment.data.status }} - {{ payment.data.processed_at | date:'medium' }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="sticky bottom-0 bg-white pb-6">
              <div class="flex flex-col gap-2">
                <button
                  *ngIf="canVerify"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  (click)="onVerify()"
                >
                  Verify
                </button>
                <button
                  *ngIf="canInitDebiCheck"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  (click)="onInitDebiCheck()"
                >
                  Init DebiCheck
                </button>
                <button
                  *ngIf="canConfirmDebiCheck"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  (click)="onConfirmDebiCheck()"
                >
                  Confirm DebiCheck
                </button>
                <button
                  *ngIf="canApprove"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  (click)="onApprove()"
                >
                  Approve
                </button>
                <button
                  *ngIf="canDecline"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  (click)="onDecline()"
                >
                  Decline
                </button>
                <button
                  *ngIf="canMarkPaid"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  (click)="onMarkPaid()"
                >
                  Mark Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationDetailComponent implements OnInit {
  @Input() app!: ICollectionData<Application>;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  debiCheckEvents: ICollectionData<DebiCheckEvent>[] = [];
  payments: ICollectionData<Payment>[] = [];

  constructor(
    private btx: BusinessTxService,
    private la: LendingAdapter,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  private async loadData() {
    // Load DebiCheck events
    this.debiCheckEvents = await firstValueFrom(this.btx.debiCheckEvents$(this.app));

    // Load payments
    this.payments = (await firstValueFrom(this.la.payments$()))
      .filter((p: ICollectionData<Payment>) => p.data.application_id === this.app.id)
      .sort((a: ICollectionData<Payment>, b: ICollectionData<Payment>) =>
        (b.data.processed_at || '').localeCompare(a.data.processed_at || ''));
  }

  get canVerify() {
    return this.app.data.status === 'SUBMITTED';
  }

  get canApprove() {
    return this.app.data.status === 'VERIFIED';
  }

  get canDecline() {
    return this.app.data.status === 'SUBMITTED' || this.app.data.status === 'VERIFIED';
  }

  get canInitDebiCheck() {
    return this.app.data.status === 'APPROVED' &&
           !this.debiCheckEvents.some(e => e.data.status === 'INITIATED');
  }

  get canConfirmDebiCheck() {
    return this.app.data.status === 'APPROVED' &&
           this.debiCheckEvents.some(e => e.data.status === 'INITIATED') &&
           !this.debiCheckEvents.some(e => e.data.status === 'CONFIRMED');
  }

  get canMarkPaid() {
    return this.app.data.status === 'APPROVED' &&
           this.payments.some(p => p.data.status === 'PENDING');
  }

  async onVerify() {
    // TODO: Implement verify endpoint
    this.toast.error('Verify not implemented');
  }

  async onApprove() {
    const result = await firstValueFrom(this.btx.approveApplication$(this.app)) as Ok | Fail;
    if (result.ok) {
      this.toast.success('Application approved');
      this.refresh.emit();
    } else {
      this.toast.error(result.error);
    }
  }

  async onDecline() {
    // TODO: Implement decline endpoint
    this.toast.error('Decline not implemented');
  }

  async onInitDebiCheck() {
    const result = await firstValueFrom(this.btx.initDebiCheck$(this.app)) as Ok | Fail;
    if (result.ok) {
      this.toast.success('DebiCheck initiated');
      await this.loadData();
    } else {
      this.toast.error(result.error);
    }
  }

  async onConfirmDebiCheck() {
    const result = await firstValueFrom(this.btx.confirmDebiCheck$(this.app)) as Ok | Fail;
    if (result.ok) {
      this.toast.success('DebiCheck confirmed');
      await this.loadData();
    } else {
      this.toast.error(result.error);
    }
  }

  async onMarkPaid() {
    const pendingPayment = this.payments.find(p => p.data.status === 'PENDING');
    if (!pendingPayment) {
      this.toast.error('No pending payment found');
      return;
    }

    const result = await firstValueFrom(this.btx.markPaid$(pendingPayment)) as Ok | Fail;
    if (result.ok) {
      this.toast.success('Payment marked as paid');
      this.refresh.emit();
    } else {
      this.toast.error(result.error);
    }
  }
}

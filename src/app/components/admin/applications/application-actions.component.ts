import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { Application, AIVerification, ApplicationStatus } from '../../../../models/schema';
import { BusinessTxService, Ok, Fail } from '../../../../services/business/business-tx.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-application-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 p-6 bg-gray-50 border-t border-gray-200">
      <!-- Main Status Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Application Status</h3>
          <p class="mt-1 text-sm text-gray-600">Update the application's current status</p>
        </div>

        <div class="flex items-center space-x-3">
          <div class="flex-1">
            <select
              [(ngModel)]="selectedStatus"
              (change)="updateStatus()"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              [disabled]="busy"
            >
              <option [value]="ApplicationStatus.SUBMITTED">Submitted</option>
              <option [value]="ApplicationStatus.VERIFIED">Verified</option>
              <option [value]="ApplicationStatus.APPROVED">Approved</option>
              <option [value]="ApplicationStatus.DECLINED">Declined</option>
              <option [value]="ApplicationStatus.PAID">Paid</option>
            </select>
          </div>
          <div class="flex-shrink-0">
            <span [class]="'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ' + getStatusColor()">
              {{ selectedStatus }}
            </span>
          </div>
        </div>
      </div>

      <!-- AI Verification Card -->
      <div *ngIf="shouldShowAIVerification()"
           class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">AI Verification</h3>
          <p class="mt-1 text-sm text-gray-600">Set the AI verification status for this application</p>
        </div>

        <div class="flex items-center space-x-3">
          <div class="flex-1">
            <select
              [(ngModel)]="selectedAIStatus"
              (change)="updateAIVerification()"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
              [disabled]="busy"
            >
              <option [value]="AIVerification.PENDING">Pending</option>
              <option [value]="AIVerification.PASS">Pass</option>
              <option [value]="AIVerification.WARN">Warning</option>
              <option [value]="AIVerification.FAIL">Failed</option>
            </select>
          </div>
          <div class="flex-shrink-0">
            <span [class]="'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ' + getAIStatusColor()">
              {{ selectedAIStatus }}
            </span>
          </div>
        </div>
      </div>

      <!-- DebiCheck Card -->
      <div *ngIf="shouldShowDebiCheck()"
           class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">DebiCheck Management</h3>
          <p class="mt-1 text-sm text-gray-600">Manage DebiCheck verification process</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            *ngIf="canInitDebiCheck"
            (click)="initDebiCheck()"
            [disabled]="busy"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg *ngIf="!busy" class="mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <svg *ngIf="busy" class="mr-2 h-4 w-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Initialize DebiCheck
          </button>

          <button
            *ngIf="canConfirmDebiCheck"
            (click)="confirmDebiCheck()"
            [disabled]="busy"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg *ngIf="!busy" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg *ngIf="busy" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Confirm DebiCheck
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ApplicationActionsComponent implements OnInit {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Output() changed = new EventEmitter<void>();

  busy = false;
  selectedAIStatus: AIVerification = AIVerification.PENDING;
  selectedStatus: ApplicationStatus = ApplicationStatus.SUBMITTED;
  AIVerification = AIVerification; // Make enum available in template
  ApplicationStatus = ApplicationStatus; // Make enum available in template

  constructor(
    private btx: BusinessTxService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.selectedStatus = this.app.data.status;
    this.selectedAIStatus = this.app.data.ai_verification || AIVerification.PENDING;
  }

  shouldShowAIVerification(): boolean {
    return this.app.data.status === ApplicationStatus.SUBMITTED;
  }

  shouldShowDebiCheck(): boolean {
    return this.app.data.status === ApplicationStatus.APPROVED;
  }

  getStatusColor() {
    switch (this.selectedStatus) {
      case ApplicationStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.VERIFIED:
        return 'bg-indigo-100 text-indigo-800';
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.DECLINED:
        return 'bg-red-100 text-red-800';
      case ApplicationStatus.PAID:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  async updateStatus() {
    if (this.selectedStatus === this.app.data.status) return;

    try {
      this.busy = true;
      let r: Ok | Fail;

      switch (this.selectedStatus) {
        case ApplicationStatus.VERIFIED:
          r = await firstValueFrom(this.btx.verifyApplication$(this.app));
          break;
        case ApplicationStatus.APPROVED:
          r = await firstValueFrom(this.btx.approveApplication$(this.app));
          break;
        case ApplicationStatus.DECLINED:
          r = await firstValueFrom(this.btx.declineApplication$(this.app));
          break;
        case ApplicationStatus.PAID:
          r = await firstValueFrom(this.btx.markApplicationPaid$(this.app));
          break;
        default:
          this.toast.error('Invalid status transition');
          return;
      }

      if (r.ok) {
        this.changed.emit();
        this.toast.success(`Application status updated to ${this.selectedStatus}`);
      } else {
        this.toast.error(r.error);
        // Reset selection on error
        this.selectedStatus = this.app.data.status;
      }
    } finally {
      this.busy = false;
    }
  }

  get canInitDebiCheck()  { return this.app.data.status === ApplicationStatus.APPROVED && !this.has('INITIATED'); }
  get canConfirmDebiCheck(){ return this.app.data.status === ApplicationStatus.APPROVED && this.has('INITIATED') && !this.has('CONFIRMED'); }

  private has(status: string) {
    // Optionally accept an input of events; otherwise call an endpoint to check.
    // For simplicity this relies on your backend state transitions before showing this bar again.
    return false;
  }

  getAIStatusColor() {
    switch (this.selectedAIStatus) {
      case AIVerification.PASS: return 'bg-green-100 text-green-800';
      case AIVerification.WARN: return 'bg-yellow-100 text-yellow-800';
      case AIVerification.FAIL: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  async updateAIVerification() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.updateAIVerification$(this.app, this.selectedAIStatus)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('AI verification status updated');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }

  async verify() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.verifyApplication$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('Application verified');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }

  async decline() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.declineApplication$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('Application declined');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }

  async approve() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.approveApplication$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('Application approved');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }

  async initDebiCheck() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.initDebiCheck$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('DebiCheck initialized');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }
  async confirmDebiCheck() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.confirmDebiCheck$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('DebiCheck confirmed');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }

  async markPaid() {
    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.markApplicationPaid$(this.app)) as Ok|Fail;
      if (r.ok) {
        this.changed.emit();
        this.toast.success('Application marked as paid');
      } else {
        this.toast.error(r.error);
      }
    } finally {
      this.busy = false;
    }
  }
}

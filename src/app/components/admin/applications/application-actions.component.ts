import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import {
  Application,
  AIVerification,
  ApplicationStatus,
} from '../../../../models/schema';
import {
  BusinessTxService,
  Ok,
  Fail,
} from '../../../../services/business/business-tx.service';
import { ToastService } from '../../../../services/toast.service';

/**
 * ApplicationActionsComponent
 *
 * Handles application status management and related operations while maintaining
 * proper parent-child relationships in the data architecture:
 *
 * - Application (parent) -> DebiCheckEvent (child): Links via application_id
 * - Application (parent) -> Payment (child): Links via application_id
 * - Application (parent) -> ApplicationDocument (child): Links via application_id
 *
 * All operations emit 'changed' events to refresh parent lists and maintain data consistency.
 */
@Component({
  selector: 'app-application-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 p-6 bg-gray-50 border-t border-gray-200">
      <!-- Status and AI Verification Side by Side -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Application Status Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              Application Status
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              Update the application's current status
            </p>
          </div>

          <div class="space-y-3">
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
            <div class="flex justify-center">
              <span
                [class]="
                  'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ' +
                  getStatusColor()
                "
              >
                {{ selectedStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- AI Verification Card -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900">AI Verification</h3>
            <p class="mt-1 text-sm text-gray-600">
              Set the AI verification status
            </p>
          </div>

          <div class="space-y-3">
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
            <div class="flex justify-center">
              <span
                [class]="
                  'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ' +
                  getAIStatusColor()
                "
              >
                {{ selectedAIStatus }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- DebiCheck Card -->
      <div
        *ngIf="shouldShowDebiCheck()"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            DebiCheck Management
          </h3>
          <p class="mt-1 text-sm text-gray-600">
            Create and manage DebiCheck verification
          </p>
        </div>

        <div class="flex justify-center">
          <button
            (click)="createDebiCheck()"
            [disabled]="busy"
            class="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              *ngIf="!busy"
              class="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <svg
              *ngIf="busy"
              class="mr-2 h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Create DebiCheck
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ApplicationActionsComponent implements OnInit {
  @Input({ required: true }) app!: ICollectionData<Application>;
  @Output() changed = new EventEmitter<void>();

  busy = false;
  selectedAIStatus: AIVerification = AIVerification.PENDING;
  selectedStatus: ApplicationStatus = ApplicationStatus.SUBMITTED;
  AIVerification = AIVerification; // Make enum available in template
  ApplicationStatus = ApplicationStatus; // Make enum available in template

  constructor(private btx: BusinessTxService, private toast: ToastService) {}

  ngOnInit() {
    this.selectedStatus = this.app.data.status;
    this.selectedAIStatus =
      this.app.data.ai_verification || AIVerification.PENDING;
  }

  shouldShowAIVerification(): boolean {
    return true; // Always show AI verification dropdown
  }

  shouldShowDebiCheck(): boolean {
    return this.app.data.status === ApplicationStatus.APPROVED;
  }

  async createDebiCheck() {
    if (!this.app.id) {
      this.toast.error('Application ID is required for DebiCheck creation');
      return;
    }

    try {
      this.busy = true;
      const r = await firstValueFrom(this.btx.initDebiCheck$(this.app));
      if (r.ok) {
        // Emit change event to refresh parent list
        this.changed.emit();
        this.toast.success(`DebiCheck initiated for Application #${this.app.id}`);
      } else {
        this.toast.error(`Failed to create DebiCheck: ${r.error}`);
      }
    } catch (error: any) {
      this.toast.error(`Error creating DebiCheck: ${error.message || 'Unknown error'}`);
    } finally {
      this.busy = false;
    }
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

    if (!this.app.id) {
      this.toast.error('Application ID is required for status updates');
      this.selectedStatus = this.app.data.status; // Reset
      return;
    }

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
          this.selectedStatus = this.app.data.status; // Reset
          return;
      }

      if (r.ok) {
        // Emit change event to refresh parent list with updated data
        this.changed.emit();
        this.toast.success(
          `Application #${this.app.id} status updated to ${this.selectedStatus}`
        );
      } else {
        this.toast.error(`Failed to update status: ${r.error}`);
        // Reset selection on error to maintain data integrity
        this.selectedStatus = this.app.data.status;
      }
    } catch (error: any) {
      this.toast.error(`Error updating status: ${error.message || 'Unknown error'}`);
      this.selectedStatus = this.app.data.status; // Reset on error
    } finally {
      this.busy = false;
    }
  }

  get canInitDebiCheck() {
    return (
      this.app.data.status === ApplicationStatus.APPROVED &&
      !this.has('INITIATED')
    );
  }
  get canConfirmDebiCheck() {
    return (
      this.app.data.status === ApplicationStatus.APPROVED &&
      this.has('INITIATED') &&
      !this.has('CONFIRMED')
    );
  }

  private has(status: string) {
    // Optionally accept an input of events; otherwise call an endpoint to check.
    // For simplicity this relies on your backend state transitions before showing this bar again.
    return false;
  }

  getAIStatusColor() {
    switch (this.selectedAIStatus) {
      case AIVerification.PASS:
        return 'bg-green-100 text-green-800';
      case AIVerification.WARN:
        return 'bg-yellow-100 text-yellow-800';
      case AIVerification.FAIL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  async updateAIVerification() {
    if (!this.app.id) {
      this.toast.error('Application ID is required for AI verification updates');
      return;
    }

    try {
      this.busy = true;
      const r = (await firstValueFrom(
        this.btx.updateAIVerification$(this.app, this.selectedAIStatus)
      )) as Ok | Fail;
      if (r.ok) {
        // Emit change event to refresh parent list
        this.changed.emit();
        this.toast.success(
          `AI verification for Application #${this.app.id} updated to ${this.selectedAIStatus}`
        );
      } else {
        this.toast.error(`Failed to update AI verification: ${r.error}`);
      }
    } catch (error: any) {
      this.toast.error(`Error updating AI verification: ${error.message || 'Unknown error'}`);
    } finally {
      this.busy = false;
    }
  }

  async verify() {
    try {
      this.busy = true;
      const r = (await firstValueFrom(
        this.btx.verifyApplication$(this.app)
      )) as Ok | Fail;
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
      const r = (await firstValueFrom(
        this.btx.declineApplication$(this.app)
      )) as Ok | Fail;
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
      const r = (await firstValueFrom(
        this.btx.approveApplication$(this.app)
      )) as Ok | Fail;
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
      const r = (await firstValueFrom(this.btx.initDebiCheck$(this.app))) as
        | Ok
        | Fail;
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
      const r = (await firstValueFrom(this.btx.confirmDebiCheck$(this.app))) as
        | Ok
        | Fail;
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
      const r = (await firstValueFrom(
        this.btx.markApplicationPaid$(this.app)
      )) as Ok | Fail;
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

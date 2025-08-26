import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    <div class="sticky bottom-0 bg-white p-4 border-t">
      <!-- AI Verification Selector -->
      <div *ngIf="app.data.status === 'SUBMITTED'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          AI Verification Status
        </label>
        <div class="flex gap-2 items-center">
          <select
            [(ngModel)]="selectedAIStatus"
            (change)="updateAIVerification()"
            class="flex-grow rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option [value]="AIVerification.PENDING">Pending</option>
            <option [value]="AIVerification.PASS">Pass</option>
            <option [value]="AIVerification.WARN">Warn</option>
            <option [value]="AIVerification.FAIL">Fail</option>
          </select>
          <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getAIStatusColor()">
            {{ selectedAIStatus }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <button
          *ngIf="canVerify"
          (click)="verify()"
          [disabled]="busy"
          class="btn-primary"
        >
          Verify
        </button>

        <button
          *ngIf="canApprove"
          (click)="approve()"
          [disabled]="busy"
          class="btn-success"
        >
          Approve
        </button>

        <button
          *ngIf="canDecline"
          (click)="decline()"
          [disabled]="busy"
          class="btn-danger"
        >
          Decline
        </button>

        <button
          *ngIf="canInitDebiCheck"
          (click)="initDebiCheck()"
          [disabled]="busy"
          class="btn-secondary"
        >
          Init DebiCheck
        </button>

        <button
          *ngIf="canConfirmDebiCheck"
          (click)="confirmDebiCheck()"
          [disabled]="busy"
          class="btn-secondary"
        >
          Confirm DebiCheck
        </button>

        <button
          *ngIf="canMarkPaid"
          (click)="markPaid()"
          [disabled]="busy"
          class="btn-success"
        >
          Mark Paid
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .btn-primary {
      @apply inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-secondary {
      @apply inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-success {
      @apply inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    .btn-danger {
      @apply inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed;
    }
  `]
})
export class ApplicationActionsComponent {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Output() changed = new EventEmitter<void>();

  busy = false;
  selectedAIStatus: AIVerification = AIVerification.PENDING;
  AIVerification = AIVerification; // Make enum available in template

  constructor(
    private btx: BusinessTxService,
    private toast: ToastService
  ) {}

  get canVerify()         { return this.app.data.status === 'SUBMITTED'; }
  get canApprove()        { return this.app.data.status === 'VERIFIED'; }
  get canDecline()        { const s = this.app.data.status; return s === 'SUBMITTED' || s === 'VERIFIED'; }
  get canInitDebiCheck()  { return this.app.data.status === 'APPROVED' && !this.has('INITIATED'); }
  get canConfirmDebiCheck(){ return this.app.data.status === 'APPROVED' && this.has('INITIATED') && !this.has('CONFIRMED'); }
  get canMarkPaid() { return this.app.data.status === 'APPROVED' && this.has('CONFIRMED'); }

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

import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { BusinessTxService } from '../../../../services/business/business-tx.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ICollectionData } from '../../../../models/ICollection';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { ToastService } from '../../../../services/toast.service';

type AppNode = ICollectionData<Application>;

@Component({
  standalone: true,
  selector: 'app-pending-apps',
  imports: [CommonModule],
  template: `
  <div class="bg-white rounded-xl shadow-sm p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">Pending Applications</h2>
      <button (click)="manageAll.emit()" class="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
        Manage All
      </button>
    </div>

    <div *ngIf="pending().length; else none" class="space-y-3">
      <div *ngFor="let it of pending()" class="border rounded-lg p-3 flex items-center justify-between">
        <div>
          <div class="font-semibold text-gray-900">{{ it.data.full_name }}</div>
          <div class="text-xs text-gray-600">
            {{ it.data.email }} • {{ it.data.phone }} • R{{ (it.data.requested_amount_cents/100).toFixed(0) }}
          </div>
        </div>
        <div class="flex gap-2">
          <button class="text-xs px-3 py-1.5 rounded bg-gray-800 text-white"
                  (click)="verify(it)" [disabled]="busy()">
            Verify
          </button>
          <button class="text-xs px-3 py-1.5 rounded bg-emerald-600 text-white"
                  (click)="approve(it)" [disabled]="busy()">
            Approve
          </button>
          <button class="text-xs px-3 py-1.5 rounded bg-rose-600 text-white"
                  (click)="decline(it)" [disabled]="busy()">
            Decline
          </button>
        </div>
      </div>
    </div>

    <ng-template #none>
      <div class="text-center py-6 text-gray-600">
        No pending applications.
      </div>
    </ng-template>
  </div>
  `
})
export class PendingAppsComponent {
  private la = inject(LendingAdapter);
  private tx = inject(BusinessTxService);
  private rules = inject(BusinessRulesService);
  private toast = inject(ToastService);

  @Output() manageAll = new EventEmitter<void>();

  apps = signal<AppNode[]>([]);
  busy = signal(false);

  constructor() { this.refresh(); }

  refresh() {
    this.la.applications$().subscribe(list => this.apps.set(list));
  }

  pending = computed(() =>
    this.apps().filter(a =>
      a.data.status === ApplicationStatus.SUBMITTED || a.data.status === ApplicationStatus.VERIFIED
    ).slice(0, 6)
  );

  verify(it: AppNode) {
    if (this.busy()) return;
    this.busy.set(true);
    it.data.status = ApplicationStatus.VERIFIED;
    this.rules.touch(it);
    this.la.update(it).subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.success(`Application for ${it.data.full_name} has been verified`);
        this.refresh();
      },
      error: () => {
        this.busy.set(false);
        this.toast.error('Failed to verify application. Please try again.');
      },
    });
  }

  approve(it: AppNode) {
    if (this.busy()) return;
    this.busy.set(true);
    this.tx.approveApplication$(it).subscribe({
      next: (res) => {
        this.busy.set(false);
        if (!res.ok) {
          this.toast.error(res.error || 'Failed to approve application');
        } else {
          this.toast.success(`Application for ${it.data.full_name} has been approved`);
          this.refresh();
        }
      },
      error: () => {
        this.busy.set(false);
        this.toast.error('Failed to approve application. Please try again.');
      }
    });
  }

  decline(it: AppNode) {
    if (this.busy()) return;
    this.busy.set(true);
    it.data.status = ApplicationStatus.DECLINED;
    this.rules.touch(it);
    this.la.update(it).subscribe({
      next: () => {
        this.busy.set(false);
        this.toast.info(`Application for ${it.data.full_name} has been declined`);
        this.refresh();
      },
      error: () => {
        this.busy.set(false);
        this.toast.error('Failed to decline application. Please try again.');
      },
    });
  }
}

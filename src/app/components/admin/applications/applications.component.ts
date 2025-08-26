import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../models/ICollection';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { BusinessTxService } from '../../../../services/business/business-tx.service';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { ToastService } from '../../../../services/toast.service';
import { ApplicationDetailModalComponent } from './application-detail-modal.component';

@Component({
  selector: 'ap-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ApplicationDetailModalComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
            Loan Applications
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Manage all loan requests in one place
          </p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:w-48">
            <select
              [ngModel]="statusFilter()"
              (ngModelChange)="statusFilter.set($event); applyFilter()"
              class="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">All Applications</option>
              <option [value]="ApplicationStatus.SUBMITTED">Submitted</option>
              <option [value]="ApplicationStatus.VERIFIED">Verified</option>
              <option [value]="ApplicationStatus.APPROVED">Approved</option>
              <option [value]="ApplicationStatus.DECLINED">Declined</option>
            </select>
            <div
              class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
            >
              <i class="i-heroicons-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Applicant
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              *ngFor="let app of filtered()"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-medium">{{
                      app.data.full_name.charAt(0) || 'U'
                    }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ app.data.full_name }}
                    </div>
                    <div class="text-xs text-gray-500">ID: {{ app.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ app.data.email }}</div>
                <div class="text-xs text-gray-500">{{ app.data.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  R{{ app.data.requested_amount_cents / 100 }}
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  [class]="
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' +
                    getStatusColor(app.data.status)
                  "
                >
                  {{ app.data.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ app.data.created_at | date : 'medium' }}
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button
                  (click)="showDetails(app)"
                  class="text-xs px-3 py-1.5 rounded bg-gray-800 text-white hover:bg-gray-700"
                >
                  View Details
                </button>
              </td>
            </tr>
            <tr *ngIf="!filtered().length" class="hover:bg-gray-50">
              <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                No applications found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Application Detail Modal -->
    <app-application-detail-modal *ngIf="selectedApplication"
      [app]="selectedApplication"
      (close)="closeDetails()"
    >
    </app-application-detail-modal>
  `,
})
export class ApplicationsComponent implements OnInit {
  private la = inject(LendingAdapter);
  private tx = inject(BusinessTxService);
  private rules = inject(BusinessRulesService);
  private toast = inject(ToastService);

  protected ApplicationStatus = ApplicationStatus;

  applications = signal<ICollectionData<Application>[]>([]);
  filtered = signal<ICollectionData<Application>[]>([]);
  busy = signal(false);
  statusFilter = signal('All');
  selectedApplication?: ICollectionData<Application>;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.la.applications$().subscribe((apps) => {
      this.applications.set(apps);
      this.applyFilter();
    });
  }

  applyFilter() {
    const filtered =
      this.statusFilter() === 'All'
        ? this.applications()
        : this.applications().filter(
            (app) => app.data.status === this.statusFilter()
          );
    this.filtered.set(filtered);
  }

  showDetails(app: ICollectionData<Application>) {
    this.selectedApplication = app;
  }

  closeDetails() {
    this.selectedApplication = undefined;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.VERIFIED:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.DECLINED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

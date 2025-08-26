import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { ICollectionData } from '../../../../models/ICollection';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container max-w-3xl mx-auto px-4 py-8">
      <div class="space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <i class="i-heroicons-check-circle text-6xl text-green-500 mx-auto"></i>
          <h1 class="text-3xl font-bold mt-4">Thank You for Your Application!</h1>
        </div>

        <!-- Application Details -->
        <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 class="text-lg font-semibold text-gray-900">Application Details</h2>
          </div>

          <div class="px-6 py-4 space-y-4">
            <!-- Reference Number -->
            <div>
              <div class="text-sm text-gray-500">Reference Number</div>
              <div class="font-mono text-lg">{{ applicationId }}</div>
            </div>

            <div *ngIf="application()">
              <!-- Personal Information -->
              <div class="grid sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <div class="text-sm text-gray-500">Full Name</div>
                  <div class="font-medium">{{ application()?.data?.full_name || '-' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Email</div>
                  <div class="font-medium">{{ application()?.data?.email || '-' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Phone</div>
                  <div class="font-medium">{{ application()?.data?.phone || '-' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Salary Day</div>
                  <div class="font-medium">{{ application()?.data?.salary_day || '-' }}</div>
                </div>
              </div>

              <!-- Loan Details -->
              <div class="grid sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-4">
                <div>
                  <div class="text-sm text-gray-500">Amount Requested</div>
                  <div class="font-medium">
                    R{{ (application()?.data?.requested_amount_cents || 0) / 100 | number:'1.2-2' }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Status</div>
                  <div>
                    <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getStatusColor(application()?.data?.status)">
                      {{ application()?.data?.status || 'PENDING' }}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Bank Name</div>
                  <div class="font-medium">{{ application()?.data?.bank_name || '-' }}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Account Number</div>
                  <div class="font-medium">{{ application()?.data?.salary_account || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 class="text-lg font-semibold">Next Steps</h2>
          <ol class="space-y-3">
            <li class="flex gap-3 items-center text-sm">
              <i class="i-heroicons-document-magnifying-glass text-gray-400"></i>
              <span>Our AI system will verify your submitted documents</span>
            </li>
            <li class="flex gap-3 items-center text-sm">
              <i class="i-heroicons-user-circle text-gray-400"></i>
              <span>Our team will review your application</span>
            </li>
            <li class="flex gap-3 items-center text-sm">
              <i class="i-heroicons-check-badge text-gray-400"></i>
              <span>You'll receive a DebiCheck authorization request</span>
            </li>
            <li class="flex gap-3 items-center text-sm">
              <i class="i-heroicons-banknotes text-gray-400"></i>
              <span>Once approved, funds will be transferred to your account</span>
            </li>
          </ol>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-4 pt-4">
          <a routerLink="/status"
             [queryParams]="{ref: applicationId}"
             class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="i-heroicons-document-magnifying-glass mr-2"></i>
            Track Application Status
          </a>
          <a routerLink="/"
             class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <i class="i-heroicons-home mr-2"></i>
            Return to Home
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

  ngOnInit() {
    if (this.applicationId !== 'Unknown') {
      this.loadApplication();
    }
  }

  private loadApplication() {
    this.collectionService.getDataById(Number(this.applicationId))
      .subscribe(app => {
        this.application.set(app);
      });
  }

  getStatusColor(status?: ApplicationStatus): string {
    if (!status) return 'bg-gray-100 text-gray-800';

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

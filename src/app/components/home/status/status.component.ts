import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicAdapter } from '../../../../services/public.adapter';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { ICollectionData } from '../../../../models/ICollection';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container max-w-3xl mx-auto px-4 py-8">
      <!-- Search Form -->
      <form
        [formGroup]="searchForm"
        (ngSubmit)="onSearch()"
        class="mb-8 space-y-4"
      >
        <h1 class="text-2xl font-bold mb-4">Track Your Application</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-2 rounded-lg border"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1"> ID Number </label>
            <input
              type="text"
              formControlName="idNumber"
              class="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>

        <button
          type="submit"
          [disabled]="!searchForm.valid || isSearching"
          class="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
        >
          {{ isSearching ? 'Searching...' : 'Search' }}
        </button>
      </form>

      <!-- Application Status -->
      <ng-container *ngIf="currentApplication">
        <div class="space-y-6">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div
              class="flex flex-col md:flex-row justify-between items-start gap-4"
            >
              <div class="space-y-4 flex-grow">
                <div>
                  <h2 class="text-xl font-semibold flex items-center gap-2">
                    <span>Application #{{ currentApplication.id }}</span>
                    <span class="text-sm text-gray-500"
                      >(Ref:
                      {{ currentApplication.data.offer_id || 'N/A' }})</span
                    >
                  </h2>
                  <div class="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <div class="text-gray-500">Submitted On</div>
                      <div class="font-medium">
                        {{
                          currentApplication.data.submitted_at | date : 'medium'
                        }}
                      </div>
                    </div>
                    <div>
                      <div class="text-gray-500">Full Name</div>
                      <div class="font-medium">
                        {{ currentApplication.data.full_name }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Banking Details -->
                <div class="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                  <div>
                    <div class="text-gray-500">Amount Requested</div>
                    <div class="font-medium">
                      R{{
                        currentApplication.data.requested_amount_cents / 100
                      }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">Payment Day</div>
                    <div class="font-medium">
                      Day {{ currentApplication.data.salary_day }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">Bank Name</div>
                    <div class="font-medium">
                      {{ currentApplication.data.bank_name }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">Account Number</div>
                    <div class="font-medium">
                      ••••
                      {{ currentApplication.data.salary_account.slice(-4) }}
                    </div>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="grid grid-cols-2 gap-4 text-sm border-t pt-3">
                  <div>
                    <div class="text-gray-500">Email</div>
                    <div class="font-medium">
                      {{ currentApplication.data.email }}
                    </div>
                  </div>
                  <div>
                    <div class="text-gray-500">Phone</div>
                    <div class="font-medium">
                      {{ currentApplication.data.phone }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Badges -->
              <div class="flex flex-col items-end gap-2">
                <div
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  [ngClass]="{
                    'bg-yellow-100 text-yellow-800':
                      currentApplication.data.status === 'SUBMITTED',
                    'bg-blue-100 text-blue-800':
                      currentApplication.data.status === 'VERIFIED',
                    'bg-green-100 text-green-800':
                      currentApplication.data.status === 'APPROVED',
                    'bg-purple-100 text-purple-800':
                      currentApplication.data.status === 'PAID',
                    'bg-red-100 text-red-800':
                      currentApplication.data.status === 'DECLINED'
                  }"
                >
                  {{ currentApplication.data.status }}
                </div>
                <div
                  class="px-3 py-1 text-xs font-medium bg-gray-100 rounded-full"
                >
                  AI Verification:
                  {{ currentApplication.data.ai_verification }}
                </div>
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="relative">
            <div class="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

            <div class="space-y-8">
              <div class="relative flex items-start gap-8 pl-12">
                <div
                  class="absolute left-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <i class="i-heroicons-check text-white"></i>
                </div>
                <div>
                  <h3 class="font-medium">Application Submitted</h3>
                  <p class="text-sm text-gray-600">
                    We've received your application and documents
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ currentApplication.data.submitted_at | date : 'medium' }}
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div
                  class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  [class.bg-green-500]="
                    currentApplication.data.ai_verification !== 'PENDING'
                  "
                >
                  <i
                    class="i-heroicons-document-magnifying-glass"
                    [class.text-white]="
                      currentApplication.data.ai_verification !== 'PENDING'
                    "
                  ></i>
                </div>
                <div>
                  <h3 class="font-medium">AI Verification</h3>
                  <p class="text-sm text-gray-600">
                    Automated verification of your documents
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    Status: {{ currentApplication.data.ai_verification }}
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div
                  class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  [class.bg-green-500]="
                    currentApplication.data.status === 'APPROVED' ||
                    currentApplication.data.status === 'PAID'
                  "
                >
                  <i
                    class="i-heroicons-user-circle"
                    [class.text-white]="
                      currentApplication.data.status === 'APPROVED' ||
                      currentApplication.data.status === 'PAID'
                    "
                  ></i>
                </div>
                <div>
                  <h3 class="font-medium">Review & Approval</h3>
                  <p class="text-sm text-gray-600">Manual review by our team</p>
                  <p
                    class="text-xs text-gray-500 mt-1"
                    *ngIf="currentApplication.data.status === 'APPROVED'"
                  >
                    Approved on
                    {{ currentApplication.updated_at | date : 'medium' }}
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div
                  class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  [class.bg-green-500]="
                    currentApplication.data.status === 'PAID'
                  "
                >
                  <i
                    class="i-heroicons-banknotes"
                    [class.text-white]="
                      currentApplication.data.status === 'PAID'
                    "
                  ></i>
                </div>
                <div>
                  <h3 class="font-medium">Payment</h3>
                  <p class="text-sm text-gray-600">
                    Loan amount disbursed to your account
                  </p>
                  <p
                    class="text-xs text-gray-500 mt-1"
                    *ngIf="currentApplication.data.status === 'PAID'"
                  >
                    Paid on
                    {{ currentApplication.updated_at | date : 'medium' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Declined Message -->
          <div
            *ngIf="currentApplication.data.status === 'DECLINED'"
            class="p-6 bg-red-50 rounded-lg"
          >
            <h3 class="font-semibold text-red-800">Application Declined</h3>
            <p class="text-red-600">
              We regret to inform you that your application has been declined.
            </p>
            <p class="mt-2 text-sm">
              For more information, please contact our support team at
              <a
                href="mailto:support@thalente.co.za"
                class="text-red-800 underline"
              >
                support{{ '@' }}thalente.co.za
              </a>
            </p>
          </div>
        </div>
      </ng-container>

      <!-- No Results Message -->
      <div
        *ngIf="searched && !currentApplication && !error"
        class="text-center py-8"
      >
        <i class="i-heroicons-inbox text-4xl text-gray-400 mb-2"></i>
        <p>No application found with the provided details.</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="p-4 bg-red-50 text-red-800 rounded-lg">
        {{ error }}
      </div>
    </div>
  `,
})
export class StatusComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private publicAdapter = inject(PublicAdapter);
  private collDSeer = inject(CollectionDataService);

  searchForm: FormGroup;
  isSearching = false;
  searched = false;
  error = '';
  currentApplication?: ICollectionData<Application, any>;

  constructor() {
    this.searchForm = this.fb.group(
      {
        email: ['', [Validators.email]],
        idNumber: ['', [Validators.pattern(/^\d{13}$/)]],
      },
      {
        validators: (form) => {
          const email = form.get('email')?.value;
          const idNumber = form.get('idNumber')?.value;
          return email || idNumber ? null : { atLeastOne: true };
        },
      }
    );
  }

  ngOnInit() {
    // Check for reference number in query params
    const ref = this.route.snapshot.queryParams['ref'];
    debugger;
    if (ref) {
      this.lookupApplicationById(ref);
    }
  }

  async onSearch() {
    if (this.searchForm.invalid) return;

    const { email, idNumber } = this.searchForm.value;
    if (!email && !idNumber) {
      this.error = 'Please provide either an email address or ID number';
      return;
    }

    this.isSearching = true;
    this.error = '';

    try {
      // Search by email/ID returns application ID
      const result = await this.publicAdapter.searchApplication(
        email,
        idNumber
      );
      if (result?.id) {
        this.lookupApplicationById(result.id);
      } else {
        this.currentApplication = undefined;
      }
      this.searched = true;
    } catch (error) {
      console.error('Search failed:', error);
      this.error = 'Failed to search for application. Please try again.';
    } finally {
      this.isSearching = false;
    }
  }

  private async lookupApplicationById(id: number) {
    this.isSearching = true;
    this.error = '';

    try {
      this.collDSeer.getDataById(id).subscribe({
        next: (data) => {
          this.currentApplication = data;
          this.searched = true;
        },
        error: (error) => {
          console.error('Lookup failed:', error);
          this.error =
            'Failed to find application. Please try searching with your email or ID number.';
        },
      });
    } catch (error) {
      console.error('Lookup failed:', error);
      this.error =
        'Failed to find application. Please try searching with your email or ID number.';
    } finally {
      this.isSearching = false;
    }
  }
}

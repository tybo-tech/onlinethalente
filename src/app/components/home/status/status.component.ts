import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicAdapter } from '../../../../services/public.adapter';
import { Application, ApplicationStatus } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container max-w-3xl mx-auto px-4 py-8">
      <!-- Search Form -->
      <form [formGroup]="searchForm"
            (ngSubmit)="onSearch()"
            class="mb-8 space-y-4">
        <h1 class="text-2xl font-bold mb-4">Track Your Application</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input type="email"
                   formControlName="email"
                   class="w-full px-4 py-2 rounded-lg border" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              ID Number
            </label>
            <input type="text"
                   formControlName="idNumber"
                   class="w-full px-4 py-2 rounded-lg border" />
          </div>
        </div>

        <button type="submit"
                [disabled]="!searchForm.valid || isSearching"
                class="w-full md:w-auto px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
          {{ isSearching ? 'Searching...' : 'Search' }}
        </button>
      </form>

      <!-- Application Status -->
      <ng-container *ngIf="currentApplication">
        <div class="space-y-6">
          <div class="p-6 bg-gray-50 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-semibold">
                  Application #{{ currentApplication.id }}
                </h2>
                <p class="text-gray-600">
                  Submitted on {{ currentApplication.submission_date | date }}
                </p>
              </div>
              <div [ngSwitch]="currentApplication.status"
                   class="px-3 py-1 rounded-full text-sm font-medium"
                   [ngClass]="{
                     'bg-yellow-100 text-yellow-800': currentApplication.status === 'SUBMITTED',
                     'bg-blue-100 text-blue-800': currentApplication.status === 'VERIFIED',
                     'bg-green-100 text-green-800': currentApplication.status === 'APPROVED',
                     'bg-purple-100 text-purple-800': currentApplication.status === 'PAID',
                     'bg-red-100 text-red-800': currentApplication.status === 'DECLINED'
                   }">
                {{ currentApplication.status }}
              </div>
            </div>
          </div>

          <!-- Status Timeline -->
          <div class="relative">
            <div class="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>

            <div class="space-y-8">
              <div class="relative flex items-start gap-8 pl-12">
                <div class="absolute left-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <i class="i-heroicons-check text-white"></i>
                </div>
                <div>
                  <h3 class="font-medium">Application Submitted</h3>
                  <p class="text-sm text-gray-600">
                    We've received your application and documents
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                     [class.bg-green-500]="currentApplication.status !== 'SUBMITTED'">
                  <i class="i-heroicons-document-magnifying-glass"
                     [class.text-white]="currentApplication.status !== 'SUBMITTED'"></i>
                </div>
                <div>
                  <h3 class="font-medium">AI Verification</h3>
                  <p class="text-sm text-gray-600">
                    Automated verification of your documents
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                     [class.bg-green-500]="currentApplication.status === 'APPROVED' || currentApplication.status === 'PAID'">
                  <i class="i-heroicons-user-circle"
                     [class.text-white]="currentApplication.status === 'APPROVED' || currentApplication.status === 'PAID'"></i>
                </div>
                <div>
                  <h3 class="font-medium">Review & Approval</h3>
                  <p class="text-sm text-gray-600">
                    Manual review by our team
                  </p>
                </div>
              </div>

              <div class="relative flex items-start gap-8 pl-12">
                <div class="absolute left-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                     [class.bg-green-500]="currentApplication.status === 'PAID'">
                  <i class="i-heroicons-banknotes"
                     [class.text-white]="currentApplication.status === 'PAID'"></i>
                </div>
                <div>
                  <h3 class="font-medium">Payment</h3>
                  <p class="text-sm text-gray-600">
                    Loan amount disbursed to your account
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Declined Message -->
          <div *ngIf="currentApplication.status === 'DECLINED'"
               class="p-6 bg-red-50 rounded-lg">
            <h3 class="font-semibold text-red-800">Application Declined</h3>
            <p class="text-red-600">
              {{ currentApplication.decline_reason || 'We regret to inform you that your application has been declined.' }}
            </p>
            <p class="mt-2 text-sm">
              For more information, please contact our support team at
              <a href="mailto:support@thalente.co.za" class="text-red-800 underline">
                support{{'@'}}thalente.co.za
              </a>
            </p>
          </div>
        </div>
      </ng-container>

      <!-- No Results Message -->
      <div *ngIf="searched && !currentApplication && !error"
           class="text-center py-8">
        <i class="i-heroicons-inbox text-4xl text-gray-400 mb-2"></i>
        <p>No application found with the provided details.</p>
      </div>

      <!-- Error Message -->
      <div *ngIf="error"
           class="p-4 bg-red-50 text-red-800 rounded-lg">
        {{ error }}
      </div>
    </div>
  `
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
  currentApplication: Application | null = null;

  constructor() {
    this.searchForm = this.fb.group({
      email: ['', [Validators.email]],
      idNumber: ['', [Validators.pattern(/^\d{13}$/)]]
    }, {
      validators: form => {
        const email = form.get('email')?.value;
        const idNumber = form.get('idNumber')?.value;
        return email || idNumber ? null : { atLeastOne: true };
      }
    });
  }

  ngOnInit() {
    // Check for reference number in query params
    const ref = this.route.snapshot.queryParams['ref'];
    debugger
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
      this.currentApplication = await this.publicAdapter.searchApplication(email, idNumber);
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
          this.currentApplication = data.data;
          this.searched = true;
        },
        error: (error) => {
          console.error('Lookup failed:', error);
          this.error = 'Failed to find application. Please try searching with your email or ID number.';
        }
      });
    } catch (error) {
      console.error('Lookup failed:', error);
      this.error = 'Failed to find application. Please try searching with your email or ID number.';
    } finally {
      this.isSearching = false;
    }
  }
}

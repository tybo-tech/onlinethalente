import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../../models/company.model';
import { ImportService } from '../../../../../services/imports/ImportService';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../../../../services/company.service';
import { UserService } from '../../../../../services/user.service';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-import-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Walk-in Data Import</h2>

      <!-- Actions & Progress -->
      <div class="flex flex-wrap gap-4 mb-6">
        <button
          (click)="loadCompanies()"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          [disabled]="isLoading"
        >
          {{ isLoading ? 'Loading...' : 'Load Preview' }}
        </button>

        <button
          (click)="performImport()"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300 transition-colors"
          [disabled]="!companies.length || isImporting"
        >
          {{
            isImporting
              ? 'Importing...'
              : 'Import All (' + companies.length + ')'
          }}
        </button>

        <div class="flex-grow"></div>

        <div class="bg-gray-100 px-4 py-2 rounded flex items-center">
          <span class="mr-2">Progress:</span>
          <span class="font-medium"
            >{{ importedCount }}/{{ companies.length }}</span
          >
        </div>
      </div>

      <!-- Error Message -->
      <div
        *ngIf="errorMessage"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        <div class="flex justify-between items-center">
          <span>{{ errorMessage }}</span>
          <button
            (click)="errorMessage = ''"
            class="text-red-700 hover:text-red-900"
          >
            &times;
          </button>
        </div>
        <div *ngIf="detailedErrors.length" class="mt-2 text-sm">
          <div *ngFor="let err of detailedErrors" class="mt-1">
            {{ err }}
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div
        *ngIf="importComplete"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          Successfully imported {{ importedCount }} companies and
          {{ importedUserCount }} users!
          <span *ngIf="importStats.errors > 0" class="ml-2 text-yellow-700">
            ({{ importStats.errors }} errors)
          </span>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div *ngIf="isLoading" class="text-center py-4">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"
        ></div>
        <p class="mt-2">Loading walk-in data...</p>
      </div>

      <!-- Import Progress Bar -->
      <div *ngIf="isImporting" class="mb-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            [style.width]="(importedCount / companies.length) * 100 + '%'"
          ></div>
        </div>
        <div class="text-right text-sm text-gray-600 mt-1">
          {{ importedCount }} of {{ companies.length }} ({{
            ((importedCount / companies.length) * 100).toFixed(0)
          }}%)
        </div>
      </div>

      <!-- Company Preview List -->
      <div *ngIf="companies.length > 0 && !isLoading" class="space-y-4">
        <div class="bg-gray-100 p-3 rounded flex justify-between items-center">
          <p class="font-medium">
            Found {{ companies.length }} companies to import
          </p>
          <p class="text-sm text-gray-600">{{ getTotalUsers() }} total users</p>
        </div>

        <div
          *ngFor="let company of companies; let i = index"
          class="border rounded p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 class="text-lg font-semibold flex items-center mb-2">
            <span class="mr-2">{{ i + 1 }}.</span>
            <span>{{ company.name }}</span>
            <!-- Description -->
            <span
              class="ml-2 text-sm text-gray-600"
              *ngIf="company.description"
            >
              - {{ company.description }}
            </span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Email:</strong> {{ company.email || 'Not provided' }}
              </p>
              <p>
                <strong>Phone:</strong> {{ company.phone || 'Not provided' }}
              </p>
              <p>
                <strong>Sector:</strong> {{ company.sector || 'Not specified' }}
              </p>
              <p>
                <strong>BBBEE Level:</strong>
                {{ company.bbbee_level || 'Not specified' }}
              </p>
            </div>
            <div>
              <p>
                <strong>Registration No:</strong>
                {{ company.registration_no || 'Not provided' }}
              </p>
              <p>
                <strong>Employees:</strong>
                {{ company.permanent_employees || 0 }} permanent,
                {{ company.temporary_employees || 0 }} temporary
              </p>
              <p>
                <strong>Turnover:</strong>
                {{
                  company.turnover_estimated
                    | currency : 'ZAR' : 'symbol' : '1.0-0'
                }}
              </p>
            </div>
          </div>

          <!-- Program Info -->
          <div
            *ngIf="company.programs && company.programs?.length"
            class="bg-blue-50 px-4 py-2 mt-4 rounded"
          >
            <p class="font-semibold text-sm text-blue-800 mb-1">Program Info</p>
            <p>
              <strong>Registration Date:</strong>
              {{
                company.programs[0].registration_date
                  ? company.programs[0].registration_date
                  : 'Not provided'
              }}
            </p>
            <p>
              <strong>Description:</strong>
              {{ company.programs[0].description || 'Not provided' }}
            </p>
          </div>

          <!-- Users -->
          <div *ngIf="getCompanyUsers(company)?.length" class="mt-4">
            <h4 class="font-medium border-b pb-1 flex items-center">
              Associated Users ({{ getCompanyUsers(company).length }})
            </h4>
            <ul class="divide-y">
              <li *ngFor="let user of getCompanyUsers(company)" class="py-2">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium">{{ user.name }}</p>
                    <p class="text-sm text-gray-600">
                      {{ user.job_title }} • {{ user.email || 'No email' }} •
                      {{ user.phone || 'No phone' }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded mb-1">{{
                      user.role
                    }}</span>
                    <span
                      *ngIf="user.importStatus === 'error'"
                      class="text-xs px-2 py-1 bg-red-100 text-red-800 rounded"
                    >
                      Error
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ImportManagerComponent implements OnInit {
  companies: Company[] = [];
  isLoading = false;
  isImporting = false;
  importComplete = false;
  errorMessage = '';
  detailedErrors: string[] = [];
  importedCount = 0;
  importedUserCount = 0;
  importStats = {
    companies: 0,
    users: 0,
    errors: 0,
  };

  constructor(
    private importService: ImportService,
    private companyService: CompanyService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  loadCompanies() {
    // this.isLoading = true;
    this.errorMessage = '';
    this.detailedErrors = [];
    this.importComplete = false;
    this.companies = [];

    this.companies = this.importService.convertWalkinsToCompanies();
  }

  performImport() {
    if (!this.companies.length) return;

    console.log(this.companies);
    this.companyService.importCompany(this.companies).subscribe({
      next: (response) => {
        this.importedCount = response.importedCompanies || 0;
        this.importedUserCount = response.importedUsers || 0;
        this.importStats = {
          companies: this.importedCount,
          users: this.importedUserCount,
          errors: response.errors || 0,
        };
        this.importComplete = true;
      },
      error: (error: HttpErrorResponse) => {
        this.isImporting = false;
        this.errorMessage = 'Import failed. Please try again.';
        if (error.error && error.error.message) {
          this.detailedErrors.push(error.error.message);
        } else {
          this.detailedErrors.push('An unknown error occurred.');
        }
      },
      complete: () => {
        this.isImporting = false;
        this.isLoading = false;
      },
    });
  }

  getCompanyUsers(company: any): any[] {
    return company.users || [];
  }

  getTotalUsers(): number {
    return this.companies.reduce(
      (total, company) => total + this.getCompanyUsers(company).length,
      0
    );
  }
}

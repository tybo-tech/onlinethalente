import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../../../models/User';

@Component({
  selector: 'app-apply-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6">
      <span class="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
        <i class="i-heroicons-clipboard-document-list mr-1"></i> Apply
      </span>
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">Complete your application</h1>
      <p class="text-gray-600 mt-2">Provide your details and upload your bank statements. We'll verify and update you shortly.</p>
    </div>

    <!-- Identity Management -->
    <div *ngIf="currentUser" class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="i-heroicons-user-circle"></i>
          <span>Applying as <strong>{{ currentUser.name }}</strong> ({{ currentUser.role }})</span>
        </div>
        <div class="flex items-center gap-3">
          <button type="button" class="btn-ghost text-blue-700 underline" (click)="onRefreshProfile()">
            <i class="i-heroicons-arrow-path mr-1"></i>
            Refresh from profile
          </button>
          <button type="button" class="btn-ghost text-blue-700 hover:text-red-600" (click)="onLogout()">
            <i class="i-heroicons-arrow-right-on-rectangle mr-1"></i>
            Apply as someone else
          </button>
        </div>
      </div>
    </div>

    <!-- Login/Register Prompt -->
    <div *ngIf="!currentUser"
         class="mb-4 p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <i class="i-heroicons-user-circle text-gray-400 text-xl"></i>
          <div>
            <h3 class="font-medium">Already have an account?</h3>
            <p class="text-sm text-gray-600">Log in to auto-fill your details and track your applications</p>
          </div>
        </div>
        <div class="flex items-center gap-2 self-stretch sm:self-center">
          <button type="button"
                  class="btn-primary flex-1 sm:flex-none"
                  (click)="navigateTo('/accounts/login')">
            <i class="i-heroicons-arrow-right-on-rectangle"></i>
            Log In
          </button>
          <button type="button"
                  class="btn-secondary flex-1 sm:flex-none"
                  (click)="navigateTo('/accounts/register')">
            <i class="i-heroicons-user-plus"></i>
            Register
          </button>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div *ngIf="error" class="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
      <i class="i-heroicons-exclamation-triangle mr-1"></i>{{ error }}
    </div>
  `
})
export class ApplyHeaderComponent  {
  @Input() currentUser?: User;
  @Input() error = '';
  @Input() offerId = 0;

  @Output() refreshProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();


  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}


  navigateTo(path: string) {
    debugger
    const queryParams = this.offerId ? { offerId: this.offerId } : {};
    this.router.navigate([path], { queryParams });
  }

  onRefreshProfile() {
    this.refreshProfile.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}

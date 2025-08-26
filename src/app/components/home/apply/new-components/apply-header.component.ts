import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
        Complete your application
      </h1>
      <p class="text-gray-600 mt-2">
        Provide your details and upload your bank statements. We'll verify
        and update you shortly.
      </p>
    </div>

    <!-- Applying as banner -->
    <div *ngIf="currentUser"
         class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="i-heroicons-user-circle"></i>
        <span>Applying as <strong>{{ currentUser.name }}</strong> ({{ currentUser.role }})</span>
      </div>
      <div class="flex items-center gap-2">
        <button type="button"
                class="btn-ghost text-blue-700 underline"
                (click)="refreshProfile.emit()">
          Refresh from profile
        </button>
        <button type="button"
                class="btn-ghost text-blue-700"
                (click)="logout.emit()">
          <i class="i-heroicons-arrow-right-on-rectangle"></i>
          Logout
        </button>
      </div>
    </div>

    <div *ngIf="error"
         class="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
      <i class="i-heroicons-exclamation-triangle mr-1"></i>{{ error }}
    </div>
  `
})
export class ApplyHeaderComponent {
  @Input() currentUser?: User;
  @Input() error = '';

  @Output() refreshProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}

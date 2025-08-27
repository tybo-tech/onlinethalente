import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { User } from '../../../../../models/User';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms-and-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <fieldset
      [formGroup]="form"
      class="rounded-lg border bg-white/50 p-4"
      role="group"
      [attr.aria-labelledby]="uid + '-legend'"
      [attr.aria-describedby]="uid + '-hint'"
    >
      <legend [id]="uid + '-legend'" class="text-sm font-medium text-gray-900">
        Submission & consent
      </legend>
      <p [id]="uid + '-hint'" class="mt-1 text-xs text-gray-500">
        To proceed, you must confirm authenticity.
      </p>

      <div class="mt-3 space-y-3">
        <!-- Accept terms (required) -->
        <div class="flex items-start gap-3">
          <input
            [id]="uid + '-accept'"
            type="checkbox"
            formControlName="accept_terms"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            [attr.aria-invalid]="acceptTermsCtrl?.invalid || null"
            [attr.aria-describedby]="uid + '-hint ' + uid + '-accept-error'"
            required
          />
          <label [for]="uid + '-accept'" class="text-sm text-gray-700">
            I confirm the documents are authentic and agree to the
            <ng-container *ngIf="termsRouterLink; else linkHref">
              <a
                [routerLink]="termsRouterLink"
                class="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
                >terms</a
              >
            </ng-container>
            <ng-template #linkHref>
              <a
                *ngIf="termsHref; else plainTerms"
                [href]="termsHref"
                target="_blank"
                rel="noopener"
                class="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
                >terms</a
              >
              <ng-template #plainTerms>terms</ng-template> </ng-template
            >.
          </label>
        </div>
        <p
          *ngIf="
            acceptTermsCtrl?.invalid &&
            (acceptTermsCtrl?.dirty || acceptTermsCtrl?.touched)
          "
          [id]="uid + '-accept-error'"
          class="pl-7 text-xs text-rose-600"
        >
          You must accept the terms to continue.
        </p>

        <!-- Optional: update profile -->
        <div
          *ngIf="currentUser || showUpdateProfile"
          class="flex items-start gap-3"
        >
          <input
            [id]="uid + '-update'"
            type="checkbox"
            formControlName="update_profile"
            class="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          />
          <label [for]="uid + '-update'" class="text-sm text-gray-700">
            Update my profile with these details (email, phone, ID, banking).
          </label>
        </div>
      </div>
    </fieldset>
  `,
  styles: [
    `
      fieldset {
        border: 1px solid #e5e7eb;
        margin-top: 1rem;
        margin-bottom: 1.4rem;
      }

      .w-4 {
        width: 1rem;
      }

      .h-4 {
        height: 1rem;
      }
    `,
  ],
})
export class TermsAndOptionsComponent {
  /** Unique id prefix per instance to avoid duplicate #ids */
  private static nextId = 0;
  uid = `tao-${TermsAndOptionsComponent.nextId++}`;

  @Input({ required: true }) form!: FormGroup;
  @Input() currentUser?: User | null = null;

  /** Force showing the "update profile" toggle even if currentUser is not passed */
  @Input() showUpdateProfile = false;

  /** Optional ways to link to Terms */
  @Input() termsRouterLink?: string | any[];
  @Input() termsHref?: string;

  /** Disable both checkboxes (e.g., during submit) */
  @Input() disabled = false;

  get acceptTermsCtrl() {
    return this.form?.get('accept_terms');
  }
  get updateProfileCtrl() {
    return this.form?.get('update_profile');
  }
}

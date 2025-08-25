import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { BankingDetails } from '../../../../models/schema';
import { ICollectionData } from '../../../../models/ICollection';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-banking-details-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Banking Details</h1>

      <form *ngIf="form" [formGroup]="form" (ngSubmit)="onSubmit()" class="max-w-2xl">
        <div class="space-y-4">
          <!-- Account Holder -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Account Holder</label>
            <input
              type="text"
              formControlName="account_holder"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <div *ngIf="form.get('account_holder')?.errors?.['required'] && form.get('account_holder')?.touched"
                 class="mt-1 text-sm text-red-600">
              Account holder is required
            </div>
          </div>

          <!-- Bank Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              formControlName="bank_name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <div *ngIf="form.get('bank_name')?.errors?.['required'] && form.get('bank_name')?.touched"
                 class="mt-1 text-sm text-red-600">
              Bank name is required
            </div>
          </div>

          <!-- Account Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Account Number</label>
            <input
              type="text"
              formControlName="account_number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <div *ngIf="form.get('account_number')?.errors?.['required'] && form.get('account_number')?.touched"
                 class="mt-1 text-sm text-red-600">
              Account number is required
            </div>
          </div>

          <!-- Branch Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Branch Code</label>
            <input
              type="text"
              formControlName="branch_code"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <!-- PayFast Section -->
          <div class="pt-4 border-t">
            <h2 class="text-lg font-medium text-gray-900 mb-4">PayFast Configuration</h2>

            <!-- Merchant ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Merchant ID</label>
              <input
                type="text"
                formControlName="payfast_merchant_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <!-- Merchant Key -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Merchant Key</label>
              <input
                type="text"
                formControlName="payfast_merchant_key"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <!-- Passphrase -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Passphrase</label>
              <input
                type="password"
                formControlName="payfast_passphrase"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              [disabled]="form.invalid || form.pristine || saving"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {{ existingDetails ? 'Update' : 'Save' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class BankingDetailsPageComponent implements OnInit, OnDestroy {
  form: FormGroup | undefined;
  existingDetails: ICollectionData<BankingDetails> | undefined;
  saving = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private la: LendingAdapter,
    private userService: UserService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    const [details] = await firstValueFrom(this.la.bankingDetails$());
    this.existingDetails = details;

    this.form = this.fb.group({
      account_holder: ['', Validators.required],
      bank_name: ['', Validators.required],
      account_number: ['', Validators.required],
      branch_code: [''],
      payfast_merchant_id: [''],
      payfast_merchant_key: [''],
      payfast_passphrase: ['']
    });

    if (details) {
      this.form.patchValue({
        ...details.data,
        // Don't show passphrase in UI
        payfast_passphrase: ''
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit() {
    if (!this.form?.valid) return;

    this.saving = true;
    try {
      const values = this.form.value;
      const user = this.userService.getUser;

      // If updating and passphrase is empty, keep existing
      if (this.existingDetails && !values.payfast_passphrase) {
        values.payfast_passphrase = this.existingDetails.data.payfast_passphrase;
      }

      // Add audit fields
      values.updated_by_user_id = user?.id;
      values.updated_at = new Date().toISOString();

      if (this.existingDetails) {
        // Update
        this.existingDetails.data = {
          ...this.existingDetails.data,
          ...values
        };
        await firstValueFrom(this.la.update(this.existingDetails));
      } else {
        // Create
        await firstValueFrom(this.la.add('banking_details', values));
      }

      this.toast.success('Banking details saved successfully');
      this.form.markAsPristine();
    } catch (error) {
      this.toast.error('Failed to save banking details');
    } finally {
      this.saving = false;
    }
  }
}

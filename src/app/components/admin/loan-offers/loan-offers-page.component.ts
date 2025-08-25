import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { LoanOffer, PayCycle } from '../../../../models/schema';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';

type OfferWithCycle = LoanOffer & {
  cycleLabel?: string;
};

interface OfferNode extends ICollectionData<OfferWithCycle> {}

@Component({
  selector: 'app-loan-offers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 flex">
      <!-- Left: Pay Cycle Filter -->
      <div class="w-64 pr-8">
        <h2 class="text-lg font-medium mb-4">Pay Cycles</h2>
        <div class="space-y-2">
          <button
            (click)="selectedCycleId = undefined"
            class="block w-full text-left px-3 py-2 rounded"
            [class.bg-blue-100]="!selectedCycleId"
          >
            All Cycles
          </button>
          <button
            *ngFor="let cycle of cycles"
            (click)="selectedCycleId = cycle.id"
            class="block w-full text-left px-3 py-2 rounded"
            [class.bg-blue-100]="selectedCycleId === cycle.id"
          >
            {{ cycle.data.label }}
          </button>
        </div>
      </div>

      <!-- Right: Offers List -->
      <div class="flex-1">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Loan Offers</h1>
          <button
            (click)="showAddForm()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Offer
          </button>
        </div>

        <!-- Add/Edit Form -->
        <div *ngIf="form" class="mb-8 bg-white p-4 rounded shadow">
          <h2 class="text-lg font-medium mb-4">{{ editingOffer ? 'Edit' : 'Add' }} Loan Offer</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Pay Cycle</label>
              <select
                formControlName="pay_cycle_id"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option [ngValue]="null" disabled>Select a pay cycle</option>
                <option *ngFor="let cycle of cycles" [ngValue]="cycle.id">
                  {{ cycle.data.label }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Amount (R)</label>
              <input
                type="number"
                formControlName="amount"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Total Slots</label>
              <input
                type="number"
                formControlName="slots_total"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Label (Optional)</label>
              <input
                type="text"
                formControlName="label"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                formControlName="is_active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label class="ml-2 block text-sm text-gray-900">Active</label>
            </div>

            <div class="flex gap-2">
              <button
                type="submit"
                [disabled]="form.invalid || saving"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {{ saving ? 'Saving...' : (editingOffer ? 'Update' : 'Create') }}
              </button>
              <button
                type="button"
                (click)="cancelEdit()"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- List -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Cycle</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Slots</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let offer of filteredOffers">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ offer.data.label || ('R' + (offer.data.amount_cents / 100)) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ offer.data.cycleLabel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  R{{ offer.data.amount_cents / 100 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {{ offer.data.slots_total }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    (click)="toggleActive(offer)"
                    [class.text-green-600]="offer.data.is_active"
                    [class.text-gray-400]="!offer.data.is_active"
                    class="hover:text-green-900"
                  >
                    {{ offer.data.is_active ? '✓' : '×' }}
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    (click)="editOffer(offer)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LoanOffersPageComponent implements OnInit {
  cycles: ICollectionData<PayCycle>[] = [];
  offers: OfferNode[] = [];
  selectedCycleId?: number;
  form: FormGroup | undefined;
  editingOffer: ICollectionData<LoanOffer> | undefined;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private la: LendingAdapter,
    private rules: BusinessRulesService,
    private toast: ToastService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  get filteredOffers() {
    return this.offers
      .filter(o => !this.selectedCycleId || o.data.pay_cycle_id === this.selectedCycleId)
      .sort((a, b) => {
        if (a.data.pay_cycle_id !== b.data.pay_cycle_id) {
          return a.data.pay_cycle_id - b.data.pay_cycle_id;
        }
        return b.data.amount_cents - a.data.amount_cents;
      });
  }

  private async loadData() {
    const [cycles, offers] = await Promise.all([
      firstValueFrom(this.la.payCycles$()),
      firstValueFrom(this.la.loanOffers$())
    ]);

    this.cycles = cycles;
    this.offers = offers.map(offer => ({
      ...offer,
      data: {
        ...offer.data,
        cycleLabel: cycles.find(c => c.id === offer.data.pay_cycle_id)?.data.label
      }
    }));
  }

  showAddForm() {
    this.editingOffer = undefined;
    this.form = this.fb.group({
      pay_cycle_id: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      slots_total: [null, [Validators.required, Validators.min(1)]],
      label: [''],
      is_active: [true]
    });
  }

  editOffer(offer: ICollectionData<LoanOffer>) {
    this.editingOffer = offer;
    this.form = this.fb.group({
      pay_cycle_id: [offer.data.pay_cycle_id, Validators.required],
      amount: [offer.data.amount_cents / 100, [Validators.required, Validators.min(1)]],
      slots_total: [offer.data.slots_total, [Validators.required, Validators.min(1)]],
      label: [offer.data.label || ''],
      is_active: [offer.data.is_active]
    });
  }

  cancelEdit() {
    this.form = undefined;
    this.editingOffer = undefined;
  }

  async onSubmit() {
    if (!this.form?.valid) return;

    this.saving = true;
    try {
      const values = this.form.value;
      const data: LoanOffer = {
        pay_cycle_id: values.pay_cycle_id,
        amount_cents: values.amount * 100,
        slots_total: values.slots_total,
        is_active: values.is_active,
        label: values.label || undefined
      };

      // Validate
      const errors = this.rules.validateLoanOffer(data);
      if (errors.length) {
        this.toast.error(errors.join('; '));
        return;
      }

      if (this.editingOffer) {
        // Update
        this.editingOffer.data = {
          ...this.editingOffer.data,
          ...data
        };
        this.rules.touch(this.editingOffer);
        await firstValueFrom(this.la.update(this.editingOffer));
        this.toast.success('Loan offer updated');
      } else {
        // Create
        await firstValueFrom(this.la.add('loan_offers', data));
        this.toast.success('Loan offer created');
      }

      this.form = undefined;
      this.editingOffer = undefined;
      await this.loadData();
    } catch (error) {
      this.toast.error('Failed to save loan offer');
    } finally {
      this.saving = false;
    }
  }

  async toggleActive(offer: ICollectionData<LoanOffer>) {
    try {
      offer.data.is_active = !offer.data.is_active;
      this.rules.touch(offer);
      await firstValueFrom(this.la.update(offer));
      this.toast.success(`Offer ${offer.data.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      this.toast.error('Failed to update offer status');
      offer.data.is_active = !offer.data.is_active; // Revert
    }
  }
}

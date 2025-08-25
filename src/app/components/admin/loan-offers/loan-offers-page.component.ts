import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { FormInput } from '../../../../models/FormInput';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { LoanOffer, PayCycle } from '../../../../models/schema';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';
import { UiModalComponent } from '../../shared/ui-modal/ui-modal.component';

type OfferWithCycle = LoanOffer & {
  cycleLabel?: string;
};

interface OfferNode extends ICollectionData<OfferWithCycle> {}

@Component({
  selector: 'app-loan-offers-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModalComponent, DynamicFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-wrap md:flex-nowrap gap-8">
        <!-- Left: Pay Cycle Filter -->
        <div class="w-full md:w-64 shrink-0">
          <div class="sticky top-4">
            <h2 class="text-lg font-semibold mb-4 flex items-center">
              <i class="fa fa-calendar mr-2"></i>
              Pay Cycles
            </h2>
            <div class="space-y-2">
              <button
                (click)="selectedCycleId = undefined"
                class="block w-full text-left px-3 py-2 rounded transition-colors duration-150"
                [class.bg-blue-100]="!selectedCycleId"
                [class.hover:bg-blue-50]="selectedCycleId"
              >
                <i class="fa fa-filter-circle-xmark mr-2"></i>
                All Cycles
              </button>
              <button
                *ngFor="let cycle of cycles"
                (click)="selectedCycleId = cycle.id"
                class="block w-full text-left px-3 py-2 rounded transition-colors duration-150"
                [class.bg-blue-100]="selectedCycleId === cycle.id"
                [class.hover:bg-blue-50]="selectedCycleId !== cycle.id"
              >
                <i class="fa fa-calendar-check mr-2"></i>
                {{ cycle.data.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Offers List -->
        <div class="flex-1">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold flex items-center">
              <i class="fa fa-sack-dollar mr-2"></i>
              Loan Offers
            </h1>
            <button
              (click)="showAddForm()"
              class="btn-primary flex items-center"
            >
              <i class="fa fa-plus mr-2"></i>
              Add Offer
            </button>
          </div>

          <!-- List -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Cycle</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Slots</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let offer of filteredOffers" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <i class="fa fa-tag mr-2 text-gray-400"></i>
                    {{ offer.data.label || ('R' + (offer.data.amount_cents / 100)) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <i class="fa fa-calendar-day mr-2"></i>
                    {{ offer.data.cycleLabel }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    <i class="fa fa-coins mr-1 text-yellow-500"></i>
                    R{{ offer.data.amount_cents / 100 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    <i class="fa fa-user-group mr-1"></i>
                    {{ offer.data.slots_total }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      (click)="toggleActive(offer)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [class.bg-green-100]="offer.data.is_active"
                      [class.text-green-800]="offer.data.is_active"
                      [class.bg-gray-100]="!offer.data.is_active"
                      [class.text-gray-800]="!offer.data.is_active"
                    >
                      <i class="fa" [class.fa-check-circle]="offer.data.is_active" [class.fa-ban]="!offer.data.is_active"></i>
                      <span class="ml-1">{{ offer.data.is_active ? 'Active' : 'Inactive' }}</span>
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      (click)="editOffer(offer)"
                      class="btn-ghost text-indigo-600 hover:text-indigo-900"
                    >
                      <i class="fa fa-edit mr-1"></i>
                      Edit
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredOffers.length === 0">
                  <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    <i class="fa fa-inbox text-4xl mb-3"></i>
                    <p>No loan offers found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <ui-modal [(open)]="showModal" [title]="editingOffer ? 'Edit Loan Offer' : 'Add Loan Offer'">
      <app-dynamic-form
        [inputs]="formInputs"
        [initialData]="editingOffer ? {
          pay_cycle_id: editingOffer.data.pay_cycle_id,
          amount: editingOffer.data.amount_cents / 100,
          slots_total: editingOffer.data.slots_total,
          label: editingOffer.data.label || '',
          is_active: editingOffer.data.is_active
        } : {
          is_active: true
        }"
        submitLabel="{{ saving ? 'Saving...' : (editingOffer ? 'Update' : 'Create') }}"
        cancelLabel="Cancel"
        [submitClass]="saving ? 'btn-primary opacity-75' : 'btn-primary'"
        (submitted)="onSubmit($event)"
        (cancelled)="cancelEdit()"
      ></app-dynamic-form>
    </ui-modal>
  `
})
export class LoanOffersPageComponent implements OnInit {
  cycles: ICollectionData<PayCycle>[] = [];
  offers: OfferNode[] = [];
  selectedCycleId?: number;
  editingOffer: ICollectionData<LoanOffer> | undefined;
  saving = false;
  showModal = false;
  formInputs: FormInput[] = [];

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
    this.setupFormInputs();
    this.showModal = true;
  }

  private setupFormInputs(offer?: ICollectionData<LoanOffer>) {
    this.formInputs = [
      {
        key: 'pay_cycle_id',
        label: 'Pay Cycle',
        type: 'select',
        icon: 'fa-calendar-check',
        required: true,
        options: this.cycles.map(cycle => ({
          value: cycle.id,
          label: cycle.data.label
        })),
        placeholder: 'Select a pay cycle',
        errorMessages: {
          required: 'Please select a pay cycle'
        }
      },
      {
        key: 'amount',
        label: 'Amount',
        type: 'number',
        icon: 'fa-money-bill',
        unit: 'R',
        required: true,
        min: 1,
        step: 100,
        errorMessages: {
          required: 'Amount is required',
          min: 'Amount must be greater than 0'
        }
      },
      {
        key: 'slots_total',
        label: 'Total Slots',
        type: 'number',
        icon: 'fa-users',
        required: true,
        min: 1,
        errorMessages: {
          required: 'Total slots is required',
          min: 'Total slots must be at least 1'
        }
      },
      {
        key: 'label',
        label: 'Label (Optional)',
        type: 'text',
        icon: 'fa-tag',
        placeholder: 'e.g., Early Bird Special'
      },
      {
        key: 'is_active',
        label: 'Active',
        type: 'checkbox',
        icon: 'fa-toggle-on'
      }
    ];
  }

  editOffer(offer: ICollectionData<LoanOffer>) {
    this.editingOffer = offer;
    this.setupFormInputs(offer);
    this.showModal = true;
  }

  cancelEdit() {
    this.showModal = false;
    this.editingOffer = undefined;
  }

  async onSubmit(values: any) {

    this.saving = true;
    try {
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

      this.showModal = false;
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

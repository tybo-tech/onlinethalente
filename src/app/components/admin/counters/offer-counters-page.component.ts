import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, forkJoin } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { LoanOffer, OfferCounter, PayCycle } from '../../../../models/schema';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';

type CounterWithDetails = OfferCounter & {
  offerLabel?: string;
  amount?: number;
  cycleLabel?: string;
};

interface CounterNode extends ICollectionData<CounterWithDetails> {}

@Component({
  selector: 'app-offer-counters-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4">
      <div class="flex justify-between mb-4">
        <h1 class="text-2xl font-bold">Offer Counters</h1>
        <button
          (click)="openForm()"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Counter
        </button>
      </div>

      <!-- Form -->
      @if (form) {
        <div class="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-medium mb-4">{{ editingCounter ? 'Edit' : 'New' }} Counter</h2>
          <form [formGroup]="form" (ngSubmit)="saveCounter()">
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Loan Offer</label>
                <select
                  formControlName="offer_id"
                  class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an offer</option>
                  @for (offer of offers; track offer.id) {
                    <option [value]="offer.id">
                      {{ offer.data.label }} ({{ getCycleLabel(offer.data.pay_cycle_id) }})
                    </option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Period (YYYY-MM-01)</label>
                <input
                  type="text"
                  formControlName="period"
                  class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="YYYY-MM-01"
                />
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-1">Slots Remaining</label>
                <input
                  type="number"
                  formControlName="slots_remaining"
                  class="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div class="mt-4 flex justify-end gap-2">
              <button
                type="button"
                (click)="form = undefined"
                class="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="form.invalid || saving"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Cycle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Slots</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @for (counter of counters; track counter.id) {
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ counter.data.offerLabel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ counter.data.cycleLabel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ counter.data.period }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {{ counter.data.slots_remaining }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <button
                    (click)="editCounter(counter)"
                    class="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    (click)="deleteCounter(counter)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class OfferCountersPageComponent implements OnInit {
  counters: CounterNode[] = [];
  offers: ICollectionData<LoanOffer>[] = [];
  cycles: ICollectionData<PayCycle>[] = [];

  form?: FormGroup;
  editingCounter?: CounterNode;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private la: LendingAdapter,
    private rules: BusinessRulesService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    // Load all data in parallel
    const [counters, offers, cycles] = await firstValueFrom(forkJoin([
      this.la.offerCounters$(),
      this.la.loanOffers$(),
      this.la.payCycles$(),
    ]));

    this.offers = offers;
    this.cycles = cycles;

    // Enhance counters with offer details
    this.counters = counters.map(counter => {
      const offer = offers.find(o => o.id === counter.data.offer_id);
      if (!offer) return counter;

      const cycle = cycles.find(c => c.id === offer.data.pay_cycle_id);

      return {
        ...counter,
        data: {
          ...counter.data,
          offerLabel: offer.data.label,
          amount: offer.data.amount_cents / 100,
          cycleLabel: cycle?.data.label
        }
      };
    });
  }

  getCycleLabel(cycleId: number): string {
    return this.cycles.find(c => c.id === cycleId)?.data.label || '';
  }

  openForm() {
    this.form = this.fb.group({
      offer_id: ['', Validators.required],
      period: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-01$/)
      ]],
      slots_remaining: [0, [
        Validators.required,
        Validators.min(0)
      ]]
    });
  }

  editCounter(counter: CounterNode) {
    this.editingCounter = counter;
    this.form = this.fb.group({
      offer_id: [counter.data.offer_id, Validators.required],
      period: [counter.data.period, [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-01$/)
      ]],
      slots_remaining: [counter.data.slots_remaining, [
        Validators.required,
        Validators.min(0)
      ]]
    });
  }

  async saveCounter() {
    if (!this.form?.valid) return;

    this.saving = true;
    try {
      const data: OfferCounter = this.form.value;

      const errors = this.rules.validateOfferCounter(data);
      if (errors.length) {
        this.toast.error(errors.join('; '));
        return;
      }

      if (this.editingCounter) {
        // Update
        this.editingCounter.data = {
          ...this.editingCounter.data,
          ...data
        };
        this.rules.touch(this.editingCounter);
        await firstValueFrom(this.la.update(this.editingCounter));
        this.toast.success('Counter updated');
      } else {
        // Create
        await firstValueFrom(this.la.add('offer_counters', data));
        this.toast.success('Counter created');
      }

      this.form = undefined;
      this.editingCounter = undefined;
      await this.loadData();
    } catch (error) {
      this.toast.error('Failed to save counter');
    } finally {
      this.saving = false;
    }
  }

  async deleteCounter(counter: CounterNode) {
    if (!confirm('Are you sure you want to delete this counter?')) {
      return;
    }

    try {
      await firstValueFrom(this.la.remove(counter));
      this.toast.success('Counter deleted');
      await this.loadData();
    } catch (error) {
      this.toast.error('Failed to delete counter');
    }
  }
}

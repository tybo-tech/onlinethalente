import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { FormInput } from '../../../../models/FormInput';
import { ICollectionData } from '../../../../models/ICollection';
import { PayCycle, SalaryDay } from '../../../../models/schema';
import { BusinessRulesService } from '../../../../services/business/business-rules.service';
import { LendingAdapter } from '../../../../services/business/lending.adapter';
import { ToastService } from '../../../../services/toast.service';
import { UiModalComponent } from '../../shared/ui-modal/ui-modal.component';
import { UiConfirmModalComponent } from '../../shared/ui-confirm-modal/ui-confirm-modal.component';

type ReleaseDay = 1 | 16 | 26;

@Component({
  selector: 'app-pay-cycles-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiModalComponent, UiConfirmModalComponent, DynamicFormComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold flex items-center">
          <i class="fa fa-calendar-days mr-2"></i>
          Pay Cycles
        </h1>
        <button
          (click)="showAddForm()"
          class="btn-primary flex items-center"
        >
          <i class="fa fa-plus mr-2"></i>
          Add Pay Cycle
        </button>
      </div>

      <!-- Pay Cycles List -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Day</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Release Day</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let cycle of cycles" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <i class="fa fa-tag mr-2 text-gray-400"></i>
                {{ cycle.data.label }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <i class="fa fa-calendar-day mr-2"></i>
                Day {{ cycle.data.salary_day }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <i class="fa fa-clock mr-2"></i>
                Day {{ cycle.data.release_day }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button
                  (click)="editCycle(cycle)"
                  class="btn-ghost text-indigo-600 hover:text-indigo-900"
                >
                  <i class="fa fa-edit mr-1"></i>
                  Edit
                </button>
                <button
                  (click)="confirmDelete(cycle)"
                  class="btn-ghost text-red-600 hover:text-red-900"
                >
                  <i class="fa fa-trash mr-1"></i>
                  Delete
                </button>
              </td>
            </tr>
            <tr *ngIf="cycles.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                <i class="fa fa-calendar-xmark text-4xl mb-3"></i>
                <p>No pay cycles found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <ui-modal [(open)]="showModal" [title]="editingCycle ? 'Edit Pay Cycle' : 'Add Pay Cycle'">
      <app-dynamic-form
        [inputs]="formInputs"
        [initialData]="editingCycle?.data"
        submitLabel="{{ saving ? 'Saving...' : (editingCycle ? 'Update' : 'Create') }}"
        cancelLabel="Cancel"
        [submitClass]="saving ? 'btn-primary opacity-75 cursor-not-allowed' : 'btn-primary'"
        (submitted)="onSubmit($event)"
        (cancelled)="closeForm()"
      ></app-dynamic-form>
    </ui-modal>

    <!-- Delete Confirmation Modal -->
    <ui-confirm-modal
      [(open)]="showConfirmDelete"
      title="Delete Pay Cycle"
      message="Are you sure you want to delete this pay cycle? This action cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      confirmClass="btn-danger"
      (confirmed)="deleteCycle()"
    ></ui-confirm-modal>
  `
})
export class PayCyclesPageComponent implements OnInit {
  cycles: ICollectionData<PayCycle>[] = [];
  editingCycle?: ICollectionData<PayCycle>;
  selectedCycle?: ICollectionData<PayCycle>;
  saving = false;
  showModal = false;
  showConfirmDelete = false;

  formInputs: FormInput[] = [
    {
      key: 'label',
      label: 'Label',
      type: 'text',
      required: true,
      icon: 'fa-tag',
      placeholder: 'e.g., Mid-Month Pay'
    },
    {
      key: 'salary_day',
      label: 'Salary Day',
      type: 'number',
      icon: 'fa-calendar-day',
      required: true,
      min: 1,
      max: 31,
      errorMessages: {
        required: 'Salary day is required',
        min: 'Day must be between 1 and 31',
        max: 'Day must be between 1 and 31'
      }
    },
    {
      key: 'release_day',
      label: 'Release Day',
      type: 'select',
      icon: 'fa-clock',
      required: true,
      options: [
        { value: 1, label: '1st' },
        { value: 16, label: '16th' },
        { value: 26, label: '26th' }
      ],
      placeholder: 'Select release day',
      errorMessages: {
        required: 'Release day is required'
      }
    },
    {
      key: 'sold_out_message',
      label: 'Sold Out Message',
      type: 'textarea',
      icon: 'fa-message',
      placeholder: 'Message to display when all slots are taken'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private la: LendingAdapter,
    private rules: BusinessRulesService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.cycles = await firstValueFrom(this.la.payCycles$());
  }

  showAddForm() {
    this.editingCycle = undefined;
    this.showModal = true;
  }

  editCycle(cycle: ICollectionData<PayCycle>) {
    this.editingCycle = cycle;
    this.showModal = true;
  }

  confirmDelete(cycle: ICollectionData<PayCycle>) {
    this.selectedCycle = cycle;
    this.showConfirmDelete = true;
  }

  async deleteCycle() {
    if (!this.selectedCycle) return;

    try {
      await firstValueFrom(this.la.remove(this.selectedCycle));
      this.toast.success('Pay cycle deleted');
      await this.loadData();
      this.showConfirmDelete = false;
    } catch (error) {
      this.toast.error('Failed to delete pay cycle');
    }
  }

  async onSubmit(formValue: any): Promise<void> {
    this.saving = true;
    const data: PayCycle = {
      ...formValue,
      salary_day: Number(formValue.salary_day) as SalaryDay,
      release_day: Number(formValue.release_day) as ReleaseDay
    };

    const errors = this.rules.validatePayCycle(data);
    if (errors.length) {
      this.toast.error(errors.join('; '));
      this.saving = false;
      return;
    }

    try {
      if (this.editingCycle) {
        // Update
        const updatedCycle = {
          ...this.editingCycle,
          data: {
            ...this.editingCycle.data,
            ...data
          }
        };
        this.rules.touch(updatedCycle);
        await firstValueFrom(this.la.update(updatedCycle));
        this.toast.success('Pay cycle updated');
      } else {
        // Create
        await firstValueFrom(this.la.add('pay_cycles', data));
        this.toast.success('Pay cycle created');
      }
      this.closeForm();
      await this.loadData();
    } catch (error) {
      this.toast.error('Failed to save pay cycle');
    } finally {
      this.saving = false;
    }
  }

  closeForm(): void {
    this.showModal = false;
    this.editingCycle = undefined;
  }
}

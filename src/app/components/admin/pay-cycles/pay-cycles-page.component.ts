import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
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
  imports: [CommonModule, ReactiveFormsModule, UiModalComponent, UiConfirmModalComponent],
  templateUrl: './pay-cycles-page.component.html',
  styleUrls: ['./pay-cycles-page.component.scss']
})
export class PayCyclesPageComponent implements OnInit {
  cycles: ICollectionData<PayCycle>[] = [];
  form?: FormGroup;
  editingCycle?: ICollectionData<PayCycle>;
  selectedCycle?: ICollectionData<PayCycle>;
  saving = false;
  showModal = false;
  showConfirmDelete = false;

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
    this.form = this.fb.group({
      label: ['', Validators.required],
      salary_day: [15 as SalaryDay, Validators.required],
      release_day: [16 as ReleaseDay, Validators.required],
      sold_out_message: ['']
    });
    this.showModal = true;
  }

  editCycle(cycle: ICollectionData<PayCycle>) {
    this.editingCycle = cycle;
    this.form = this.fb.group({
      label: [cycle.data.label, Validators.required],
      salary_day: [cycle.data.salary_day, Validators.required],
      release_day: [cycle.data.release_day, Validators.required],
      sold_out_message: [cycle.data.sold_out_message || '']
    });
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

  onSubmit(): void {
    if (!this.form?.valid) return;

    this.saving = true;
    const data: PayCycle = this.form.value;

    const errors = this.rules.validatePayCycle(data);
    if (errors.length) {
      this.toast.error(errors.join('; '));
      return;
    }

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
      firstValueFrom(this.la.update(updatedCycle))
        .then(() => {
          this.toast.success('Pay cycle updated');
          this.closeForm();
          this.loadData();
        })
        .catch(() => {
          this.toast.error('Failed to save pay cycle');
        })
        .finally(() => {
          this.saving = false;
        });
    } else {
      // Create
      firstValueFrom(this.la.add('pay_cycles', data))
        .then(() => {
          this.toast.success('Pay cycle created');
          this.closeForm();
          this.loadData();
        })
        .catch(() => {
          this.toast.error('Failed to save pay cycle');
        })
        .finally(() => {
          this.saving = false;
        });
    }
  }

  private closeForm(): void {
    this.showModal = false;
    this.form = undefined;
    this.editingCycle = undefined;
  }
}

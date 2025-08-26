import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-banking-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div [formGroup]="form" class="grid sm:grid-cols-2 gap-4">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Bank name</label>
        <input class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="bank_name" />
        <p *ngIf="form.get('bank_name')?.invalid && form.get('bank_name')?.touched"
           class="text-xs text-rose-600">Bank name is required.</p>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Salary account</label>
        <input class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="salary_account" />
        <p *ngIf="form.get('salary_account')?.invalid && form.get('salary_account')?.touched"
           class="text-xs text-rose-600">Account is required.</p>
      </div>
    </div>
  `
})
export class BankingInfoComponent {
  @Input() form!: FormGroup;
}

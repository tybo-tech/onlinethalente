import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryDay } from '../../../../models/schema';

@Component({
  selector: 'app-salary-day-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        <i class="i-heroicons-calendar-days mr-1"></i> Select Your Salary Day
      </label>
      <div class="flex gap-3">
        <button
          *ngFor="let day of salaryDays; trackBy: trackByDay"
          (click)="select.emit(day)"
          class="px-4 py-2 rounded-lg border transition-all hover:bg-gray-50"
          [ngClass]="selected === day ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200'"
          [attr.aria-pressed]="selected === day"
        >
          {{ day }}th
        </button>
      </div>
    </div>
  `
})
export class SalaryDaySelectorComponent {
  @Input() salaryDays: SalaryDay[] = [15, 25, 31];
  @Input() selected!: SalaryDay;
  @Output() select = new EventEmitter<SalaryDay>();
  trackByDay = (_: number, d: number) => d;
}

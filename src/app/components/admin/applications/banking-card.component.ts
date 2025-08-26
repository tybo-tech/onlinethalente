import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banking-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <i class="fa fa-bank text-indigo-500" aria-hidden="true"></i> Banking Details
      </h3>
      <div class="grid gap-2 text-sm">
        <div class="rounded-lg bg-gray-50 p-3">
          <p class="text-gray-500">Bank</p>
          <p class="font-medium text-gray-900 break-words">{{ bankName }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-3">
          <p class="text-gray-500">Account</p>
          <p class="font-medium text-gray-900 break-words">{{ salaryAccount }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-3">
          <p class="text-gray-500">Salary Day</p>
          <p class="font-medium text-gray-900">{{ salaryDay }}</p>
        </div>
        <div class="rounded-lg bg-gray-50 p-3">
          <p class="text-gray-500">Status</p>
          <p class="font-medium text-gray-900">{{ status }}</p>
        </div>
      </div>
    </div>
  `
})
export class BankingCardComponent {
  @Input({required:true}) bankName!: string;
  @Input({required:true}) salaryAccount!: string;
  @Input({required:true}) salaryDay!: number;
  @Input({required:true}) status!: string;
}

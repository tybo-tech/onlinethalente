import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryDay } from '../../../../../models/schema';

@Component({
  selector: 'app-offer-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Your Offer</h2>
        <i class="i-heroicons-currency-rand text-indigo-600 text-xl"></i>
      </div>

      <!-- Loan Amount -->
      <div class="space-y-2">
        <div class="text-3xl font-bold text-gray-900">
          {{ amountLabel }}
        </div>
        <div class="text-sm text-gray-600">
          Loan amount
        </div>
      </div>

      <!-- Interest Rate & Total Repayment -->
      <div *ngIf="interestRate !== undefined && totalRepaymentLabel" class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Interest Rate:</span>
          <span class="font-medium text-blue-700">{{ interestRate }}%</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Interest Amount:</span>
          <span class="font-medium text-blue-700">{{ interestLabel }}</span>
        </div>
        <div class="border-t border-blue-300 pt-2 flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">Total to Repay:</span>
          <span class="text-lg font-bold text-blue-800">{{ totalRepaymentLabel }}</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Over {{ loanTermMonths }} month{{ loanTermMonths > 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Salary Day -->
      <div class="text-sm text-gray-600">
        Salary day: <span class="font-medium">{{ selectedDay }}th</span>
      </div>

      <!-- Status -->
      <div class="p-3 rounded-lg"
           [ngClass]="isWindowOpen ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-yellow-50 border border-yellow-200 text-yellow-700'">
        <div class="flex items-center gap-2">
          <i [ngClass]="isWindowOpen ? 'i-heroicons-check-circle' : 'i-heroicons-clock'"></i>
          <span class="text-sm">
            {{ isWindowOpen ? 'Applications are open!' : windowMessage }}
          </span>
        </div>
      </div>

      <!-- Features -->
      <ul class="space-y-2 text-sm text-gray-700">
        <li class="flex items-center gap-2">
          <i class="i-heroicons-check-badge text-emerald-600"></i> AI checks on documents
        </li>
        <li class="flex items-center gap-2">
          <i class="i-heroicons-banknotes text-emerald-600"></i> Fast payout after approval
        </li>
        <li class="flex items-center gap-2">
          <i class="i-heroicons-shield-check text-emerald-600"></i> Bank-level security
        </li>
      </ul>
    </div>
  `
})
export class OfferSummaryComponent {
  @Input() amountLabel = '—';
  @Input() selectedDay!: SalaryDay;
  @Input() isWindowOpen = false;
  @Input() windowMessage = '';
  @Input() interestRate?: number;
  @Input() interestLabel?: string;
  @Input() totalRepaymentLabel?: string;
  @Input() loanTermMonths: number = 1;
}

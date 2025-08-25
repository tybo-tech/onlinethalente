import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-kpi-grid',
  imports: [CommonModule],
  template: `
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    <div class="bg-white rounded-xl shadow-sm p-4 text-center">
      <div class="text-2xl font-bold text-indigo-600">{{ submitted }}</div>
      <div class="text-sm text-gray-600">Submitted</div>
    </div>
    <div class="bg-white rounded-xl shadow-sm p-4 text-center">
      <div class="text-2xl font-bold text-blue-600">{{ verified }}</div>
      <div class="text-sm text-gray-600">Verified</div>
    </div>
    <div class="bg-white rounded-xl shadow-sm p-4 text-center">
      <div class="text-2xl font-bold text-emerald-600">{{ approved }}</div>
      <div class="text-sm text-gray-600">Approved</div>
    </div>
    <div class="bg-white rounded-xl shadow-sm p-4 text-center">
      <div class="text-2xl font-bold text-purple-600">{{ paid }}</div>
      <div class="text-sm text-gray-600">Paid</div>
    </div>
    <div class="bg-white rounded-xl shadow-sm p-4 text-center col-span-2">
      <div class="text-lg font-semibold text-gray-800">Disbursed (month)</div>
      <div class="text-2xl font-bold mt-1">{{ toRand(disbursedCents) }}</div>
    </div>
  </div>
  <div class="flex justify-end mt-3">
    <button (click)="refresh.emit()" class="text-sm underline">Refresh</button>
  </div>
  `
})
export class KpiGridComponent {
  @Input() submitted = 0;
  @Input() verified = 0;
  @Input() approved = 0;
  @Input() paid = 0;
  @Input() disbursedCents = 0;
  @Output() refresh = new EventEmitter<void>();

  toRand(cents: number) {
    return (cents / 100).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ICollectionData } from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';

@Component({
  selector: 'app-application-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-5 border-b bg-gradient-to-r from-sky-50 to-indigo-50">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            Application Details
            <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  [ngClass]="statusClass(app.data.status)">
              {{ app.data.status }}
            </span>
          </h2>
          <p class="mt-1 text-sm text-gray-600 truncate">
            {{ app.data.full_name }} • {{ app.data.email }} • {{ app.data.phone }}
          </p>
        </div>

        <!-- BIG AMOUNT -->
        <div class="shrink-0">
          <div class="rounded-2xl px-5 py-3 text-right shadow-sm
                      bg-gradient-to-tr from-indigo-500 to-violet-500 text-white">
            <p class="text-[11px] opacity-90">Requested Amount</p>
            <p class="text-3xl md:text-4xl font-extrabold tracking-tight leading-none">
              {{ (app.data.requested_amount_cents/100) | currency:'ZAR':'symbol':'1.0-0' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ApplicationHeaderComponent {
  @Input({required:true}) app!: ICollectionData<Application>;

  statusClass(s: string) {
    const k = (s||'').toUpperCase();
    return k === 'SUBMITTED' ? 'bg-gray-100 text-gray-800'
         : k === 'VERIFIED'  ? 'bg-blue-100 text-blue-800'
         : k === 'APPROVED'  ? 'bg-green-100 text-green-800'
         : k === 'DECLINED'  ? 'bg-red-100 text-red-800'
         : 'bg-slate-100 text-slate-800';
  }
}

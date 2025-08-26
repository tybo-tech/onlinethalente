import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICollectionData } from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';
import { ApplicationActionsComponent } from './application-actions.component';
import { ApplicationHeaderComponent } from './application-header.component';
import { BankingCardComponent } from './banking-card.component';
import { DebiCheckTimelineComponent } from './debicheck-timeline.component';
import { DocumentsListComponent } from './documents-list.component';
import { PaymentsListComponent } from './payments-list.component';



@Component({
  selector: 'app-application-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    ApplicationHeaderComponent,
    BankingCardComponent,
    DocumentsListComponent,
    DebiCheckTimelineComponent,
    PaymentsListComponent,
    ApplicationActionsComponent
  ],
  host: {'(document:keydown.escape)': 'close.emit()'},
  template: `
    <!-- Backdrop -->
    <div class="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="close.emit()"></div>

      <!-- Panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-[modalIn_.18s_ease-out]" (click)="$event.stopPropagation()">
          <!-- Header (big amount + name/status) -->
          <app-application-header [app]="app"></app-application-header>

          <!-- Body -->
          <div class="max-h-[70vh] overflow-y-auto p-5">
            <div class="grid gap-5 lg:grid-cols-3">
              <div class="space-y-5 lg:col-span-2">
                <app-documents-list [applicationId]="app.id"></app-documents-list>
                <app-debicheck-timeline [app]="app" [refreshTrigger]="refreshTrigger"></app-debicheck-timeline>
                <app-payments-list [app]="app" [refreshTrigger]="refreshTrigger"></app-payments-list>
              </div>

              <div class="space-y-5">
                <app-banking-card
                  [bankName]="app.data.bank_name"
                  [salaryAccount]="app.data.salary_account"
                  [salaryDay]="app.data.salary_day"
                  [status]="app.data.status">
                </app-banking-card>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="sticky bottom-0 bg-white border-t p-4">
            <app-application-actions [app]="app" (changed)="onApplicationChanged()"></app-application-actions>
            <div class="mt-3 flex justify-end">
              <button type="button" class="rounded-lg px-4 py-2 border hover:bg-gray-50" (click)="close.emit()">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes modalIn { from { opacity:.9; transform: translateY(4px) scale(.98) } to { opacity:1; transform: translateY(0) scale(1)} }
  `]
})
export class ApplicationDetailModalComponent {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Output() close = new EventEmitter<void>();
  @Output() changed = new EventEmitter<void>();

  // Refresh trigger for child components
  refreshTrigger = 0;

  onApplicationChanged() {
    // Increment refresh trigger to notify child components
    this.refreshTrigger++;
    this.changed.emit();
  }
}

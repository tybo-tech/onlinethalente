import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { Application, DebiCheckEvent } from '../../../../models/schema';
import { BusinessTxService } from '../../../../services/business/business-tx.service';

@Component({
  selector: 'app-debicheck-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border p-4 shadow-sm">
      <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <i class="fa fa-history text-amber-500" aria-hidden="true"></i> DebiCheck Timeline
      </h3>

      <div class="space-y-2" *ngIf="!loading; else skel">
        <div *ngFor="let e of events; trackBy: trackById" class="rounded-xl border p-3">
          <p class="text-sm font-medium text-gray-900">{{ e.data.status }}</p>
          <p class="text-xs text-gray-500">{{ e.data.created_at | date:'medium' }}</p>
        </div>
        <div *ngIf="events.length === 0" class="text-sm text-gray-500 text-center py-6">No DebiCheck events yet</div>
      </div>

      <ng-template #skel>
        <div class="space-y-2">
          <div class="h-12 rounded-xl border animate-pulse bg-gray-50"></div>
          <div class="h-12 rounded-xl border animate-pulse bg-gray-50"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class DebiCheckTimelineComponent implements OnInit, OnChanges {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Input() refreshTrigger?: any; // Used to trigger refresh when parent changes
  events: ICollectionData<DebiCheckEvent>[] = [];
  loading = true;

  constructor(private btx: BusinessTxService) {}

  async ngOnInit() {
    await this.loadEvents();
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Refresh when refreshTrigger input changes
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      await this.loadEvents();
    }
  }

  private async loadEvents() {
    this.loading = true;
    this.events = await firstValueFrom(this.btx.debiCheckEvents$(this.app));
    this.loading = false;
  }

  trackById(_: number, x: { id: any }) { return x.id; }
}

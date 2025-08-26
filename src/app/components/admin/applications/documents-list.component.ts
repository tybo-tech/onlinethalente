import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { CollectionDataService } from '../../../../services/collection.data.service';

type Doc = ICollectionData<{ url?: string; kind: string; application_id: number; storage_url?: string }>;

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-2xl border p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <i class="fa fa-file-text text-rose-500" aria-hidden="true"></i> Documents
        </h3>
        <button type="button" class="text-xs text-indigo-600 hover:text-indigo-800" (click)="copyAll()">
          Copy all links
        </button>
      </div>

      <div class="mt-3 space-y-2" *ngIf="!loading; else docsSkeleton">
        <div *ngFor="let d of docs; trackBy: trackById" class="rounded-xl border p-3 flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-gray-900 truncate">{{ d.data.kind }}</p>
              <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold
                           bg-gradient-to-r from-amber-100 to-rose-100 text-rose-700 border border-rose-200">
                DOC
              </span>
            </div>

            <a class="mt-1 block text-xs text-indigo-600 hover:text-indigo-800 hover:underline break-all"
               [href]="docUrl(d)" target="_blank" rel="noopener">
              {{ docUrl(d) }}
            </a>
          </div>

          <div class="shrink-0 flex items-center gap-2">
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-gray-50"
                    (click)="open(d)">
              <i class="fa fa-eye" aria-hidden="true"></i> View
            </button>
            <button type="button" class="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-sm hover:bg-gray-50"
                    (click)="copy(docUrl(d))">
              <i class="fa fa-link" aria-hidden="true"></i> Copy
            </button>
          </div>
        </div>

        <div *ngIf="docs.length === 0" class="text-sm text-gray-500 text-center py-6">
          No documents uploaded yet
        </div>
      </div>

      <ng-template #docsSkeleton>
        <div class="space-y-2">
          <div class="h-16 rounded-xl border animate-pulse bg-gray-50"></div>
          <div class="h-16 rounded-xl border animate-pulse bg-gray-50"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class DocumentsListComponent implements OnInit, OnDestroy {
  @Input({required:true}) applicationId!: number;

  docs: Doc[] = [];
  loading = true;
  private sub?: Subscription;

  constructor(private cds: CollectionDataService) {}

  ngOnInit() {
    this.sub = this.cds.getChildren(this.applicationId, 'application_documents').subscribe((arr: Doc[]) => {
      this.docs = arr || [];
      this.loading = false;
    });
  }
  ngOnDestroy() { this.sub?.unsubscribe(); }

  trackById(_: number, x: { id: any }) { return x.id; }

  docUrl(d: Doc) { return d.data.url || d.data.storage_url || '#'; }

  open(d: Doc) { const u = this.docUrl(d); if (u !== '#') window.open(u, '_blank'); }

  async copy(text: string) { try { await navigator.clipboard.writeText(text); } catch {} }

  async copyAll() {
    const all = this.docs.map(d => this.docUrl(d)).filter(u => u && u !== '#').join('\n');
    if (!all) return;
    try { await navigator.clipboard.writeText(all); } catch {}
  }
}

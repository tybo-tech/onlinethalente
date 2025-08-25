import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LocalDoc = { file: File; name: string; size: number; type: string };

@Component({
  selector: 'app-document-uploader',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">
      <i class="i-heroicons-arrow-up-tray mr-1"></i> Upload Bank Statements
    </label>

    <div class="flex items-center gap-3">
      <label class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer">
        <i class="i-heroicons-paper-clip text-gray-600"></i>
        <span>Select files</span>
        <input type="file" class="sr-only" multiple (change)="onPick($event)"
               accept="application/pdf,image/png,image/jpeg" />
      </label>
      <span class="text-xs text-gray-500">PDF, JPG, or PNG. Max ~10MB each.</span>
    </div>

    <ul *ngIf="files?.length" class="space-y-2">
      <li *ngFor="let d of files; let i = index" class="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-2">
          <i class="i-heroicons-document text-gray-500"></i>
          <div>
            <div class="text-sm font-medium text-gray-900">{{ d.name }}</div>
            <div class="text-xs text-gray-500">{{ prettySize(d.size) }}</div>
          </div>
        </div>
        <button type="button" (click)="remove(i)" class="btn-ghost text-rose-600">
          <i class="i-heroicons-trash mr-1"></i> Remove
        </button>
      </li>
    </ul>
  </div>
  `
})
export class DocumentUploaderComponent {
  @Input() files: LocalDoc[] = [];
  @Output() filesChange = new EventEmitter<LocalDoc[]>();

  onPick(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    const next = [...this.files];
    Array.from(input.files).forEach(f => next.push({ file: f, name: f.name, size: f.size, type: f.type }));
    this.filesChange.emit(next);
    input.value = ''; // reset
  }

  remove(i: number) {
    const next = [...this.files];
    next.splice(i, 1);
    this.filesChange.emit(next);
  }

  prettySize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
    }
}

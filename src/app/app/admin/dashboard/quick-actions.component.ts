import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type QuickAction = { id: string; label: string; icon: string; route: string };

@Component({
  standalone: true,
  selector: 'app-quick-actions',
  imports: [CommonModule],
  template: `
  <div class="flex flex-wrap gap-2">
    <button
      *ngFor="let a of actions; trackBy: trackById"
      (click)="navigate.emit(a.route)"
      class="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center gap-2 text-sm"
    >
      <span class="text-lg">{{ a.icon }}</span>
      <span class="font-medium">{{ a.label }}</span>
    </button>
  </div>
  `
})
export class QuickActionsComponent {
  @Input() actions: QuickAction[] = [];
  @Output() navigate = new EventEmitter<string>();
  trackById = (_: number, a: QuickAction) => a.id;
}

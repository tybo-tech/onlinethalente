import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-window-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="selectedDay"
         class="p-3 rounded-lg flex items-center gap-2"
         [ngClass]="isOpen ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'"
         aria-live="polite">
      <i class="text-xl" [ngClass]="isOpen ? 'i-heroicons-check-circle text-green-600' : 'i-heroicons-clock text-yellow-600'"></i>
      <span class="text-sm">
        {{ isOpen ? 'Applications are open!' : message }}
      </span>
    </div>
  `
})
export class WindowBannerComponent {
  @Input() selectedDay?: number;
  @Input() isOpen = false;
  @Input() message = '';
}

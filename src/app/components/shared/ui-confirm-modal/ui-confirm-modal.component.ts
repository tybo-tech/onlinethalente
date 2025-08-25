import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiModalComponent } from '../ui-modal/ui-modal.component';

@Component({
  selector: 'ui-confirm-modal',
  standalone: true,
  imports: [CommonModule, UiModalComponent],
  template: `
    <ui-modal [(open)]="open" [title]="title">
      <div class="text-gray-600">{{ message }}</div>

      <ng-template #footer>
        <button
          type="button"
          class="btn-secondary"
          (click)="onCancel()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn-danger"
          (click)="onConfirm()"
        >
          <i class="i-heroicons-exclamation-triangle mr-1"></i>
          {{ confirmText }}
        </button>
      </ng-template>
    </ui-modal>
  `
})
export class UiConfirmModalComponent {
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() open = false;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.open = false;
    this.openChange.emit(false);
  }

  onCancel() {
    this.cancel.emit();
    this.open = false;
    this.openChange.emit(false);
  }
}

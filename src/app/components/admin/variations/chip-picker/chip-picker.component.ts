import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chip-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chip-picker.component.html',
  styleUrls: ['./chip-picker.component.scss'],
})
export class ChipPickerComponent {
  @Input() label = 'Options';
  @Input() options: { id: number; label: string }[] = [];
  @Input() selectedIds: number[] = [];

  @Output() selectionChange = new EventEmitter<number[]>();

  showModal = false;

  isSelected(id: number) {
    return this.selectedIds.includes(id);
  }

  toggle(id: number) {
    if (this.isSelected(id)) {
      this.selectedIds = this.selectedIds.filter((x) => x !== id);
    } else {
      this.selectedIds = [...this.selectedIds, id];
    }
    this.selectionChange.emit(this.selectedIds);
  }

  remove(id: number) {
    this.selectedIds = this.selectedIds.filter((x) => x !== id);
    this.selectionChange.emit(this.selectedIds);
  }

  get selectedOptions() {
    return this.options.filter((opt) => this.selectedIds.includes(opt.id));
  }
}

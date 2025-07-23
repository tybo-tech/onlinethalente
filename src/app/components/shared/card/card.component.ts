import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModel } from '../../../../models/CardModel';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() model!: CardModel;
  @Input() deleteConfirm = 'Are you sure you want to delete this item?';
  @Output() onDanger = new EventEmitter<void>();
  @Output() onPrimary = new EventEmitter<void>();
  onDelete() {
    if (confirm(this.deleteConfirm)) {
      this.onDanger.emit();
    }
  }
}

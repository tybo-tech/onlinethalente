import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICollectionData } from '../../../../../models/ICollection';
import { Variation } from '../../../../../models/schema';
import { ItemVariationOptionComponent } from '../item-variation-option/item-variation-option.component';

@Component({
  selector: 'app-item-variation-manager',
  standalone: true,
  imports: [CommonModule, ItemVariationOptionComponent],
  templateUrl: './item-variation-manager.component.html',
  styleUrls: ['./item-variation-manager.component.scss'],
})
export class ItemVariationManagerComponent {
  @Input({ required: true }) itemId!: number;
  @Input({ required: true }) variation!: ICollectionData<Variation, any>;
  @Input({ required: true }) linkedVariations: ICollectionData<Variation>[] = [];
  @Output() remove = new EventEmitter<number>(); // emits variation.id to remove

  removeVariation(variationId: number) {
    this.remove.emit(variationId);
  }
}

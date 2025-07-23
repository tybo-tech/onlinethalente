import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ICollectionData,
  ICollectionLink,
  CollectionNames,
  CollectionIds,
} from '../../../../../models/ICollection';
import { Variation } from '../../../../../models/schema';
import { CollectionLinkService } from '../../../../../services/collection-link.service';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ItemVariationManagerComponent } from "../item-variation-manager/item-variation-manager.component";

@Component({
  selector: 'app-item-variation',
  standalone: true,
  imports: [CommonModule, ItemVariationManagerComponent],
  templateUrl: './item-variation.component.html',
  styleUrls: ['./item-variation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ItemVariationComponent,
      multi: true,
    },
  ],
})
export class ItemVariationComponent implements OnChanges, ControlValueAccessor {
  @Input({ required: true }) itemId!: number;
  @Input({ required: true }) itemCollectionId!: CollectionIds;

  variations: ICollectionData<Variation>[] = [];
  links: ICollectionLink[] = [];
  showAddModal = false;

  constructor(
    private variationService: CollectionDataService<Variation>,
    private linkService: CollectionLinkService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId'] && this.itemId > 0) {
      this.load();
    }
  }

  load() {
    this.variationService
      .getDataByCollectionId(CollectionNames.Variations)
      .subscribe((all) => (this.variations = all));

    this.linkService
      .getLinksBySource(this.itemId, 'product-variation')
      .subscribe((res) => (this.links = res));
  }

  isLinked(variationId: number): boolean {
    return this.links.some((l) => l.target_id === variationId);
  }

  linkVariation(variation: ICollectionData<Variation>) {
    this.linkService
      .addLink({
        source_id: this.itemId,
        source_collection: this.itemCollectionId,
        target_id: variation.id,
        target_collection: CollectionNames.Variations,
        relation_type: 'product-variation',
      })
      .subscribe((link) => {
        this.links.push(link);
        this.notifyFormTouched(); // <- add this
      });
  }

  unlinkVariation(variationId: number) {
    const link = this.links.find((l) => l.target_id === variationId);
    if (!link) return;

    this.linkService.removeLinkById(link.id).subscribe(() => {
      this.links = this.links.filter((l) => l.id !== link.id);
      this.notifyFormTouched(); // <- add this
    });
  }

  getLinkedVariations(): ICollectionData<Variation>[] {
    return this.variations.filter((v) => this.isLinked(v.id));
  }

  getUnlinkedVariations(): ICollectionData<Variation>[] {
    return this.variations.filter((v) => !this.isLinked(v.id));
  }

  toggle(variation: ICollectionData<Variation>) {
    this.isLinked(variation.id)
      ? this.unlinkVariation(variation.id)
      : this.linkVariation(variation);
  }

  // Required for ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    // Nothing to write (this is read-only visual form control)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Call this when links are updated
  notifyFormTouched() {
    this.onChange(this.links.map((l) => l.target_id));
    this.onTouched();
  }
}

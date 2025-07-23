import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ICollectionData,
  ICollectionLink,
  CollectionNames,
} from '../../../../../models/ICollection';
import { VariationOption } from '../../../../../models/schema';
import { CollectionLinkService } from '../../../../../services/collection-link.service';
import { CollectionDataService } from '../../../../../services/collection.data.service';

@Component({
  selector: 'app-item-variation-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-variation-option.component.html',
  styleUrls: ['./item-variation-option.component.scss'],
})
export class ItemVariationOptionComponent implements OnInit {
  @Input({ required: true }) variationId!: number;

  options: ICollectionData<VariationOption>[] = [];
  links: ICollectionLink[] = [];
  showAdd = false;

  constructor(
    private dataService: CollectionDataService<VariationOption>,
    private linkService: CollectionLinkService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.dataService
      .getChildren(this.variationId, CollectionNames.Variations)
      .subscribe((res) => (this.options = res));

      // Get all options linked to this variation
    this.linkService
      .getLinksBySource(this.variationId, 'item-variation')
      .subscribe((res) => (this.links = res));
  }

  isLinked(optionId: number): boolean {
    return this.links.some(
      (l) =>
        l.target_id === optionId &&
        l.relation_type === 'product-variation-option'
    );
  }

  toggle(option: ICollectionData<VariationOption>) {
    this.isLinked(option.id) ? this.unlink(option.id) : this.link(option);
  }

  link(option: ICollectionData<VariationOption>) {
    this.linkService
      .addLink({
        source_id: this.variationId,
        source_collection: 'item-variation', // Variation linked to this item(collection)
        target_id: option.id,
        target_collection: 'item-variation-option', // Option collection
        relation_type: 'product-variation-option',
        data: {
          variation_id: this.variationId,
        },
      })
      .subscribe((link) => this.links.push(link));
  }

  unlink(optionId: number) {
    const link = this.links.find(
      (l) =>
        l.target_id === optionId &&
        l.relation_type === 'product-variation-option'
    );
    if (!link) return;

    this.linkService.removeLinkById(link.id).subscribe(() => {
      this.links = this.links.filter((l) => l.id !== link.id);
    });
  }
}

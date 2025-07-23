import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ICollectionData,
  ICollectionLink,
  CollectionNames,
} from '../../../../../models/ICollection';
import { Variation, VariationOption } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CollectionLinkService } from '../../../../../services/collection-link.service';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ChipPickerComponent } from '../chip-picker/chip-picker.component';

@Component({
  selector: 'app-product-variation-manager',
  templateUrl: './product-variation-manager.component.html',
  styleUrls: ['./product-variation-manager.component.scss'],
  imports: [CommonModule, ChipPickerComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductVariationManagerComponent,
      multi: true,
    },
  ],
})
export class ProductVariationManagerComponent
  implements  ControlValueAccessor,OnChanges
{
  @Input() productId!: number;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) formControlName!: string;
  allVariations: ICollectionData<Variation, VariationOption>[] = [];
  links: ICollectionLink[] = [];
  showModalFor: number | null = null; // variationId

  constructor(
    private variationService: CollectionDataService<Variation, VariationOption>,
    private linkService: CollectionLinkService
  ) {}

  
ngOnChanges(changes: SimpleChanges): void {
  if (changes['productId'] && this.productId > 0) {
    this.loadData();
  }
}
  loadData() {
    this.variationService
      .getDataByCollectionId(
        CollectionNames.Variations,
        CollectionNames.VariationOptions
      )
      .subscribe((variations) => {
        this.allVariations = variations;
        this.linkService
          .getLinksBySource(this.productId, 'product-variation-option')
          .subscribe((links) => {
            this.links = links;
          });
      });
  }

  isLinked(optionId: number): boolean {
    return this.links.some(
      (l) =>
        l.target_id === optionId && l.target_collection === 'variation_options'
    );
  }

  unlink(optionId: number) {
    const link = this.links.find((l) => l.target_id === optionId);
    if (!link) return;

    this.linkService.removeLinkById(link.id).subscribe(() => {
      this.links = this.links.filter((l) => l.id !== link.id);
    });
  }

  link(option: ICollectionData<VariationOption>) {
    this.linkService
      .addLink({
        source_id: this.productId,
        source_collection: CollectionNames.Products,
        target_id: option.id,
        target_collection: CollectionNames.VariationOptions,
        relation_type: 'product-variation-option',
      })
      .subscribe((res) => {
        this.links.push(res);
      });
  }

  toggleOption(option: ICollectionData<VariationOption>) {
    this.isLinked(option.id) ? this.unlink(option.id) : this.link(option);
  }

  openOptionModal(variationId: number) {
    this.showModalFor = variationId;
  }

  closeModal() {
    this.showModalFor = null;
  }
  getModalOptions(): ICollectionData<VariationOption>[] {
    const variation = this.allVariations.find(
      (v) => v.id === this.showModalFor
    );
    return variation?.children || [];
  }
  getSelectedOptions(variation: ICollectionData<Variation, VariationOption>) {
    return (
      variation.children
        ?.filter((opt) => this.isLinked(opt.id))
        .map((opt) => opt.id) || []
    );
  }

  onOptionChange(
    selectedIds: number[],
    variation: ICollectionData<Variation, VariationOption>
  ) {
    const optionIds = variation.children?.map((opt) => opt.id) || [];

    for (const id of optionIds) {
      const shouldBeLinked = selectedIds.includes(id);
      const isCurrentlyLinked = this.isLinked(id);

      if (shouldBeLinked && !isCurrentlyLinked)
        this.link({
          id,
          data: { value: '' },
          parent_id: 0,
          collection_id: CollectionNames.VariationOptions,
          website_id: '',
        });
      if (!shouldBeLinked && isCurrentlyLinked) this.unlink(id);
    }
  }
  getChipOptions(variation: ICollectionData<Variation, VariationOption>) {
    return (variation.children || []).map((opt) => ({
      id: opt.id,
      label: opt.data?.value || '',
    }));
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

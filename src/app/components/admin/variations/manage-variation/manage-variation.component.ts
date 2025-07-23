import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { Variation, VariationOption } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentEditableDirective } from '../../../../directives/content-editable.directive';

@Component({
  selector: 'app-manage-variation',
  imports: [CommonModule, FormsModule, ContentEditableDirective],
  templateUrl: './manage-variation.component.html',
  styleUrl: './manage-variation.component.scss',
})
export class ManageVariationComponent implements OnInit {
  id: string = 'add';
  isEdit = false;
  variationId = 0;
  loading = false;
  variation!: ICollectionData<Variation, VariationOption>;
  showAddInput = false;
  newOption = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CollectionDataService<Variation, VariationOption>,
    private variationOptionService: CollectionDataService<VariationOption>,
  private variationService: CollectionDataService<Variation>
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add';

    if (this.isEdit) {
      this.variationId = +this.id;
      this.service.getWithChildren(this.variationId).subscribe((res) => {
        this.variation = res;
      });
    } else {
      this.variation = {
        id: 0,
        parent_id: 0,
        website_id: CollectionNames.WebsiteId,
        collection_id: CollectionNames.Variations,
        data: { name: '' },
        children: [],
      };
    }
  }

  addOption() {
    const value = this.newOption.trim();
    if (!value) return;
    this.variation.children = this.variation.children || [];
    this.variation.children.push({
      id: 0,
      parent_id: this.variation.id,
      website_id: this.variation.website_id,
      collection_id: CollectionNames.VariationOptions,
      data: { value },
    });
    this.newOption = '';
    this.showAddInput = false;
  }

  removeOption(index: number) {
    const iitem = this.variation.children?.[index];
    if (!iitem) return;
    this.variation.children?.splice(index, 1);
    if(iitem.id > 0) {
      this.variationOptionService.deleteData(iitem.id).subscribe({
        next: () => {},
        error: () => {
          alert('Failed to delete option.');
        },
      });
    }
  }

  save() {
    this.loading = true;
    const save$ = this.isEdit
      ? this.service.updateData(this.variation)
      : this.service.addData(this.variation);

    save$.subscribe({
      next: () => {
        this.router.navigate(['/admin/variations']);
        this.loading = false;
      },
      error: () => {
        alert('Something went wrong while saving.');
        this.loading = false;
      },
    });
  }

  cancel() {
    this.router.navigate(['/admin/variations']);
  }
  contentChanged($event: string, option: ICollectionData<VariationOption>) {
    if (option.data.value !== $event) {
      option.data.value = $event;
      this.variationOptionService.updateData(option).subscribe({
        next: () => {},
        error: () => {
          alert('Failed to update option value.');
        },
      });
    }
  }
}

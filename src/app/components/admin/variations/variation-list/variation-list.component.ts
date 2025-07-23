import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { Variation, VariationOption } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';

@Component({
  selector: 'app-variation-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './variation-list.component.html',
  styleUrl: './variation-list.component.scss',
})
export class VariationListComponent {
  list: ICollectionData<Variation, VariationOption>[] = [];

  instance = {
    singular: 'variation',
    plural: 'variations',
    title: 'Variations',
    addButton: 'Add Variation',
  };

  constructor(
    private dataService: CollectionDataService<Variation, VariationOption>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.dataService
      .getDataByCollectionId(
        CollectionNames.Variations,
        CollectionNames.VariationOptions
      )
      .subscribe((res) => {
        this.list = res;
      });
  }

  get deleteConfirm() {
    return `Are you sure you want to delete this ${this.instance.singular}?`;
  }

  edit(item: ICollectionData<Variation>) {
    this.router.navigate(['/admin/variation', item.id]);
  }

  delete(id: number) {
    if (!confirm(this.deleteConfirm)) return;

    this.dataService.deleteData(id).subscribe(() => this.loadList());
  }

  onFormSaved(item: ICollectionData<Variation>) {
    this.loadList();
  }

  openOptionsModal(item: ICollectionData<Variation>) {
    // Placeholder for future modal integration
    console.log('Open modal to manage options for:', item);
  }
}

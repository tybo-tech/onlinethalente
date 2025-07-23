import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../../../models/schema';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  list: ICollectionData<Product>[] = [];
  instance = {
    singular: 'product',
    plural: 'products',
    title: 'Products',
    addButton: 'Add Product',
  };

  constructor(
    private dataService: CollectionDataService<Product>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Products)
      .subscribe((res) => {
        this.list = res;
      });
  }

  get deleteConfirm() {
    return `Are you sure you want to delete this ${this.instance.singular}?`;
  }

  edit(cat: ICollectionData<Product>) {
    this.router.navigate(['/admin', this.instance.singular, cat.id]);
  }

  delete(id: number) {
    this.dataService.deleteData(id).subscribe(() => this.loadList());
  }

  onFormSaved(cat: ICollectionData<Product>) {
    this.loadList();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICollectionData } from '../../../../models/ICollection';
import { Category, Product } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';
import { CardModel } from '../../../../models/CardModel';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss'],
  imports: [CommonModule, CardComponent],
})
export class CategoryPageComponent implements OnInit {
  categoryId!: number;
  category?: ICollectionData<Category>;
  items: ICollectionData<Product>[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: CollectionDataService<any>,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.categoryId = Number(params['id']);
      this.loadItems();
    });
  }

  ngOnInit(): void {}

  loadItems() {
    this.dataService.getWithChildren(this.categoryId).subscribe((category) => {
      this.category = category as ICollectionData<Category>;
      // Items are products or printables
      this.items = (category.children || []).filter(
        (x) => x.collection_id === 'products' || x.collection_id === 'printable'
      ) as ICollectionData<Product>[];
    });
  }

  toCardModel(item: ICollectionData<Product>): CardModel {
    const isPrintable = item.collection_id === 'printable';
    return {
      title: item.data.name,
      description: item.data.description,
      image: item.data.image || item.data.image,
      actionLabel: isPrintable ? 'Get Quote' : 'Order',
      icon: isPrintable ? 'fas fa-print' : 'fas fa-shopping-cart',
      border: true,
      rounded: true,
    };
  }

  onItemAction(item: ICollectionData<Product>) {
    this.router.navigate(['/details', item.id]);
    // Navigate to product or printable detail page, or open modal
    // if (item.collection_id === 'products') {
    //   this.router.navigate(['/product', item.id]);
    // } else if (item.collection_id === 'printable') {
    //   this.router.navigate(['/printable', item.id]);
    // }
  }
}

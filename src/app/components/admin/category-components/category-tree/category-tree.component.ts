import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { ICollectionData } from '../../../../../models/ICollection';
import { CommonModule } from '@angular/common';
import { CategoryNodeComponent } from '../category-node/category-node.component';

@Component({
  selector: 'app-category-tree',
  imports: [CommonModule, CategoryNodeComponent],
  templateUrl: './category-tree.component.html',
  styleUrl: './category-tree.component.scss',
})
export class CategoryTreeComponent {
  categoryTree: ICollectionData<Category, Category>[] = [];
  constructor(
    private categoryService: CollectionDataService<Category>,
    private router: Router
  ) {
    categoryService.categoryTree<Category, Category>().subscribe((tree) => {
      this.categoryTree = tree || [];
    });
  }
}

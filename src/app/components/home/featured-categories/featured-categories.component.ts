import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../models/ICollection';
import { Category } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';

@Component({
  selector: 'app-featured-categories',
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class FeaturedCategoriesComponent implements OnInit {
  categories: ICollectionData<Category>[] = [];
  loading = true;

  constructor(
    private categoryService: CollectionDataService<Category>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService
      .findParentsThatHaveChildren(CollectionNames.Categories)
      .subscribe((res) => {
        // Only top-level categories (parent_id === 0)
        this.categories = res.filter((cat) => cat.parent_id === 0);
        this.loading = false;
      });
  }

  goToCategory(cat: ICollectionData<Category>) {
    this.router.navigate(['/category', cat.id]);
  }
}

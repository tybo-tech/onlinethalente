import { Component, OnInit } from '@angular/core';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { Category } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardComponent } from "../../../shared/card/card.component";

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  imports: [CommonModule, RouterModule, CardComponent],
})
export class ListCategoriesComponent implements OnInit {
  categories: ICollectionData<Category>[] = [];

  constructor(private categoryService: CollectionDataService<Category>, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getDataByCollectionId(CollectionNames.Categories)
      .subscribe((res) => {
        this.categories = res;
      });
  }



  editCategory(cat: ICollectionData<Category>) {
   this.router.navigate(['/admin/category', cat.id]);
  }

  deleteCategory(id: number) {
    this.categoryService.deleteData(id).subscribe(() => this.loadCategories());
  }

  onFormSaved(cat: ICollectionData<Category>) {
    this.loadCategories();
  }

}

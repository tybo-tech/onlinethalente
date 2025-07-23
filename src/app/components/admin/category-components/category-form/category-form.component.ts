import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInput } from '../../../../../models/FormInput';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { Category } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
  ],
})
export class CategoryFormComponent implements OnInit {
  id: string = 'add';
  isEdit = false;
  categoryId: number = 0;
  loading = false;
  initialData: any = {};
  formInputs: FormInput[] = [
    {
      key: 'name',
      label: 'Category Name',
      type: 'text',
      required: true,
      placeholder: 'Enter category name',
    },
    {
      key: 'image',
      label: 'Image',
      type: 'image',
      placeholder: 'Upload category image',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CollectionDataService<Category>
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add' && !isNaN(+this.id);
    if (this.isEdit) {
      this.categoryId = +this.id;
      this.service.getDataById(this.categoryId).subscribe((res) => {
        this.initialData = res?.data || {};
        this.loading = false;
      });
    } else {
      this.loading = false;
      0;
      this.initialData = {};
    }
  }

  onSave(data: any) {
    this.loading = true;

    const payload: ICollectionData<Category> = {
      id: this.isEdit ? this.categoryId : 0,
      parent_id: 0, // Assuming top-level categories for now
      collection_id: CollectionNames.Categories,
      website_id: CollectionNames.WebsiteId,
      data,
    };

    const save$ = this.isEdit
      ? this.service.updateData(payload)
      : this.service.addData(payload);

    save$.subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']);
        this.loading = false;
      },
      error: () => {
        alert('Something went wrong while saving.');
        this.loading = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/admin/categories']);
  }
}

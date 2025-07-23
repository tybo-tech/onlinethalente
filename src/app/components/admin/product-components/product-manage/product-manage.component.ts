import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInput } from '../../../../../models/FormInput';
import {
  ICollectionData,
  CollectionNames,
  CollectionIds,
} from '../../../../../models/ICollection';
import { Product, Category } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';

@Component({
  selector: 'app-product-manage',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
  ],
  templateUrl: './product-manage.component.html',
  styleUrl: './product-manage.component.scss',
})
export class ProductManageComponent implements OnInit {
  id: string = 'add';
  isEdit = false;
  itemCollectionId : CollectionIds = CollectionNames.Products;
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
    //description field added
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter category description',
    },
    //price
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      placeholder: 'Enter product price',
    },
    //category field added
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [], // This will be populated with categories from the service
      placeholder: 'Select product category',
    },
    {
      key: 'variations',
      label: 'Variations',
      type: 'variation',
      placeholder: 'Select product variations',
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
    private service: CollectionDataService<Product>,
    private categoryService: CollectionDataService<Category>
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add' && !isNaN(+this.id);
    if (this.isEdit) {
      this.service.getDataById(+this.id).subscribe((res) => {
        if (res && res.id) {
          this.initialData = res.data || {};
          this.initialData['id'] = res.id || 0; // Set ID for form
          this.initialData['category'] = res?.parent_id || 0; // Set category ID for select field
          this.loadCategories();
        }
      });
    } else {
      this.loadCategories();
      0;
      this.initialData = {};
    }
  }
  loadCategories() {
    this.categoryService
      .getDataByCollectionId(CollectionNames.Categories)
      .subscribe((categories) => {
        this.formInputs.find((input) => input.key === 'category')!.options =
          categories.map((cat) => ({
            label: cat.data.name,
            value: cat.id,
          }));
        this.loading = false;
      });
  }

  onSave(data: any) {
    this.loading = true;

    const payload: ICollectionData<Product> = {
      id: this.isEdit ? this.categoryId : 0,
      collection_id: CollectionNames.Categories,
      website_id: CollectionNames.WebsiteId,
      data,
      parent_id: data.category || 0, // Assuming category is a select field with category ID
    };

    const save$ = this.isEdit
      ? this.service.updateData(payload)
      : this.service.addData(payload);

    save$.subscribe({
      next: () => {
        this.router.navigate(['/admin/products']);
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

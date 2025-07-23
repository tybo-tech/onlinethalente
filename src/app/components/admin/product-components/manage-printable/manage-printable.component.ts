import { Component, OnInit } from '@angular/core';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { Category, Printable, Product } from '../../../../../models/schema';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInput } from '../../../../../models/FormInput';
import {
  CollectionNames,
  ICollectionData,
} from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-printable',
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './manage-printable.component.html',
  styleUrl: './manage-printable.component.scss',
})
export class ManagePrintableComponent implements OnInit {
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
      key: 'image',
      label: 'Image',
      type: 'image',
      placeholder: 'Upload category image',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CollectionDataService<Printable>,
    private categoryService: CollectionDataService<Category>
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add' && !isNaN(+this.id);
    if (this.isEdit) {
      this.categoryId = +this.id;
      this.service.getDataById(this.categoryId).subscribe((res) => {
        this.initialData = res?.data || {};
        this.initialData['category'] = res?.parent_id || 0; // Set category ID for select field
        this.loadCategories();
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

    const payload: ICollectionData<Printable> = {
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
        this.router.navigate(['/admin/printables']);
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

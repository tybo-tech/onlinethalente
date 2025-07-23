import { Component, OnInit } from '@angular/core';
import { DynamicFormComponent } from "../../../shared/dynamic-form/dynamic-form.component";
import {  Project } from '../../../../../models/schema';
import { ActivatedRoute, Router } from '@angular/router';
import { FormInput } from '../../../../../models/FormInput';
import { CollectionNames, ICollectionData } from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-manage',
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './gallery-manage.component.html',
  styleUrl: './gallery-manage.component.scss'
})
export class GalleryManageComponent  implements OnInit {
  id: string = 'add';
  isEdit = false;
  categoryId: number = 0;
  loading = false;
  initialData: any = {};
  formInputs: FormInput[] = [
    {
      key: 'name',
      label: 'Project Name',
      type: 'text',
      required: true,
      placeholder: 'Enter project name',
    },
    //description field added
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter project description',
    },
  
 
    {
      key: 'image',
      label: 'Image',
      required: true,
      type: 'image',
      placeholder: 'Upload project image',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CollectionDataService<Project>,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || 'add';
    this.isEdit = this.id !== 'add' && !isNaN(+this.id);
    if (this.isEdit) {
      this.categoryId = +this.id;
      this.service.getDataById(this.categoryId).subscribe((res) => {
        this.initialData = res?.data || {};
      });
    } else {
      0;
      this.initialData = {};
    }
  }


  onSave(data: any) {
    this.loading = true;

    const payload: ICollectionData<Project> = {
      id: this.isEdit ? this.categoryId : 0,
      collection_id: CollectionNames.Projects,
      data,
      website_id: CollectionNames.WebsiteId,
      parent_id: data.category || 0, 
    };

    const save$ = this.isEdit
      ? this.service.updateData(payload)
      : this.service.addData(payload);

    save$.subscribe({
      next: () => {
        this.router.navigate(['/admin/projects']);
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

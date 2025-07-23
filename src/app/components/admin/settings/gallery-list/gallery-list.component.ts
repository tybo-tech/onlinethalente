import { Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ICollectionData, CollectionNames } from '../../../../../models/ICollection';
import { Project } from '../../../../../models/schema';
import { CollectionDataService } from '../../../../../services/collection.data.service';

@Component({
  selector: 'app-gallery-list',
  imports: [CardComponent, CommonModule, RouterModule],
  templateUrl: './gallery-list.component.html',
  styleUrl: './gallery-list.component.scss',
})
export class GalleryListComponent {
   list: ICollectionData<Project>[] = [];
  instance = {
    singular: 'project',
    plural: 'projects',
    title: 'Projects',
    addButton: 'Add Project',
  };

  constructor(
    private dataService: CollectionDataService<Project>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Projects)
      .subscribe((res) => {
        this.list = res;
      });
  }

  get deleteConfirm() {
    return `Are you sure you want to delete this ${this.instance.singular}?`;
  }

  edit(cat: ICollectionData<Project>) {
    this.router.navigate(['/admin', this.instance.singular, cat.id]);
  }

  delete(id: number) {
    this.dataService.deleteData(id).subscribe(() => this.loadList());
  }

  onFormSaved(cat: ICollectionData<Project>) {
    this.loadList();
  }
}

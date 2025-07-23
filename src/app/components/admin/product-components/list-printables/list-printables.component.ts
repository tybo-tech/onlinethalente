import { Component } from '@angular/core';
import { Printable } from '../../../../../models/schema';
import { Router, RouterModule } from '@angular/router';
import {
  ICollectionData,
  CollectionNames,
} from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CardComponent } from '../../../shared/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-printables',
  imports: [CardComponent, CommonModule, RouterModule],
  templateUrl: './list-printables.component.html',
  styleUrl: './list-printables.component.scss',
})
export class ListPrintablesComponent {
  list: ICollectionData<Printable>[] = [];
  instance = {
    singular: 'printable',
    plural: 'printables',
    title: 'Printables',
    addButton: 'Add Printable',
  };

  constructor(
    private dataService: CollectionDataService<Printable>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Printables)
      .subscribe((res) => {
        this.list = res;
      });
  }

  get deleteConfirm() {
    return `Are you sure you want to delete this ${this.instance.singular}?`;
  }

  edit(cat: ICollectionData<Printable>) {
    this.router.navigate(['/admin', this.instance.singular, cat.id]);
  }

  delete(id: number) {
    this.dataService.deleteData(id).subscribe(() => this.loadList());
  }

  onFormSaved(cat: ICollectionData<Printable>) {
    this.loadList();
  }
}

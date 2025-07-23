import { Component } from '@angular/core';
import { Order } from '../../../../../models/schema';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ICollectionData, CollectionNames } from '../../../../../models/ICollection';
import { CollectionDataService } from '../../../../../services/collection.data.service';
import { CardComponent } from '../../../shared/card/card.component';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, RouterModule, CardComponent],

  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent {
list: ICollectionData<Order>[] = [];
  instance = {
    singular: 'order',
    plural: 'orders',
    title: 'Orders',
    addButton: 'New Order',
  };

  constructor(
    private dataService: CollectionDataService<Order>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadList();
  }

  loadList() {
    this.dataService
      .getDataByCollectionId(CollectionNames.Orders)
      .subscribe((res) => {
        this.list = res;
      });
  }

  get deleteConfirm() {
    return `Are you sure you want to delete this ${this.instance.singular}?`;
  }

  edit(cat: ICollectionData<Order>) {
    this.router.navigate(['/admin', this.instance.singular, cat.id]);
  }

  delete(id: number) {
    this.dataService.deleteData(id).subscribe(() => this.loadList());
  }

  onFormSaved(cat: ICollectionData<Order>) {
    this.loadList();
  }
}

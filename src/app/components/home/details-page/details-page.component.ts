import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICollectionData } from '../../../../models/ICollection';
import { Product, Printable, OrderItem } from '../../../../models/schema';
import { CollectionDataService } from '../../../../services/collection.data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckoutFormService } from '../../../../services/CheckoutFormService';
import { OrderService } from '../../../../services/OrderService';
import { FormInput } from '../../../../models/FormInput';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
  imports: [CommonModule, FormsModule, DynamicFormComponent],
})
export class DetailsPageComponent implements OnInit {
  item?: ICollectionData<Product | Printable>;
  loading = true;
  added = false;

  formInputs: FormInput[] = [];
  initialData: any = {};
  formTitle = '';
  submitLabel = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: CollectionDataService<any>,
    private orderService: OrderService,
    private checkoutFormService: CheckoutFormService
  ) {
    orderService.order$.subscribe((order) => {
      console.log('Order updated:', order);
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.getDataById(id).subscribe((res) => {
      this.item = res;
      this.loading = false;
      this.setUpForm();
    });
  }

  setUpForm() {
    if (!this.item) return;
    if (this.isPrintable()) {
      this.formInputs = this.checkoutFormService.getFormInputs(
        'printable',
        this.item.data
      );
      this.formTitle = 'Request a Quote';
      this.submitLabel = 'Get a Quote';
    } else {
      this.formInputs = this.checkoutFormService.getFormInputs(
        'product',
        this.item.data
      );
      this.formTitle = 'Add to Cart';
      this.submitLabel = 'Add to Cart';

      // Manaully remove size option for printing machines
      if (Number(this.item.parent_id) === 2) {
        this.formInputs = this.formInputs.filter(
          (input) => input.key !== 'size'
        );
      }
    }
  }

  handleFormSubmit(formData: any) {
    if (!this.item) return;
    const item: OrderItem = {
      id: this.item?.id || 0,
      name: this.item?.data.name || '',
      qty: formData.qty || 1,
      type: this.item?.collection_id || 'product',
      image: this.item?.data.image || '',
      price: this.item?.data.price || 0,
      notes: formData.notes || '',

      options: [],
    };

    if (this.isPrintable()) {
      item.options?.push({
        name: 'logo',
        value: formData.logo || '',
      });
      item.options?.push({
        name: 'inspiration',
        value: formData.inspiration || '',
      });
      item.options?.push({
        name: 'example',
        value: formData.example || '',
      });
    }
    this.orderService.addItem(item);
  }

  isPrintable() {
    return this.item?.collection_id === 'printable';
  }
  isProduct(): boolean {
    return this.item?.collection_id === 'products';
  }
}

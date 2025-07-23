import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderCustomer, OrderItem } from '../models/schema';

const STORAGE_KEY = 'catOrder';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orderSubject: BehaviorSubject<Order>;
  public order$: Observable<Order>;

  constructor() {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    this.orderSubject = new BehaviorSubject<Order>(
      savedOrder ? JSON.parse(savedOrder) : this.defaultOrder()
    );
    this.order$ = this.orderSubject.asObservable();
  }

  private defaultOrder(): Order {
    return {
      customer: { firstName: '', lastName: '', email: '', phone: '', address: '' },
      items: [],
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
  }

  getOrder(): Order {
    return this.orderSubject.value;
  }

  setCustomer(data: OrderCustomer) {
    const order = this.getOrder();
    order.customer = data;
    this.saveOrder(order);
  }

  addItem(item: OrderItem) {
    const order = this.getOrder();
    order.items.push(item);
    this.saveOrder(order);
  }

  updateItem(index: number, item: OrderItem) {
    const order = this.getOrder();
    order.items[index] = item;
    this.saveOrder(order);
  }

  removeItem(index: number) {
    const order = this.getOrder();
    order.items.splice(index, 1);
    this.saveOrder(order);
  }

  clearItems() {
    const order = this.getOrder();
    order.items = [];
    this.saveOrder(order);
  }

  clearOrder() {
    const newOrder = this.defaultOrder();
    this.saveOrder(newOrder);
  }

  private saveOrder(order: Order) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    this.orderSubject.next({ ...order });
  }
}

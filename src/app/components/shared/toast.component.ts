import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      [@fadeInOut]
      [class]="'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ' + getTypeClass()"
    >
      {{ message }}
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [
    // Add fade animation here if needed
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  visible = false;
  message = '';
  private type: 'success' | 'error' | 'info' = 'info';
  private subscription: Subscription | undefined;
  private timeout: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toast$.subscribe((toast: Toast) => {
      this.show(toast.message, toast.type, toast.duration);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  private show(message: string, type: 'success' | 'error' | 'info', duration = 3000) {
    this.message = message;
    this.type = type;
    this.visible = true;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.visible = false;
    }, duration);
  }

  getTypeClass(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  }
}

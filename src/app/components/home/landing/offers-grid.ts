import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferCardComponent, OfferCardVM } from './offer-card';

@Component({
  selector: 'app-offers-grid',
  standalone: true,
  imports: [CommonModule, OfferCardComponent],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <app-offer-card
        *ngFor="let o of (offers || []); trackBy: trackById"
        [offer]="o"
        [selectedDay]="selectedDay"
        [isWindowOpen]="isWindowOpen"
        (apply)="apply.emit($event)">
      </app-offer-card>
    </div>
  `
})
export class OffersGridComponent {
  @Input() offers: OfferCardVM[] | null = null;
  @Input() selectedDay!: number;
  @Input() isWindowOpen = false;
  @Output() apply = new EventEmitter<number>();
  trackById = (_: number, o: OfferCardVM) => o.id;
}

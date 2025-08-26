import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ICollectionData } from '../../../../models/ICollection';
import { Application } from '../../../../models/schema';
import { BusinessTxService, Ok, Fail } from '../../../../services/business/business-tx.service';

@Component({
  selector: 'app-application-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-2 justify-end">
      <button *ngIf="canVerify" class="btn-indigo" (click)="verify()">Verify</button>
      <button *ngIf="canInitDebiCheck" class="btn-indigo" (click)="initDebiCheck()">Init DebiCheck</button>
      <button *ngIf="canConfirmDebiCheck" class="btn-indigo" (click)="confirmDebiCheck()">Confirm DebiCheck</button>
      <button *ngIf="canApprove" class="btn-green" (click)="approve()">Approve</button>
      <button *ngIf="canDecline" class="btn-red" (click)="decline()">Decline</button>
    </div>
  `,
  styles: [`
    .btn-indigo { @apply inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500; }
    .btn-green  { @apply inline-flex items-center gap-2 rounded-lg bg-green-600  px-4 py-2 text-white hover:bg-green-700  focus:outline-none focus:ring-2 focus:ring-green-500; }
    .btn-red    { @apply inline-flex items-center gap-2 rounded-lg bg-red-600    px-4 py-2 text-white hover:bg-red-700    focus:outline-none focus:ring-2 focus:ring-red-500; }
  `]
})
export class ApplicationActionsComponent {
  @Input({required:true}) app!: ICollectionData<Application>;
  @Output() changed = new EventEmitter<void>();

  constructor(private btx: BusinessTxService) {}

  get canVerify()         { return this.app.data.status === 'SUBMITTED'; }
  get canApprove()        { return this.app.data.status === 'VERIFIED'; }
  get canDecline()        { const s = this.app.data.status; return s === 'SUBMITTED' || s === 'VERIFIED'; }
  get canInitDebiCheck()  { return this.app.data.status === 'APPROVED' && !this.has('INITIATED'); }
  get canConfirmDebiCheck(){ return this.app.data.status === 'APPROVED' && this.has('INITIATED') && !this.has('CONFIRMED'); }

  private has(status: string) {
    // Optionally accept an input of events; otherwise call an endpoint to check.
    // For simplicity this relies on your backend state transitions before showing this bar again.
    return false;
  }

  async verify()         { /* wire when ready */ }
  async decline()        { /* wire when ready */ }

  async approve() {
    const r = await firstValueFrom(this.btx.approveApplication$(this.app)) as Ok|Fail;
    if (r.ok) this.changed.emit();
  }
  async initDebiCheck() {
    const r = await firstValueFrom(this.btx.initDebiCheck$(this.app)) as Ok|Fail;
    if (r.ok) this.changed.emit();
  }
  async confirmDebiCheck() {
    const r = await firstValueFrom(this.btx.confirmDebiCheck$(this.app)) as Ok|Fail;
    if (r.ok) this.changed.emit();
  }
}

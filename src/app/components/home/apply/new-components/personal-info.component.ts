import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../../models/User';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid sm:grid-cols-2 gap-4" [formGroup]="form">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Full name</label>
        <input class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="full_name"
               autocomplete="name" />
        <p *ngIf="form.get('full_name')?.invalid && form.get('full_name')?.touched"
           class="text-xs text-rose-600">
          Full name is required.
        </p>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">ID number</label>
        <input class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="id_number"
               inputmode="numeric"
               maxlength="13"
               [disabled]="lockIdentity" />
        <p *ngIf="form.get('id_number')?.invalid && form.get('id_number')?.touched"
           class="text-xs text-rose-600">
          SA ID must be 13 digits.
        </p>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input type="email"
               class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="email"
               autocomplete="email"
               [disabled]="lockIdentity" />
        <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
           class="text-xs text-rose-600">
          Enter a valid email.
        </p>
      </div>
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Phone</label>
        <input class="mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
               formControlName="phone"
               autocomplete="tel" />
        <p *ngIf="form.get('phone')?.invalid && form.get('phone')?.touched"
           class="text-xs text-rose-600">
          Phone is required.
        </p>
      </div>
    </div>
  `
})
export class PersonalInfoComponent {
  @Input() form!: FormGroup;
  @Input() currentUser?: User;
  @Input() lockIdentity = false;
}

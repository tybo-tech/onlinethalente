import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormInput } from '../../../../models/FormInput';
import { UploadInputComponent } from '../upload-input/upload-input.component';
import { RouterModule } from '@angular/router';
import { CollectionIds } from '../../../../models/ICollection';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UploadInputComponent,
    RouterModule,
  ],
  template: `<div
    class="bg-[var(--cloud)] text-[var(--text-main)] py-10 px-6 rounded shadow-md w-full max-w-2xl mx-auto"
  >
    <h1 class="text-2xl font-bold mb-6 text-[var(--primary)]">
      {{ formTitle }}
    </h1>

    <form *ngIf="form" [formGroup]="form" (ngSubmit)="submit()" class="space-y-6 w-full">
      <ng-container *ngFor="let input of inputs">
        <!-- Text Input -->
        <div
          *ngIf="
            [
              'text',
              'email',
              'password',
              'number',
              'tel',
              'url',
              'search'
            ].includes(input.type)
          "
        >
          <label class="block text-sm font-medium mb-1 text-[var(--text-main)]">
            {{ input.label }} <span *ngIf="input.required">*</span>
          </label>
          <div [class.input-icon-left]="input.icon" [class.input-icon-right]="input.rightIcon || input.unit">
            <div *ngIf="input.icon" class="icon-left">
              <i class="fa {{ input.icon }}"></i>
            </div>
            <input
              [placeholder]="input.placeholder || ''"
              [formControlName]="input.key"
              [type]="input.type"
              [readonly]="input.readonly || false"
              [min]="input.min"
              [max]="input.max"
              [step]="input.step"
              class="w-full"
              [class.border-red-300]="form.get(input.key)?.errors && form.get(input.key)?.touched"
            />
            <div *ngIf="input.rightIcon || input.unit" class="icon-right">
              <i *ngIf="input.rightIcon"
                class="fa {{ input.rightIcon }} cursor-pointer hover:opacity-80"
                (click)="rightIconClicked.emit(input)"
              ></i>
              <span *ngIf="input.unit" class="text-sm font-medium">{{ input.unit }}</span>
            </div>
          </div>
          <!-- Error Messages -->
          <div *ngIf="form.get(input.key)?.errors && form.get(input.key)?.touched" class="mt-1">
            <p *ngFor="let error of getErrorMessages(input)" class="text-xs text-red-600">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Select -->
        <div *ngIf="input.type === 'select'">
          <label class="block text-sm font-medium mb-1 text-[var(--text-main)]">
            {{ input.label }} <span *ngIf="input.required">*</span>
          </label>
          <div [class.input-icon-left]="input.icon" class="relative">
            <div *ngIf="input.icon" class="icon-left">
              <i class="fa {{ input.icon }}"></i>
            </div>
            <select
              [formControlName]="input.key"
              class="w-full appearance-none pr-8"
              [class.border-red-300]="form.get(input.key)?.errors && form.get(input.key)?.touched"
            >
              <option [ngValue]="null" disabled>{{ input.placeholder || 'Select an option' }}</option>
              <option *ngFor="let opt of input.options" [value]="opt.value">
                {{ opt.label }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <i class="fa fa-chevron-down text-gray-500"></i>
            </div>
            <div *ngIf="input.rightIcon" class="icon-right">
              <i class="fa {{ input.rightIcon }}"></i>
            </div>
          </div>
          <!-- Error Messages -->
          <div *ngIf="form.get(input.key)?.errors && form.get(input.key)?.touched" class="mt-1">
            <p *ngFor="let error of getErrorMessages(input)" class="text-xs text-red-600">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Textarea -->
        <div *ngIf="input.type === 'textarea'">
          <label class="block text-sm font-medium mb-1 text-[var(--text-main)]">
            {{ input.label }} <span *ngIf="input.required">*</span>
          </label>
          <div [class.input-icon-left]="input.icon">
            <div *ngIf="input.icon" class="icon-left">
              <i class="fa {{ input.icon }}"></i>
            </div>
            <textarea
              [placeholder]="input.placeholder || ''"
              [formControlName]="input.key"
              rows="4"
              class="w-full"
              [class.border-red-300]="form.get(input.key)?.errors && form.get(input.key)?.touched"
            ></textarea>
          </div>
          <!-- Error Messages -->
          <div *ngIf="form.get(input.key)?.errors && form.get(input.key)?.touched" class="mt-1">
            <p *ngFor="let error of getErrorMessages(input)" class="text-xs text-red-600">
              {{ error }}
            </p>
          </div>
        </div>

        <!-- Image Upload -->
        <div *ngIf="input.type === 'image'">
          <label class="block text-sm font-medium mb-1 text-[var(--text-main)]">
            {{ input.label }} <span *ngIf="input.required">*</span>
          </label>
          <app-upload-input
            [imageKey]="input.key"
            [formGroup]="form"
            [parentItem]="form.value"
            [formControlName]="input.key"
          ></app-upload-input>
        </div>
      </ng-container>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4">
        <button
          *ngIf="cancelLabel"
          type="button"
          (click)="cancel()"
          [ngClass]="submitClass.replace('primary', 'secondary') || 'px-4 py-2 rounded bg-[var(--gray)] text-[var(--text-main)] hover:bg-gray-300 transition'"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="submit"
          [disabled]="!form || form.invalid"
          [ngClass]="submitClass || 'px-4 py-2 rounded bg-[var(--primary)] text-white hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed'"
        >
          {{ submitLabel || 'Save' }}
        </button>
      </div>

      <div *ngIf="redirect?.url && redirect?.label" class="mt-6 text-center">
        <a
          [routerLink]="redirect.url"
          class="text-sm text-[var(--primary)] hover:underline"
        >
          {{ redirect.label }}
        </a>
      </div>
    </form>
  </div> `,
})
export class DynamicFormComponent implements OnChanges {
  @Input() itemCollectionId?: CollectionIds;
  @Input() formTitle = 'Form';
  @Input() submitLabel = 'Save';
  @Input() cancelLabel = '';
  @Input() submitClass = '';
  @Input() inputs: FormInput[] = [];
  @Input() initialData: any = {};
  @Input() redirect = {
    label: '',
    url: '',
  };
  @Output() submitted = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() rightIconClicked = new EventEmitter<FormInput>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize with empty form group to avoid null issues
    this.form = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only regenerate form if inputs or initialData change
    if ((changes['inputs'] && this.inputs) || changes['initialData']) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    if (!this.inputs || this.inputs.length === 0) {
      this.form = this.fb.group({});
      return;
    }

    const group: any = {};
    this.inputs.forEach((input) => {
      if (!input?.key) return;

      const validators = this.buildValidators(input);
      let initialValue = this.initialData?.[input.key] ?? '';

      // Handle specific types
      if (input.type === 'number' && initialValue === '') {
        initialValue = null;
      }

      group[input.key] = [initialValue, validators];
    });

    this.form = this.fb.group(group);
  }

  private buildValidators(input: FormInput): any[] {
    const validators: any[] = [];

    if (input.required) {
      validators.push(Validators.required);
    }

    if (input.validators) {
      input.validators.forEach(validator => {
        switch (validator.name) {
          case 'min':
            validators.push(Validators.min(validator.value));
            break;
          case 'max':
            validators.push(Validators.max(validator.value));
            break;
          case 'minLength':
            validators.push(Validators.minLength(validator.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validator.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validator.value));
            break;
          case 'email':
            validators.push(Validators.email);
            break;
        }
      });
    }

    if (input.pattern) {
      validators.push(Validators.pattern(input.pattern));
    }

    return validators;
  }

  getErrorMessages(input: FormInput): string[] {
    const control = this.form.get(input.key);
    if (!control?.errors || !control.touched) return [];

    const messages: string[] = [];
    const errors = control.errors;

    // First check custom error messages
    if (input.errorMessages) {
      Object.keys(errors).forEach(key => {
        if (input.errorMessages?.[key]) {
          messages.push(input.errorMessages[key]);
          return;
        }
      });
    }

    // If no custom message, use defaults
    if (messages.length === 0) {
      Object.keys(errors).forEach(key => {
        switch (key) {
          case 'required':
            messages.push(`${input.label} is required`);
            break;
          case 'email':
            messages.push('Please enter a valid email address');
            break;
          case 'min':
            messages.push(`Value must be at least ${errors[key].min}`);
            break;
          case 'max':
            messages.push(`Value cannot exceed ${errors[key].max}`);
            break;
          case 'minlength':
            messages.push(`Must be at least ${errors[key].requiredLength} characters`);
            break;
          case 'maxlength':
            messages.push(`Cannot exceed ${errors[key].requiredLength} characters`);
            break;
          case 'pattern':
            messages.push(input.errorMessages?.['pattern'] || 'Invalid format');
            break;
        }
      });
    }

    return messages;
  }

  submit(): void {
    if (!this.form || this.form.invalid) return;
    this.submitted.emit(this.form.value);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}

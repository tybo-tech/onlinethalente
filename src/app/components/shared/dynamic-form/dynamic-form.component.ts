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
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnChanges {
  @Input() itemCollectionId!: CollectionIds;
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

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only regenerate form if inputs or initialData change
    if (changes['inputs'] || changes['initialData']) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    const group: any = {};
    this.inputs.forEach((input) => {
      group[input.key] = [
        this.initialData[input.key] || '',
        input.required ? Validators.required : [],
      ];
    });
    this.form = this.fb.group(group);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitted.emit(this.form.value);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}

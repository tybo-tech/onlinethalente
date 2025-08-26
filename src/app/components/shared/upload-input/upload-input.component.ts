import { Component, forwardRef, Input } from '@angular/core';
import { UploadService } from './UploadService';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-upload-input',
  templateUrl: './upload-input.component.html',
  styleUrls: ['./upload-input.component.scss'],
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadInputComponent),
      multi: true,
    },
    UploadService,
  ],
})
export class UploadInputComponent implements ControlValueAccessor {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) formControlName!: string;
  @Input() imageKey = '';
  @Input() size = '10';
  @Input() parentItem: any = {};
  value = '';
  view = false;
  constructor(private uploadService: UploadService) {}

  onFileChange(files: FileList | null) {
    this.uploadService.onUpload(
      files,
      this.parentItem,
      this.imageKey,
      (url) => {
        if (this.formGroup && this.formControlName) {
          this.formGroup.get(this.formControlName)?.setValue(url);
        }
      }
    );
  }
  closeModal($event: MouseEvent) {
    if ($event.target === document.querySelector('.image-view'))
      this.view = false;
  }

  // Required for ControlValueAccessor
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
    this.parentItem[this.imageKey] = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

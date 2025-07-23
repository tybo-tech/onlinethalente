export interface FormInput {
  key: string; // formControlName
  label: string;
  type: FormInputType;
  required?: boolean;
  readonly?: boolean;
  options?: { label: string; value: any }[]; // for dropdowns
  placeholder?: string;
}

export type FormInputType =
  | 'text'
  | 'image'
  | 'select'
  | 'textarea'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'number'
  | 'email'
  | 'password'
  | 'variation' // custom type for variations
  | 'file'
  | 'url'
  | 'tel'
  | 'search'; // input type

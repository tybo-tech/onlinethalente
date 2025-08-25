export interface FormInput {
  key: string; // formControlName
  label: string;
  type: FormInputType;
  required?: boolean;
  readonly?: boolean;
  options?: { label: string; value: any }[]; // for dropdowns
  placeholder?: string;
  icon?: string; // Font Awesome icon class e.g., 'fa-user'
  rightIcon?: string; // Optional right-side icon
  unit?: string; // Optional unit text to display on the right (like 'ZAR')
  min?: number; // For number inputs
  max?: number; // For number inputs
  step?: number; // For number inputs
  pattern?: string | RegExp; // For validation
  validators?: ValidatorConfig[]; // Custom validators
  errorMessages?: { [key: string]: string }; // Custom error messages
}

export interface ValidatorConfig {
  name: 'required' | 'min' | 'max' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message?: string;
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

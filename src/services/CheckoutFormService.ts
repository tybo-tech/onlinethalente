import { Injectable } from '@angular/core';
import { FormInput } from '../models/FormInput';

@Injectable({ providedIn: 'root' })
export class CheckoutFormService {
  getFormInputs(type: 'product' | 'printable', item?: any): FormInput[] {
    // Shared customer info fields

    if (type === 'product') {
      return [
        {
          key: 'qty',
          label: 'How many would you like?',
          type: 'number',
          required: true,
          placeholder: 'Enter quantity',
        },
        //Size
        {
          key: 'size',
          label: 'Select Size',
          type: 'text',
          placeholder: 'In which size do you want it?',
        },
        {
          key: 'notes',
          label: 'Order Notes (optional)',
          type: 'textarea',
          required: false,
          placeholder: 'Anything special about your order?',
        },
      ];
    }

    if (type === 'printable') {
      const optionFields: FormInput[] = [];

      // Render all options with proper labels and selects/text as needed
      if (item && Array.isArray(item.options)) {
        item.options.forEach((opt: any, i: any) => {
          const [key, value] = Object.entries(opt)[0];
          let label = this.friendlyLabel(key);

          optionFields.push({
            key: key + '_' + i,
            label,
            type: Array.isArray(value) ? 'select' : 'text',
            required: true,
            options: Array.isArray(value)
              ? value.map((v: any) => ({
                  label: this.friendlyLabel(v),
                  value: v,
                }))
              : undefined,
            placeholder: 'Select or enter ' + label,
          });
        });
      }

      return [
        ...optionFields,
        {
          key: 'qty',
          label: 'How many do you want to print?',
          type: 'number',
          required: true,
          placeholder: 'Enter quantity',
        },
        {
          key: 'logo',
          label: 'Upload Your Logo',
          type: 'image',
        },
        {
          key: 'example',
          label: 'Upload Example Design',
          type: 'image',
        },
        {
          key: 'inspiration',
          label: 'Upload Another Picture (Inspiration, Sketch, etc.)',
          type: 'image',
        },
        {
          key: 'notes',
          label: 'Describe What You Want Printed',
          type: 'textarea',
          required: false,
          placeholder: 'Add as many details as you want...',
        },
      ];
    }

    // fallback (should never hit)
    return [];
  }

  get checkOutUserInfoInputs(): FormInput[] {
    const customerFields: FormInput[] = [
      {
        key: 'firstName',
        label: 'Your First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your first name',
      },
      {
        key: 'lastName',
        label: 'Your Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your last name',
      },
      {
        key: 'email',
        label: 'Your Email Address',
        type: 'email',
        required: true,
        placeholder: 'e.g. john@email.com',
      },
      {
        key: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        placeholder: 'e.g. 081 234 5678',
      },
    ];
    return customerFields;
  }
  // Helper to clean up labels
  private friendlyLabel(str: string): string {
    // Convert snake_case or camelCase to Friendly Label
    return str
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }
}

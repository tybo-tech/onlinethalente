import { CollectionIds } from './ICollection';
import { User } from './User';

//models/schema.ts
export interface Product {
  name: string;
  description: string;
  image: string;
  images: string[];
  categories: number[];
  price: number;
  is_quote_only?: boolean;
  _categories?: Category[];
  min_order: number; // Minimum order quantity for this option
  options?: PrintableOption[]; // Optional options for printables
}

export interface Category {
  description?: string | undefined;
  name: string;
  image?: string;
}

export interface Printable {
  name: string;
  description: string;
  image: string;
  images: string[];
  categories: number[];
  price: number;
  options: PrintableOption[]; // Optional options for printables
  is_quote_only?: boolean;
  _categories?: Category[];
  min_order: number; // Minimum order quantity for this option
}

export interface PrintableOption {
  min_order: number; // Minimum order quantity for this option
}

export interface Project {
  image: string;
  name: string;
  description?: string; // Optional description for gallery items
  link?: string; // Optional link for gallery items
}
export interface CTAAction {
  label: string;
  icon: string; // Font Awesome icon class
  href: string; // link/route
  variant?: 'primary' | 'accent'; // For color styling if needed
}
export interface WhyChooseUsItem {
  icon: string; // Font Awesome class, e.g., 'fa-bolt'
  title: string;
  description: string;
}
export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  image?: string; // Avatar image URL or path
  quote: string;
  color?: string; // Background color for the testimonial card
}

// FOOTER

// footer-link.model.ts (optional)
export interface FooterLink {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for footer links
}

export interface FooterContact {
  type: 'email' | 'phone' | 'address';
  value: string;
  icon: string;
}

export interface FooterSocial {
  icon: string; // e.g., 'fa-facebook-f'
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for menu items
}

// Orders

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string; // Optional, you can make it required later
}

export interface OrderItem {
  id: number; // product/printable id
  type: CollectionIds;
  name: string;
  image?: string;
  price?: number; // Only for products (printables are quoted)
  qty: number;
  options?: {
    name: string; // e.g. "Color", "Size"
    value: string; // e.g. "Red", "Large"
  }[]; // Any extra options (printable: color/size/etc)
  uploads?: {
    // For printables with file uploads
    logo?: string;
    example?: string;
    inspiration?: string;
  };
  notes?: string; // Any special notes (printable description)
}

export interface Order {
  customer: OrderCustomer;
  items: OrderItem[];
  createdAt: string;
  status?: string; // e.g. "pending", "submitted", "completed"
}

export interface Variation {
  name: string;
}
export interface VariationOption {
  value: string;
}
export interface VariationOptionGroup {
  name: string;
  options: VariationOption[];
}



export interface Application {
  comment: string;
created_at?: any;
  amount: number;
  type: string; // e.g., '15th', '25th', '30th'
  purpose?: string;
  bankStatement?: string;
  status?: 'pending' | 'approved' | 'rejected';
  _user?: User
}


export interface ISetting {
  type: string;         // Grouping (e.g., 'interest', 'limits', 'loan', 'notifications')
  key: string;          // Unique system key (e.g., 'base_interest_rate')
  label: string;        // Human-friendly label for display
  value: string | number | boolean; // Actual stored value
  input_type: 'number' | 'percent' | 'text' | 'toggle' | 'select'; // Field type
  description?: string; // Optional help text for UI
}

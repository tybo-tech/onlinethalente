import { CompanyProgram } from './company.program.model';
import { IDocument } from './document.model';
import { CollectionNames } from './ICollection';
import { User } from './User';

export interface Company {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  logo?: string;
  industry?: string;
  company_vat?: string;
  statusId?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: string;
  updated_at?: string;
  metadata: ICompanyMetadata;

  // 🆕 Added fields below
  sector?: string;
  suburb?: string;
  city?: string;
  postal_code?: string;
  address_line1?: string;
  bbbee_level?: string;
  bbbee_expiry_date?: string; // ISO string format (e.g. '2025-08-01')
  registration_no?: string;
  turnover_estimated?: number;
  turnover_actual?: number;
  turnover_verified?: boolean;
  permanent_employees?: number;
  temporary_employees?: number;
  description?: string;

  // Relations
  programs?: CompanyProgram[];
  documents?: IDocument[];
  users?: User[];
}

export interface ICompanyMetadata {
  // Bank account details
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  accountType?: string;

  // invoice Theme
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  templateType?: 'classic' | 'modern' | 'minimal';

  comments?: IComment[];
}

export interface IComment {
  id?: number;
  content: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  updated_by?: number;
  company_id?: number;
  user?: User; // Optional relation to User
  document_id?: number; // Optional relation to Document
  program_id?: number; // Optional relation to Program
  metadata?: any; // Additional metadata if needed
  statusId?: number; // Status of the comment (e.g., active, archived)
  isPublic?: boolean; // Whether the comment is public or private
  isResolved?: boolean; // Whether the comment has been resolved
  resolved_at?: string; // Timestamp when the comment was resolved
  resolved_by?: number; // User ID of the person who resolved the comment
}

export function initCompany(name = ''): Company {
  return {
    id: 0,
    name,
    email: '',
    phone: '',
    website: CollectionNames.WebsiteId,
    address: '',
    logo: '',
    industry: '',
    company_vat: '',
    statusId: 1,
    created_by: 0,
    updated_by: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: {
      bankName: '',
      accountNumber: '',
      branchCode: '',
      accountType: 'Current',

      // Invoice Theme
      primaryColor: '#6366F1',
      accentColor: '#23272F',
      textColor: '#23272F',
      templateType: 'modern',
    },
  };
}

export const templateTypes = [
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
];

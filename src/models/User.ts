import { CollectionNames } from './ICollection';

export interface User {
  id: number;
  website_id: CollectionNames;
  company_id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  statusId: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  metadata?: any;

  // New fields
  id_number?: string;
  gender?: string;
  date_of_birth?: string;
  profile_image_url?: string;
  job_title?: string;
  verified_at?: string;
  last_login_at?: string;
  id_document_url?: string;
  is_verified?: number;
  country?: string;
  language_preference?: string;
  notes?: string;
  source?: string;

  // tokens
  token?: string;
  token_expires_at?: string;
}
export type UserRole = 'Client' | 'Admin' | 'Manager' | 'Staff' | 'Developer';
export function initUser(): User {
  return {
    id: 0,
    website_id: CollectionNames.WebsiteId,
    company_id: '',
    name: '',
    email: '',
    password: '',
    role: 'Client',
    phone: '',
    address: '',
    statusId: 1,
    created_by: 0,
    updated_by: 0,
    created_at: '',
    updated_at: '',
    metadata: {},

    // Optional fields
    id_number: '',
    gender: '',
    date_of_birth: '',
    profile_image_url: '',
    job_title: '',
    verified_at: '',
    last_login_at: '',
    id_document_url: '',
    is_verified: 0,
    country: '',
    language_preference: '',
    notes: '',
    source: '',

    // tokens
    token: '',
    token_expires_at: '',
  };
}

export const ROLES: { id: number; name: UserRole }[] = [
  { id: 1, name: 'Client' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Manager' },
  { id: 4, name: 'Staff' },
  { id: 5, name: 'Developer' },
];

export const USER_STATUS = [
  { id: 1, name: 'Active' },
  { id: 2, name: 'Inactive' },
  { id: 3, name: 'Pending' },
  { id: 4, name: 'Blocked' },
];

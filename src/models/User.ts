import { CollectionNames } from './ICollection';

export interface User {
  website_id: CollectionNames;
  id: number;
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
}
export type UserRole = 'Client' | 'Admin' | 'Manager' | 'Staff' | 'Developer';
export function initUser(): User {
  return {
    website_id: CollectionNames.WebsiteId,
    id: 0,
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    created_by: 0,
    statusId: 1,
    updated_by: 0,
    role: 'Client',
    created_at: '',
    updated_at: '',
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

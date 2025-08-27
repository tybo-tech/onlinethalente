
/// models/ICollection.ts
export interface ICollectionData<T = any, J = any> {
  parent_id: number;
  website_id: string;
  id: number;
  collection_id: CollectionIds;
  // e.g., 'products', 'categories', etc.
  data: T; // JSON data (inputs, styles, etc.)
  created_at?: string;
  updated_at?: string;
  selected?: boolean;
  // Used for checkboxes
  children?: ICollectionData<J>[]; // For hierarchical data
}

export function initCollectionData<T, J>(
  type: CollectionIds,
  data: T,
  parent_id: number
): ICollectionData<T, J> {
  return {
    parent_id,
    website_id: CollectionNames.WebsiteId,
    id: 0, // new items start with 0
    collection_id: type,
    data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    selected: false,
    children: [],
  };
}
export type CollectionIds =
  | 'pay_cycles'
  | 'loan_offers'
  | 'applications'
  | 'application_documents'
  | 'debicheck_events'
  | 'payments'
  | 'banking_details';

export enum CollectionNames {
  WebsiteId = 'ONLINETHALENTE', // keep your site key here

  PayCycles = 'pay_cycles',
  LoanOffers = 'loan_offers',
  Applications = 'applications',
  ApplicationDocuments = 'application_documents',
  DebiCheckEvents = 'debicheck_events',
  Payments = 'payments',
  BankingDetails = 'banking_details',
}

export const ALL_COLLECTIONS: CollectionIds[] = [
  'pay_cycles',
  'loan_offers',
  'applications',
  'application_documents',
  'debicheck_events',
  'payments',
  'banking_details',
];


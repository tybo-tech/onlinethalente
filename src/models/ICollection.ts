export interface ICollectionData<T = any, J = any> {
  parent_id: number;
  website_id: string;
  id: number;
  collection_id: CollectionIds; // e.g., 'products', 'categories', etc.
  data: T; // JSON data (inputs, styles, etc.)
  created_at?: string;
  updated_at?: string;
  selected?: boolean; // Used for checkboxes
  children?: ICollectionData<J>[]; // For hierarchical data
}
export type CollectionIds =
  | 'categories'
  | 'products'
  | 'orders'
  | 'settings'
  | 'printable'
  | 'projects'
  | 'variations'
  | 'item-variation'
  | 'item-variation-option'
  | 'variation_options'
  | 'applications'

export enum CollectionNames {
  WebsiteId = 'ONLINETHALENTE',
  Products = 'products',
  Categories = 'categories',
  Orders = 'orders',
  Settings = 'settings',
  Printables = 'printable',
  Projects = 'projects',
  Variations = 'variations',
  VariationOptions = 'variation_options',
  Applications = 'applications',
}


export interface ICollectionLink {
  id: number;
  source_id: number;
  source_collection: CollectionIds;
  target_id: number;
  target_collection: CollectionIds;
  relation_type: string;
  data?: any;
  created_at?: string;
}

import { BaseEntity } from "./base.model";
import { Company } from "./company.model";


// Document interface
export interface IDocument extends BaseEntity {
  company_id: number;
  name: string;
  type?: string;
  url: string;
  metadata?: any; // Or use a more specific type if you know the metadata structure

  // Optional relation
  company?: Company;
}

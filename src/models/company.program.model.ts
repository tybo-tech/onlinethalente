import { BaseEntity } from './base.model';
import { Company } from './company.model';
import { Program } from './program.model';

// CompanyProgram interface (junction table between Company and Program)
export interface CompanyProgram extends BaseEntity {
  company_id: number;
  program_id: number;
  description?: string;
  registration_date?: string;

  // Optional relations (can be populated when joining data)
  company?: Company;
  program?: Program;
}

import { BaseEntity } from "./base.model";

// Program interface
export interface Program extends BaseEntity {
  name: string;
  description?: string;
  start_date?: string | Date;
  end_date?: string | Date;
}

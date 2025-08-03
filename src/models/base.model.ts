export interface BaseEntity {
  id?: number;
  statusId?: number;
  created_by?: number;
  updated_by?: number;
  created_at?: string | Date;
  updated_at?: string | Date;
}

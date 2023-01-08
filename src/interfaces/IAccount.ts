export interface IAccount {
  id?: string;
  shortCode: string;
  classification: string;
  isAnalytical: boolean;
  nature: string;
  level: number;
  description: string;
  superiorId: string;
  created_at?: Date;
  updated_at?: Date;
}

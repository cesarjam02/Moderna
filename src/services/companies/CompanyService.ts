import { Company, CompanyId, CreateCompanyDTO } from '@/types';

export interface CompanyService {
  list(): Promise<Company[]>;
  create(input: CreateCompanyDTO): Promise<Company>;
  getById(id: CompanyId): Promise<Company>;
}
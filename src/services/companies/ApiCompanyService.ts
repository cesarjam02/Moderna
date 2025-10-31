import { http } from '@/services/http';
import { Company, CompanyId, CreateCompanyDTO } from '@/types';
import type { CompanyService } from './CompanyService';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiCompanyService implements CompanyService {
  list(): Promise<Company[]> { return http(`${BASE}/companies`); }
  getById(id: CompanyId): Promise<Company> { return http(`${BASE}/companies/${id}`); }
  create(input: CreateCompanyDTO): Promise<Company> { return http(`${BASE}/companies`, { method: 'POST', body: input }); }
}
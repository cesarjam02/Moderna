import { Company, CompanyId, CreateCompanyDTO } from '@/types';
import type { CompanyService } from './CompanyService';

const mem: Company[] = [
  { id: 'c1', name: 'Fundación Hogar del Ecuador', createdAt: new Date().toISOString(), ruc: '0999999999' }
];

export class MockCompanyService implements CompanyService {
  async list(): Promise<Company[]> { return [...mem]; }
  async getById(id: CompanyId): Promise<Company> {
    const c = mem.find(x => x.id === id);
    if (!c) throw new Error('Company not found');
    return c;
  }
  async create(input: CreateCompanyDTO): Promise<Company> {
    const n: Company = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
    mem.push(n);
    return n;
  }
}
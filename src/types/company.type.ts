export type CompanyId = string;

export interface Company {
  id: CompanyId;
  name: string;
  ruc?: string;
  address?: string;
  createdAt: string;
}

export interface CreateCompanyDTO {
  name: string;
  ruc?: string;
  address?: string;
}
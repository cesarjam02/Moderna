import { ApiUserService } from './users/ApiUserService';
import { MockUserService } from './users/UserService.mock';
import { ApiCompanyService } from './companies/ApiCompanyService';
import { MockCompanyService } from './companies/CompanyService.mock';

const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

export const Services = {
  users: USE_MOCKS ? new MockUserService() : new ApiUserService(),
  companies: USE_MOCKS ? new MockCompanyService() : new ApiCompanyService()
};
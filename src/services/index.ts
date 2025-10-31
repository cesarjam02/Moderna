import { ApiUserService } from './users/ApiUserService';
import { MockUserService } from './users/UserService.mock';
import { ApiCompanyService } from './companies/ApiCompanyService';
import { MockCompanyService } from './companies/CompanyService.mock';
import { ApiAuthService } from './auth/ApiAuthService';
import { MockAuthService } from './auth/AuthService.mock';

const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS ?? 'true') === 'true';

export const Services = {
  users: USE_MOCKS ? new MockUserService() : new ApiUserService(),
  companies: USE_MOCKS ? new MockCompanyService() : new ApiCompanyService(),
  auth: USE_MOCKS ? new MockAuthService() : new ApiAuthService(),
};
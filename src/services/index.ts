import { ENV } from '@/utils/env'; //

// --- Servicios de Autenticación ---
import { ApiAuthService } from './auth/ApiAuthService'; //
import { MockAuthService } from './auth/AuthService.mock'; //

// --- Servicios de Usuarios ---
import { ApiUserService } from './users/ApiUserService'; //
import { MockUserService } from './users/UserService.mock'; //

// --- Servicios de Compañías ---
import { ApiCompanyService } from './companies/ApiCompanyService'; //
import { MockCompanyService } from './companies/CompanyService.mock'; //

// --- (NUEVO) Servicios de Permisos ---
import { ApiPermisoService } from './permisos/ApiPermisoService';
import { MockPermisoService } from './permisos/PermisoService.mock';

// El interruptor mock/real que ya usas
const useMocks = ENV.USE_MOCKS;

export const Services = {
  auth: useMocks ? new MockAuthService() : new ApiAuthService(),
  users: useMocks ? new MockUserService() : new ApiUserService(),
  companies: useMocks ? new MockCompanyService() : new ApiCompanyService(),
  permisos: useMocks ? new MockPermisoService() : new ApiPermisoService(), // <-- Añadir esta línea
};
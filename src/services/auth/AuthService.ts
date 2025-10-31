import { AuthResponse, LoginDTO } from '@/types';

export interface AuthService {
  login(credentials: LoginDTO): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthResponse | null>;
}


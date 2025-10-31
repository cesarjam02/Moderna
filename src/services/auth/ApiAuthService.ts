import { http } from '@/services/http';
import { AuthResponse, LoginDTO } from '@/types';
import type { AuthService } from './AuthService';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiAuthService implements AuthService {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await http<AuthResponse>(`${BASE}/auth/login`, {
      method: 'POST',
      body: credentials,
    });

    // Guardar token y usuario en localStorage
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));

    return response;
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await http(`${BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      const user = await http<AuthResponse['user']>(`${BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { user, token };
    } catch {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return null;
    }
  }
}


import { AuthResponse, LoginDTO, User } from '@/types';
import type { AuthService } from './AuthService';

// Usuarios de prueba con contraseñas (en producción esto estaría en una base de datos)
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'u1',
    name: 'Ana',
    email: 'ana@example.com',
    password: 'admin123',
    role: 'admin',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Carlos',
    email: 'carlos@example.com',
    password: 'manager123',
    role: 'manager',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'María',
    email: 'maria@example.com',
    password: 'user123',
    role: 'user',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export class MockAuthService implements AuthService {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password && u.active
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}-${Date.now()}`;

    // Guardar en localStorage para simular sesión
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async getCurrentUser(): Promise<AuthResponse | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');

    if (!token || !userStr) {
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      return { user, token };
    } catch {
      return null;
    }
  }
}


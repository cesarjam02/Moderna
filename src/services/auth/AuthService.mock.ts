import { AuthResponse, LoginDTO, User, UserRole } from '@/types';
import type { AuthService } from './AuthService';

// NOTE: Updated users with all required roles for testing
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: 'u1', name: 'Ana (Admin)', email: 'ana@example.com',
    password: 'admin123', role: 'admin', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u2', name: 'Jorge (Solicitante)', email: 'jorge@example.com',
    password: 'user123', role: 'SOLICITANTE', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u3', name: 'Wilson (HSEQ)', email: 'wilson@example.com',
    password: 'user123', role: 'APROBADOR_HSEQ', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u4', name: 'Nelson (Área)', email: 'nelson@example.com',
    password: 'user123', role: 'APROBADOR_AREA', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u5', name: 'Doctora Ana', email: 'medica@example.com',
    password: 'user123', role: 'DOCTORA', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u6', name: 'Inspector Luis', email: 'inspector@example.com',
    password: 'user123', role: 'INSPECTOR', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u7', name: 'Líder Producción', email: 'lider@example.com',
    password: 'user123', role: 'LIDER', active: true, createdAt: new Date().toISOString(),
  },
  {
    id: 'u8', name: 'Maria (Trabajador)', email: 'maria@example.com',
    password: 'user123', role: 'TRABAJADOR', active: true, createdAt: new Date().toISOString(),
  }
];

export class MockAuthService implements AuthService {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password && u.active
    );

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const { password, ...userWithoutPassword } = user;
    const token = `mock-token-${user.id}-${Date.now()}`;

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
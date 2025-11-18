import { AuthResponse, LoginDTO } from '@/types';
import type { AuthService } from './AuthService';
import { MockUsersStorage } from '../mock-storage/users.mock';

export class MockAuthService implements AuthService {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Normalizar email
    const normalizedEmail = credentials.email.trim().toLowerCase();

    // Debug: mostrar todos los usuarios disponibles
    const allUsers = MockUsersStorage.getAll();
    console.log('Intentando login con email:', normalizedEmail);
    console.log('Usuarios en almacenamiento:', allUsers.map(u => ({ email: u.email, name: u.name })));

    // Buscar usuario en el almacenamiento compartido
    const user = MockUsersStorage.findByEmail(normalizedEmail);

    if (!user) {
      console.error('Usuario no encontrado:', normalizedEmail);
      console.error('Usuarios disponibles:', allUsers.map(u => u.email));
      throw new Error('Credenciales inválidas');
    }

    // Comparar contraseñas (sin espacios en blanco al inicio/final)
    const storedPassword = user.password;
    const providedPassword = credentials.password;
    
    if (storedPassword !== providedPassword) {
      console.error('Contraseña incorrecta para:', normalizedEmail);
      console.error('Contraseña almacenada:', storedPassword, 'Longitud:', storedPassword.length);
      console.error('Contraseña proporcionada:', providedPassword, 'Longitud:', providedPassword.length);
      throw new Error('Credenciales inválidas');
    }

    if (!user.active) {
      throw new Error('Usuario inactivo');
    }

    const { password, ...userWithoutPassword } = user;
    // Asegurar que siempre tenga roles inicializados
    const userWithRoles = {
      ...userWithoutPassword,
      roles: user.roles && user.roles.length > 0 ? user.roles : [user.role],
    };
    const token = `mock-token-${user.id}-${Date.now()}`;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(userWithRoles));

    return {
      user: userWithRoles,
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
      // Asegurar que siempre tenga roles inicializados
      const userWithRoles = {
        ...user,
        roles: user.roles && user.roles.length > 0 ? user.roles : [user.role],
      };
      return { user: userWithRoles, token };
    } catch {
      return null;
    }
  }
}
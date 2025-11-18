import { User } from '@/types';

/**
 * Almacenamiento compartido de usuarios con contraseñas para los servicios mock.
 * Este almacenamiento es compartido entre MockAuthService y MockUserService
 * para que los usuarios creados puedan hacer login.
 */
export interface UserWithPassword extends User {
  password: string;
}

// Usuarios iniciales predefinidos
const initialUsers: UserWithPassword[] = [
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
    name: 'Jorge',
    email: 'jorge@example.com',
    password: 'user123',
    role: 'SOLICITANTE',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Wilson',
    email: 'wilson@example.com',
    password: 'user123',
    role: 'APROBADOR_HSEQ',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Nelson',
    email: 'nelson@example.com',
    password: 'user123',
    role: 'APROBADOR_AREA',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u5',
    name: 'Ana',
    email: 'medica@example.com',
    password: 'user123',
    role: 'DOCTORA',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u6',
    name: 'Luis',
    email: 'inspector@example.com',
    password: 'user123',
    role: 'INSPECTOR',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u7',
    name: 'Oswaldo',
    email: 'lider@example.com',
    password: 'user123',
    role: 'LIDER',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u8',
    name: 'Maria',
    email: 'maria@example.com',
    password: 'user123',
    role: 'TRABAJADOR',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

// Almacenamiento en memoria compartido
let usersWithPasswords: UserWithPassword[] = [...initialUsers];

export const MockUsersStorage = {
  /**
   * Obtiene todos los usuarios con contraseñas
   */
  getAll(): UserWithPassword[] {
    return [...usersWithPasswords];
  },

  /**
   * Busca un usuario por email (case-insensitive)
   */
  findByEmail(email: string): UserWithPassword | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    return usersWithPasswords.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  },

  /**
   * Busca un usuario por ID
   */
  findById(id: string): UserWithPassword | undefined {
    return usersWithPasswords.find((u) => u.id === id);
  },

  /**
   * Agrega un nuevo usuario con contraseña
   */
  add(user: UserWithPassword): void {
    // Asegurarse de que el email esté normalizado
    const normalizedUser = {
      ...user,
      email: user.email.trim().toLowerCase(),
    };
    usersWithPasswords.push(normalizedUser);
    console.log('Usuario agregado al almacenamiento:', normalizedUser.email, 'Total usuarios:', usersWithPasswords.length);
  },

  /**
   * Actualiza un usuario existente
   */
  update(id: string, updates: Partial<UserWithPassword>): void {
    const index = usersWithPasswords.findIndex((u) => u.id === id);
    if (index !== -1) {
      usersWithPasswords[index] = { ...usersWithPasswords[index], ...updates };
    }
  },

  /**
   * Elimina un usuario
   */
  remove(id: string): boolean {
    const prevLength = usersWithPasswords.length;
    usersWithPasswords = usersWithPasswords.filter((u) => u.id !== id);
    return usersWithPasswords.length < prevLength;
  },

  /**
   * Obtiene solo los usuarios (sin contraseñas) para compatibilidad
   */
  getUsers(): User[] {
    return usersWithPasswords.map(({ password, ...user }) => user);
  },

  /**
   * Resetea el almacenamiento a los usuarios iniciales (útil para testing)
   */
  reset(): void {
    usersWithPasswords = [...initialUsers];
  },
};


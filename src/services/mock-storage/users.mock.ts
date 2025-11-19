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
    roles: ['admin', 'SOLICITANTE'], // Admin puede actuar como SOLICITANTE
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    name: 'Jorge',
    email: 'jorge@example.com',
    password: 'user123',
    role: 'SOLICITANTE',
    roles: ['SOLICITANTE'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    name: 'Wilson',
    email: 'wilson@example.com',
    password: 'user123',
    role: 'APROBADOR_HSEQ',
    roles: ['APROBADOR_HSEQ'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u4',
    name: 'Nelson',
    email: 'nelson@example.com',
    password: 'user123',
    role: 'APROBADOR_AREA',
    roles: ['APROBADOR_AREA'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u5',
    name: 'Ana',
    email: 'medica@example.com',
    password: 'user123',
    role: 'DOCTORA',
    roles: ['DOCTORA'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u6',
    name: 'Luis',
    email: 'inspector@example.com',
    password: 'user123',
    role: 'INSPECTOR',
    roles: ['INSPECTOR'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u7',
    name: 'Oswaldo',
    email: 'lider@example.com',
    password: 'user123',
    role: 'LIDER',
    roles: ['LIDER'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u8',
    name: 'Maria',
    email: 'maria@example.com',
    password: 'user123',
    role: 'TRABAJADOR',
    roles: ['TRABAJADOR'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w1', // Debe coincidir con el ID en personnel.mock.ts para consistencia
    name: 'Carlos Alberto Andrade Ruiz',
    email: 'carlos.andrade@moderna.com.ec',
    password: 'user123',
    role: 'TRABAJADOR',
    roles: ['TRABAJADOR'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w2',
    name: 'Maria Fernanda Lopez Torres',
    email: 'maria.lopez@moderna.com.ec',
    password: 'user123',
    role: 'TRABAJADOR',
    roles: ['TRABAJADOR'],
    active: true,
    createdAt: new Date().toISOString(),
  },

  // 2 EXTERNOS
  {
    id: 'w6',
    name: 'Pedro Jose Ramirez Silva',
    email: 'pedro.ramirez@externo.com',
    password: 'user123',
    role: 'TRABAJADOR',
    roles: ['TRABAJADOR'],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'w7',
    name: 'Ana Gabriela Suarez Pinto',
    email: 'ana.suarez@externo.com',
    password: 'user123',
    role: 'TRABAJADOR',
    roles: ['TRABAJADOR'],
    active: true,
    createdAt: new Date().toISOString(),
  }
];

let usersWithPasswords: UserWithPassword[] = [...initialUsers];

export const MockUsersStorage = {
  getAll(): UserWithPassword[] { return [...usersWithPasswords]; },
  findByEmail(email: string): UserWithPassword | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    return usersWithPasswords.find((u) => u.email.trim().toLowerCase() === normalizedEmail);
  },
  findById(id: string): UserWithPassword | undefined {
    return usersWithPasswords.find((u) => u.id === id);
  },
  add(user: UserWithPassword): void {
    usersWithPasswords.push({ ...user, email: user.email.trim().toLowerCase() });
  },
  update(id: string, updates: Partial<UserWithPassword>): void {
    const index = usersWithPasswords.findIndex((u) => u.id === id);
    if (index !== -1) {
      const updated = { ...usersWithPasswords[index], ...updates };
      if (!updated.roles || updated.roles.length === 0) updated.roles = [updated.role];
      usersWithPasswords[index] = updated;
    }
  },
  remove(id: string): boolean {
    const prevLength = usersWithPasswords.length;
    usersWithPasswords = usersWithPasswords.filter((u) => u.id !== id);
    return usersWithPasswords.length < prevLength;
  },
  getUsers(): User[] {
    return usersWithPasswords.map(({ password, ...user }) => ({
      ...user,
      roles: user.roles || [user.role],
    }));
  },
  reset(): void { usersWithPasswords = [...initialUsers]; },
};

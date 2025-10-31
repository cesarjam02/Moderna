/** Tipo de datos para Usuario */
export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  active: boolean;
  createdAt: string; // ISO date
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: User['role'];
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: User['role'];
  active?: boolean;
}
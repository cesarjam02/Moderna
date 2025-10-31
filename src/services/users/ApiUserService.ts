import { http } from '@/services/http';
import { CreateUserDTO, UpdateUserDTO, User, UserId } from '@/types';
import type { UserService } from './UserService';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiUserService implements UserService {
  async list(): Promise<User[]> {
    return http<User[]>(`${BASE}/users`);
  }
  async getById(id: UserId): Promise<User> {
    return http<User>(`${BASE}/users/${id}`);
  }
  async create(input: CreateUserDTO): Promise<User> {
    return http<User>(`${BASE}/users`, { method: 'POST', body: input });
  }
  async update(id: UserId, input: UpdateUserDTO): Promise<User> {
    return http<User>(`${BASE}/users/${id}`, { method: 'PUT', body: input });
  }
  async remove(id: UserId): Promise<{ success: boolean }> {
    return http<{ success: boolean }>(`${BASE}/users/${id}`, { method: 'DELETE' });
  }
}
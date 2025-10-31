import { CreateUserDTO, UpdateUserDTO, User, UserId } from '@/types';
import type { UserService } from './UserService';

let mem: User[] = [
  { id: 'u1', name: 'Ana', email: 'ana@example.com', role: 'admin', active: true, createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Carlos', email: 'carlos@example.com', role: 'manager', active: true, createdAt: new Date().toISOString() }
];

export class MockUserService implements UserService {
  async list(): Promise<User[]> { return [...mem]; }
  async getById(id: UserId): Promise<User> {
    const u = mem.find(x => x.id === id);
    if (!u) throw new Error('User not found');
    return u;
  }
  async create(input: CreateUserDTO): Promise<User> {
    const n: User = { id: crypto.randomUUID(), active: true, createdAt: new Date().toISOString(), role: input.role ?? 'user', ...input };
    mem.push(n);
    return n;
  }
  async update(id: UserId, input: UpdateUserDTO): Promise<User> {
    const i = mem.findIndex(x => x.id === id);
    if (i === -1) throw new Error('User not found');
    mem[i] = { ...mem[i], ...input };
    return mem[i];
  }
  async remove(id: UserId): Promise<{ success: boolean }> {
    const prev = mem.length;
    mem = mem.filter(x => x.id !== id);
    return { success: mem.length < prev };
  }
}
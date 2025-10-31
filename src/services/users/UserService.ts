import { CreateUserDTO, UpdateUserDTO, User, UserId } from '@/types';

export interface UserService {
  list(): Promise<User[]>;
  getById(id: UserId): Promise<User>;
  create(input: CreateUserDTO): Promise<User>;
  update(id: UserId, input: UpdateUserDTO): Promise<User>;
  remove(id: UserId): Promise<{ success: boolean }>;  
}
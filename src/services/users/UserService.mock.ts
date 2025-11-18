import { CreateUserDTO, UpdateUserDTO, User, UserId } from '@/types';
import type { UserService } from './UserService';
import { MockUsersStorage } from '../mock-storage/users.mock';

export class MockUserService implements UserService {
  async list(): Promise<User[]> {
    return MockUsersStorage.getUsers();
  }

  async getById(id: UserId): Promise<User> {
    const user = MockUsersStorage.findById(id);
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(input: CreateUserDTO): Promise<User> {
    // Normalizar email (trim y lowercase)
    const normalizedEmail = input.email.trim().toLowerCase();
    
    // Verificar si el email ya existe
    const existingUser = MockUsersStorage.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }

    // Crear nuevo usuario con contraseña
    const newUser = {
      id: crypto.randomUUID(),
      active: true,
      createdAt: new Date().toISOString(),
      role: input.role,
      name: input.name.trim(),
      email: normalizedEmail,
      password: input.password, // Guardar la contraseña para que pueda hacer login
    };

    // Agregar al almacenamiento compartido
    MockUsersStorage.add(newUser);

    // Devolver sin la contraseña
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(id: UserId, input: UpdateUserDTO): Promise<User> {
    const existingUser = MockUsersStorage.findById(id);
    if (!existingUser) throw new Error('User not found');

    // Actualizar en el almacenamiento compartido
    MockUsersStorage.update(id, input);

    // Obtener el usuario actualizado
    const updatedUser = MockUsersStorage.findById(id)!;
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: UserId): Promise<{ success: boolean }> {
    const success = MockUsersStorage.remove(id);
    return { success };
  }
}
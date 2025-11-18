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
    // Asegurar que siempre tenga roles
    return {
      ...userWithoutPassword,
      roles: userWithoutPassword.roles || [userWithoutPassword.role],
    };
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
      roles: input.roles || [input.role], // Usar roles proporcionados o solo el rol principal
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
    // Asegurar que siempre tenga roles
    const userWithRoles = {
      ...userWithoutPassword,
      roles: userWithoutPassword.roles || [userWithoutPassword.role],
    };
    
    // Si el usuario actualizado es el que está logueado, actualizar localStorage
    const currentUserStr = localStorage.getItem('auth_user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === id) {
          localStorage.setItem('auth_user', JSON.stringify(userWithRoles));
          // Disparar evento para que el AuthContext se actualice
          window.dispatchEvent(new CustomEvent('user-updated'));
        }
      } catch (e) {
        // Ignorar errores al actualizar localStorage
      }
    }
    
    return userWithRoles;
  }

  async remove(id: UserId): Promise<{ success: boolean }> {
    const success = MockUsersStorage.remove(id);
    return { success };
  }
}
/** Tipo de datos para Usuario */
export type UserId = string;

/** * Roles de usuario actualizados para incluir los roles del sistema 
 * y los roles de aprobación de permisos. 
 * (Requerimientos #7, #9, #11)
 */
export type UserRole = 
  // Roles de Sistema
  | 'admin'
  | 'manager'
  | 'user'
  
  // Roles del Flujo de Permisos
  | 'SOLICITANTE'
  | 'TRABAJADOR'
  | 'APROBADOR_HSEQ'
  | 'APROBADOR_AREA'
  | 'DOCTORA'
  | 'INSPECTOR'
  
  // Roles de Vistas
  | 'LIDER'; // Para ver estadísticas

export interface User {
  id: UserId;
  name: string;
  email: string;
  role: UserRole; // Rol principal (para compatibilidad)
  roles: UserRole[]; // Múltiples roles permitidos
  active: boolean;
  createdAt: string; // ISO date
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole; // Rol principal (para compatibilidad)
  roles?: UserRole[]; // Roles adicionales
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole; // Rol principal (para compatibilidad)
  roles?: UserRole[]; // Roles adicionales
  active?: boolean;
}
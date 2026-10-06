export type UserRole = 'ADMIN' | 'EMPLEADO';

export interface AppUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  status: 'activo' | 'inactivo';
  createdAt: string;
}

export interface AuthSession {
  user: AppUser;
  loginAt: string;
}

export type PermissionKey =
  | 'access_all_tabs'
  | 'manage_cash'
  | 'manage_reports'
  | 'manage_settings'
  | 'manage_users'
  | 'delete_products'
  | 'delete_services'
  | 'modify_prices';

import { UserRole, PermissionKey } from './types';
import { NavTab } from '../components/Sidebar';

// Tab access mapping
export const ROLE_ALLOWED_TABS: Record<UserRole, NavTab[]> = {
  ADMIN: [
    'dashboard',
    'washes',
    'turnos',
    'vehicles',
    'clients',
    'lube',
    'services',
    'products',
    'cash',
    'reports',
    'settings',
  ],
  EMPLEADO: [
    'dashboard',
    'washes',
    'turnos',
    'vehicles',
    'clients',
    'lube',
  ],
};

export function canAccessTab(role: UserRole | null | undefined, tab: NavTab): boolean {
  if (!role) return false;
  return ROLE_ALLOWED_TABS[role]?.includes(tab) ?? false;
}

export function hasPermission(role: UserRole | null | undefined, permission: PermissionKey): boolean {
  if (!role) return false;
  if (role === 'ADMIN') return true;
  return false;
}

export function getRoleBadge(role: UserRole) {
  if (role === 'ADMIN') {
    return {
      label: 'Administrador',
      code: 'ADMIN',
      badgeClass: 'bg-[#A80F15]/20 border border-[#D71920]/40 text-[#F5F5F5]',
      dotClass: 'bg-[#D71920]',
    };
  }
  return {
    label: 'Empleado',
    code: 'EMPLEADO',
    badgeClass: 'bg-[#1E2022] border border-[#3A3D40] text-[#929497]',
    dotClass: 'bg-[#929497]',
  };
}

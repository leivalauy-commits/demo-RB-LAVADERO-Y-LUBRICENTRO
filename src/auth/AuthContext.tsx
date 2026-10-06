import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, AuthSession, UserRole } from './types';

const INITIAL_USERS: AppUser[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'ADMIN',
    status: 'activo',
    createdAt: '2026-10-01',
  },
  {
    id: 'usr_empleado',
    username: 'empleado',
    password: 'empleado123',
    name: 'Empleado',
    role: 'EMPLEADO',
    status: 'activo',
    createdAt: '2026-10-01',
  },
];

const STORAGE_KEY_USERS = 'rb_users_v1';
const STORAGE_KEY_SESSION = 'rb_auth_session_v1';

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}`, e);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage key ${key}`, e);
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Error removing localStorage key ${key}`, e);
  }
}

interface AuthContextType {
  currentUser: AppUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  users: AppUser[];
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  addUser: (userData: Omit<AppUser, 'id' | 'createdAt'>) => void;
  updateUser: (userData: AppUser) => void;
  toggleUserStatus: (id: string) => void;
  deleteUser: (id: string) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(() => safeGetItem(STORAGE_KEY_USERS, INITIAL_USERS));
  const [session, setSession] = useState<AuthSession | null>(() => safeGetItem<AuthSession | null>(STORAGE_KEY_SESSION, null));

  // Sync users to storage
  useEffect(() => {
    safeSetItem(STORAGE_KEY_USERS, users);
  }, [users]);

  // Sync session to storage
  useEffect(() => {
    if (session) {
      safeSetItem(STORAGE_KEY_SESSION, session);
    } else {
      safeRemoveItem(STORAGE_KEY_SESSION);
    }
  }, [session]);

  const login = (usernameInput: string, passwordInput: string): { success: boolean; error?: string } => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    const matchedUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === cleanPassword
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'Usuario o contraseña incorrectos.',
      };
    }

    if (matchedUser.status === 'inactivo') {
      return {
        success: false,
        error: 'El usuario se encuentra inactivo. Comuníquese con el administrador.',
      };
    }

    const newSession: AuthSession = {
      user: {
        id: matchedUser.id,
        username: matchedUser.username,
        name: matchedUser.name,
        role: matchedUser.role,
        status: matchedUser.status,
        createdAt: matchedUser.createdAt,
      },
      loginAt: new Date().toISOString(),
    };

    setSession(newSession);
    return { success: true };
  };

  const logout = () => {
    setSession(null);
    safeRemoveItem(STORAGE_KEY_SESSION);
  };

  const addUser = (userData: Omit<AppUser, 'id' | 'createdAt'>) => {
    const newUser: AppUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (updated: AppUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    // If current session user was updated, update session too
    if (session && session.user.id === updated.id) {
      setSession({
        ...session,
        user: {
          id: updated.id,
          username: updated.username,
          name: updated.name,
          role: updated.role,
          status: updated.status,
          createdAt: updated.createdAt,
        },
      });
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === 'activo' ? 'inactivo' : 'activo';
        return { ...u, status: newStatus };
      })
    );
  };

  const deleteUser = (id: string): { success: boolean; error?: string } => {
    const userToDelete = users.find((u) => u.id === id);
    if (!userToDelete) return { success: false, error: 'Usuario no encontrado.' };

    if (userToDelete.role === 'ADMIN') {
      const remainingAdmins = users.filter((u) => u.role === 'ADMIN' && u.id !== id);
      if (remainingAdmins.length === 0) {
        return { success: false, error: 'No se puede eliminar el único administrador del sistema.' };
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
    return { success: true };
  };

  const currentUser = session ? session.user : null;
  const isAuthenticated = !!currentUser;
  const role = currentUser ? currentUser.role : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        session,
        isAuthenticated,
        role,
        users,
        login,
        logout,
        addUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

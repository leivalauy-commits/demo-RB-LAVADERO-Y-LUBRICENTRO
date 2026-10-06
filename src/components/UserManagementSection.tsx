import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { AppUser, UserRole } from '../auth/types';
import { Users, Plus, Edit2, Shield, CheckCircle2, XCircle, X } from 'lucide-react';

export const UserManagementSection: React.FC = () => {
  const { users, addUser, updateUser, toggleUserStatus, currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('EMPLEADO');
  const [formStatus, setFormStatus] = useState<'activo' | 'inactivo'>('activo');
  const [formError, setFormError] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('EMPLEADO');
    setFormStatus('activo');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AppUser) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormUsername(user.username);
    setFormPassword(user.password || '');
    setFormRole(user.role);
    setFormStatus(user.status);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanUsername = formUsername.trim().toLowerCase();
    if (!cleanUsername || !formName.trim()) {
      setFormError('Por favor complete nombre y usuario.');
      return;
    }

    // Check duplicate username if new or changed
    const duplicate = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.id !== editingUser?.id
    );
    if (duplicate) {
      setFormError('El nombre de usuario ya se encuentra registrado.');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formName.trim(),
        username: cleanUsername,
        password: formPassword.trim() || editingUser.password,
        role: formRole,
        status: formStatus,
      });
    } else {
      if (!formPassword.trim()) {
        setFormError('Por favor asigne una contraseña al nuevo usuario.');
        return;
      }
      addUser({
        name: formName.trim(),
        username: cleanUsername,
        password: formPassword.trim(),
        role: formRole,
        status: formStatus,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div
      style={{ backgroundColor: '#151617', borderColor: '#252627' }}
      className="rounded-xl border p-5 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <Users style={{ color: '#D71920' }} className="h-4 w-4" />
            <span>USUARIOS DEL SISTEMA</span>
          </h2>
          <p className="text-xs text-[#929497]">
            Gestión interna de cuentas de acceso y asignación de roles
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          style={{ backgroundColor: '#D71920' }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#E02027]"
        >
          <Plus className="h-4 w-4" />
          <span>+ NUEVO USUARIO</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg border border-[#252627]">
        <table className="w-full text-left text-xs">
          <thead>
            <tr style={{ backgroundColor: '#101112' }} className="border-b border-[#252627] text-[#929497]">
              <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Nombre</th>
              <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Usuario</th>
              <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Rol</th>
              <th className="py-2.5 px-3 font-semibold uppercase tracking-wider text-[11px]">Estado</th>
              <th className="py-2.5 px-3 text-right font-semibold uppercase tracking-wider text-[11px]">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#252627]">
            {users.map((u) => {
              const isCurrent = currentUser?.id === u.id;
              return (
                <tr key={u.id} className="hover:bg-[#1A1B1D] transition">
                  <td className="py-3 px-3 font-medium text-[#F5F5F5]">
                    <div className="flex items-center gap-2">
                      <span>{u.name}</span>
                      {isCurrent && (
                        <span className="rounded bg-[#252627] px-1.5 py-0.5 text-[9px] font-bold text-[#929497]">
                          TÚ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#929497]">{u.username}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-bold ${
                        u.role === 'ADMIN'
                          ? 'bg-[#A80F15]/20 text-[#F5F5F5] border border-[#D71920]/30'
                          : 'bg-[#1E2022] text-[#929497] border border-[#3A3D40]'
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        u.status === 'activo' ? 'text-emerald-400' : 'text-[#66686A]'
                      }`}
                    >
                      {u.status === 'activo' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="rounded p-1 text-[#929497] hover:text-[#F5F5F5] hover:bg-[#252627] transition"
                        title="Editar usuario"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() => toggleUserStatus(u.id)}
                        className={`rounded px-2 py-1 text-[10px] font-bold transition ${
                          u.status === 'activo'
                            ? 'text-[#929497] hover:text-white hover:bg-[#252627]'
                            : 'text-emerald-400 hover:bg-emerald-950/40'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        {u.status === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: New / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#252627] pb-3 mb-4">
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-[#F5F5F5]">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-[#929497] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-[#A80F15]/20 border border-[#D71920]/40 p-2.5 text-xs text-[#F5F5F5]">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#929497] mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Martín Rodríguez"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#929497] mb-1">
                  Usuario (identificador)
                </label>
                <input
                  type="text"
                  required
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="Ej: martin"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="w-full rounded-lg border px-3 py-2 text-xs font-mono text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#929497] mb-1">
                  Contraseña {editingUser && '(dejar en blanco para conservar actual)'}
                </label>
                <input
                  type="text"
                  required={!editingUser}
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? '••••••••' : 'Contraseña de acceso'}
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="w-full rounded-lg border px-3 py-2 text-xs font-mono text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#929497] mb-1">
                    Rol
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                    className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
                  >
                    <option value="EMPLEADO">EMPLEADO</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#929497] mb-1">
                    Estado
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'activo' | 'inactivo')}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                    className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#252627]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ backgroundColor: '#101112', borderColor: '#252627' }}
                  className="rounded-lg border px-3.5 py-2 text-xs font-semibold text-[#929497] hover:text-[#F5F5F5]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#D71920' }}
                  className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#E02027]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor complete usuario y contraseña.');
      return;
    }

    setLoading(true);
    const result = login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Credenciales inválidas.');
    }
  };

  const fillDemo = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div
      style={{ backgroundColor: '#0B0B0C', color: '#F5F5F5' }}
      className="min-h-screen w-screen flex flex-col justify-between items-center p-4 sm:p-6"
    >
      {/* Top subtle bar / spacer */}
      <div className="w-full max-w-md pt-4" />

      {/* Main Login Card */}
      <div className="w-full max-w-sm">
        {/* Brand identity */}
        <div className="text-center mb-8">
          <div
            style={{ backgroundColor: '#D71920' }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl font-black text-white shadow-lg shadow-[#D71920]/25"
          >
            <span className="text-2xl tracking-tighter">RB</span>
          </div>

          <h1 className="text-base font-extrabold uppercase tracking-tight text-[#F5F5F5]">
            R.B. LAVADERO &amp; LUBRICENTRO
          </h1>
          <p style={{ color: '#929497' }} className="text-xs font-semibold tracking-wider uppercase mt-1">
            Gestión interna
          </p>
        </div>

        {/* Form Container */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-2xl border p-6 sm:p-7 shadow-2xl"
        >
          {error && (
            <div
              style={{ backgroundColor: '#A80F15]/15', borderColor: '#D71920' }}
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-[#D71920]/40 bg-[#1F1213] p-3 text-xs text-[#F5F5F5]"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-[#D71920] mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#929497] mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#929497]" />
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin o empleado"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-xs text-[#F5F5F5] placeholder-[#55575A] transition focus:border-[#D71920] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#929497] mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#929497]" />
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="w-full rounded-lg border py-2.5 pl-9 pr-3 text-xs text-[#F5F5F5] placeholder-[#55575A] transition focus:border-[#D71920] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#D71920' }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#E02027] active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Accediendo...' : 'INICIAR SESIÓN'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Subtext */}
          <div className="mt-6 pt-5 border-t border-[#252627] text-center">
            <p className="text-[11px] text-[#929497] flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#929497]" />
              <span>Acceso exclusivo para personal autorizado</span>
            </p>
          </div>
        </div>

        {/* Demo Credentials Helper Pill Cards */}
        <div className="mt-6">
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-[#929497] mb-2.5">
            Usuarios de Demostración
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemo('admin', 'admin123')}
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="group rounded-xl border p-2.5 text-left transition hover:border-[#D71920]/60 hover:bg-[#1A1B1D]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F5F5F5] text-xs">ADMIN</span>
                <span className="text-[9px] font-semibold text-[#D71920]">Usar</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-[#929497]">admin</div>
              <div className="font-mono text-[10px] text-[#55575A]">admin123</div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo('empleado', 'empleado123')}
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="group rounded-xl border p-2.5 text-left transition hover:border-[#3A3D40] hover:bg-[#1A1B1D]"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F5F5F5] text-xs">EMPLEADO</span>
                <span className="text-[9px] font-semibold text-[#929497]">Usar</span>
              </div>
              <div className="mt-1 font-mono text-[11px] text-[#929497]">empleado</div>
              <div className="font-mono text-[10px] text-[#55575A]">empleado123</div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-[11px] text-[#55575A]">
        R.B. Lavadero &amp; Lubricentro · Sistema de Gestión
      </footer>
    </div>
  );
};

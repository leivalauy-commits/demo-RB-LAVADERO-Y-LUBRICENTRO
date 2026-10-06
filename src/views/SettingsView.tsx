import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Download, Check, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { UserManagementSection } from '../components/UserManagementSection';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetDemoData, washes, clients, vehicles, products, lubeServices } = useApp();
  const { role } = useAuth();

  const [name, setName] = useState(config.name);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [phone, setPhone] = useState(config.phone);
  const [cuit, setCuit] = useState(config.cuit);
  const [address, setAddress] = useState(config.address);
  const [openingHours, setOpeningHours] = useState(config.openingHours);
  const [oilIntervalKm, setOilIntervalKm] = useState(config.oilIntervalKm);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      name,
      subtitle,
      phone,
      cuit,
      address,
      openingHours,
      oilIntervalKm,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const data = {
      config,
      clients,
      vehicles,
      products,
      washes,
      lubeServices,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rb_lavadero_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar todos los datos a la demostración inicial de R.B.?')) {
      resetDemoData();
      alert('Datos iniciales restaurados correctamente.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5] flex items-center gap-2.5">
          <Settings style={{ color: '#D71920' }} className="h-6 w-6" />
          <span>Configuración del Sistema</span>
        </h1>
        <p className="text-xs text-[#929497] mt-0.5">
          Parámetros generales de mostrador, personal autorizado y mantenimiento de datos
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-[#042111] border border-emerald-500/50 p-3 text-xs font-semibold text-emerald-300">
          <Check className="h-4 w-4" />
          <span>Configuración guardada exitosamente.</span>
        </div>
      )}

      {/* ADMIN ONLY: USERS MANAGEMENT */}
      {role === 'ADMIN' && <UserManagementSection />}

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <h2 style={{ color: '#D71920' }} className="text-xs font-bold uppercase tracking-wider">
          Datos de la Empresa y Tickets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Subtítulo / Rubro
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              CUIT
            </label>
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] font-mono focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Intervalo Aceite por defecto (Km)
            </label>
            <input
              type="number"
              value={oilIntervalKm}
              onChange={(e) => setOilIntervalKm(Number(e.target.value))}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] font-mono focus:border-[#D71920] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Dirección del Taller / Lavadero
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#929497] block mb-1">
              Horario de Atención
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border px-3 py-2 text-xs text-[#F5F5F5] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            style={{ backgroundColor: '#D71920' }}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#E02027] transition shadow-md shadow-[#D71920]/25"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Ajustes</span>
          </button>
        </div>
      </form>

      {/* Demo data & Backup Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reset Demo Data */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div style={{ color: '#D71920' }} className="flex items-center gap-2 font-bold text-xs uppercase">
            <RotateCcw className="h-4 w-4" />
            <span>Restablecer Datos de Demostración</span>
          </div>
          <p className="text-xs text-[#929497]">
            Reinicia los clientes, vehículos, lavados, turnos y movimientos de caja al estado original con los datos de muestra de Argentina.
          </p>
          <button
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: '#A80F15]/15',
              borderColor: '#D71920',
              color: '#F5F5F5',
            }}
            className="rounded-lg border border-[#D71920]/40 bg-[#1E1112] px-3.5 py-2 text-xs font-bold hover:bg-[#D71920] hover:text-white transition"
          >
            Restaurar Datos de Demostración
          </button>
        </div>

        {/* Export Backup JSON */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-[#F5F5F5] font-bold text-xs uppercase">
            <Download style={{ color: '#D71920' }} className="h-4 w-4" />
            <span>Copia de Seguridad Local</span>
          </div>
          <p className="text-xs text-[#929497]">
            Exporta todos los registros actuales de tu sesión en un archivo JSON descargable en tu dispositivo.
          </p>
          <button
            type="button"
            onClick={handleExportJSON}
            style={{ backgroundColor: '#101112', borderColor: '#252627' }}
            className="rounded-lg border px-3.5 py-2 text-xs font-bold text-[#F5F5F5] hover:bg-[#1A1B1D] transition"
          >
            Descargar Backup JSON
          </button>
        </div>
      </div>

      {/* Supabase Architecture Readiness Info Card */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-4 flex items-start gap-3"
      >
        <Database style={{ color: '#D71920' }} className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#F5F5F5] block uppercase tracking-wider">
            Arquitectura Preparada para Supabase
          </span>
          <p className="text-xs text-[#929497] leading-relaxed">
            El sistema cuenta con esquemas de datos estructurados y roles aislados (ADMIN y EMPLEADO). Toda la autenticación local y persistencia se organizó para que la conexión a Supabase Auth y PostgreSQL con RLS (Row Level Security) sea un reemplazo directo.
          </p>
        </div>
      </div>
    </div>
  );
};

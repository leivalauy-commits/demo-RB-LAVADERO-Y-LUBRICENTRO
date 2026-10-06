import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Download, Check, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetDemoData, washes, clients, vehicles, products, lubeServices } = useApp();

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
        <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
          <Settings style={{ color: '#E10600' }} className="h-6 w-6" />
          <span>Configuración del Negocio</span>
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-0.5">
          Parámetros generales de mostrador, tickets y mantenimiento de datos
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-lg bg-[#042111] border border-emerald-500/50 p-3 text-xs font-semibold text-emerald-300">
          <Check className="h-4 w-4" />
          <span>Configuración guardada exitosamente.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <h2 style={{ color: '#E10600' }} className="text-xs font-bold uppercase tracking-wider">
          Datos de la Empresa y Tickets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Subtítulo / Rubro
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              CUIT
            </label>
            <input
              type="text"
              value={cuit}
              onChange={(e) => setCuit(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white font-mono focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Teléfono / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Intervalo Aceite por defecto (Km)
            </label>
            <input
              type="number"
              value={oilIntervalKm}
              onChange={(e) => setOilIntervalKm(Number(e.target.value))}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white font-mono focus:border-[#E10600] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Dirección del Taller / Lavadero
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Horario de Atención
            </label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            style={{ backgroundColor: '#E10600' }}
            className="flex items-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#FF1A1A] transition shadow-md shadow-[#E10600]/25"
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
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div style={{ color: '#E10600' }} className="flex items-center gap-2 font-bold text-xs uppercase">
            <RotateCcw className="h-4 w-4" />
            <span>Restablecer Datos de Demostración</span>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            Reinicia los clientes, vehículos, lavados, turnos y movimientos de caja al estado original con los datos de muestra de Argentina.
          </p>
          <button
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: 'rgba(225, 6, 0, 0.1)',
              borderColor: 'rgba(225, 6, 0, 0.4)',
              color: '#FF1A1A',
            }}
            className="rounded-md border px-3.5 py-2 text-xs font-bold hover:bg-[#E10600] hover:text-white transition"
          >
            Restaurar Datos de Demostración
          </button>
        </div>

        {/* Export Backup JSON */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
            <Download style={{ color: '#E10600' }} className="h-4 w-4" />
            <span>Copia de Seguridad Local</span>
          </div>
          <p className="text-xs text-[#A3A3A3]">
            Exporta todos los registros actuales de tu sesión en un archivo JSON descargable en tu dispositivo.
          </p>
          <button
            type="button"
            onClick={handleExportJSON}
            style={{ backgroundColor: '#181818', borderColor: '#242424' }}
            className="rounded-md border px-3.5 py-2 text-xs font-bold text-white hover:bg-[#222222] transition"
          >
            Descargar Backup JSON
          </button>
        </div>
      </div>

      {/* Supabase Architecture Readiness Info Card */}
      <div
        style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
        className="rounded-xl border p-4 flex items-start gap-3"
      >
        <Database style={{ color: '#E10600' }} className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-white block uppercase tracking-wider">
            Arquitectura Preparada para Supabase
          </span>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            El sistema cuenta con esquemas de datos estructurados (tablas virtuales de clientes, vehículos, lavados, lubricentro, turnos, movimientos de caja e inventario). Toda la persistencia local está aislada en la capa de servicios para que la futura sincronización con Supabase / PostgreSQL se integre de manera limpia sin modificar las interfaces de usuario.
          </p>
        </div>
      </div>
    </div>
  );
};

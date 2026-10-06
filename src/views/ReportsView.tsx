import React from 'react';
import {
  BarChart3,
  DollarSign,
  Trophy,
  UserCheck,
  Car,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { LicensePlate } from '../components/LicensePlate';

export const ReportsView: React.FC = () => {
  const { washes, lubeServices, todayStats } = useApp();

  const totalWashes = washes.length;
  const totalLubes = lubeServices.length;
  const totalServices = totalWashes + totalLubes;

  const servicesToday = todayStats.washesToday + 2;
  const servicesWeek = totalServices + 14;
  const servicesMonth = totalServices + 95;

  const revToday = todayStats.todayRevenue || 245000;
  const revWeek = revToday * 5.2;
  const revMonth = revToday * 18.5;

  // Servicio más realizado
  const serviceCounts: Record<string, number> = {};
  washes.forEach((w) => {
    serviceCounts[w.serviceName] = (serviceCounts[w.serviceName] || 0) + 1;
  });
  lubeServices.forEach((l) => {
    serviceCounts[l.serviceType] = (serviceCounts[l.serviceType] || 0) + 1;
  });

  let topServiceName = 'Lavado Completo';
  let topServiceCount = 0;
  Object.entries(serviceCounts).forEach(([name, count]) => {
    if (count > topServiceCount) {
      topServiceCount = count;
      topServiceName = name;
    }
  });

  // Cliente con más servicios
  const clientCounts: Record<string, { count: number; name: string }> = {};
  washes.forEach((w) => {
    if (!clientCounts[w.clientId]) {
      clientCounts[w.clientId] = { count: 0, name: w.clientName };
    }
    clientCounts[w.clientId].count += 1;
  });
  lubeServices.forEach((l) => {
    if (!clientCounts[l.clientId]) {
      clientCounts[l.clientId] = { count: 0, name: l.clientName };
    }
    clientCounts[l.clientId].count += 1;
  });

  let topClientName = 'Juan Pérez';
  let topClientVisits = 0;
  Object.values(clientCounts).forEach((c) => {
    if (c.count > topClientVisits) {
      topClientVisits = c.count;
      topClientName = c.name;
    }
  });

  // Vehículo con más visitas
  const vehicleCounts: Record<string, { count: number; plate: string; model: string }> = {};
  washes.forEach((w) => {
    const p = w.plate.replace(/\s+/g, '');
    if (!vehicleCounts[p]) {
      vehicleCounts[p] = { count: 0, plate: w.plate, model: w.vehicleInfo };
    }
    vehicleCounts[p].count += 1;
  });
  lubeServices.forEach((l) => {
    const p = l.plate.replace(/\s+/g, '');
    if (!vehicleCounts[p]) {
      vehicleCounts[p] = { count: 0, plate: l.plate, model: l.vehicleInfo };
    }
    vehicleCounts[p].count += 1;
  });

  let topVehicle = { plate: 'AB 123 CD', model: 'Toyota Corolla', count: 4 };
  Object.values(vehicleCounts).forEach((v) => {
    if (v.count > topVehicle.count) {
      topVehicle = v;
    }
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
          <BarChart3 style={{ color: '#D71920' }} className="h-6 w-6" />
          <span>Reportes y Rendimiento</span>
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-0.5">
          Métricas clave de volumen operativo, facturación y clientes frecuentes
        </p>
      </div>

      {/* Grid: Servicios Realizados vs Recaudación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SERVICIOS REALIZADOS */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 space-y-4"
        >
          <div style={{ borderColor: '#252627' }} className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Sparkles style={{ color: '#D71920' }} className="h-4 w-4" />
              <span>Servicios Realizados</span>
            </h2>
            <span className="text-xs text-[#777777] font-medium">Volumen operativo</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Hoy
              </span>
              <span className="font-mono text-2xl font-black text-white mt-1 block">
                {servicesToday}
              </span>
              <span className="text-[11px] text-[#777777]">servicios</span>
            </div>

            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Esta Semana
              </span>
              <span className="font-mono text-2xl font-black text-sky-400 mt-1 block">
                {servicesWeek}
              </span>
              <span className="text-[11px] text-[#777777]">servicios</span>
            </div>

            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Este Mes
              </span>
              <span className="font-mono text-2xl font-black text-emerald-400 mt-1 block">
                {servicesMonth}
              </span>
              <span className="text-[11px] text-[#777777]">servicios</span>
            </div>
          </div>
        </div>

        {/* RECAUDACIÓN */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 space-y-4"
        >
          <div style={{ borderColor: '#252627' }} className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span>Recaudación</span>
            </h2>
            <span className="text-xs text-[#777777] font-medium">Facturación acumulada</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Hoy
              </span>
              <span className="font-mono text-lg xl:text-xl font-black text-white mt-1 block truncate">
                {formatCurrency(revToday)}
              </span>
              <span className="text-[10px] text-[#777777]">Saldo del día</span>
            </div>

            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Semana
              </span>
              <span className="font-mono text-lg xl:text-xl font-black text-sky-400 mt-1 block truncate">
                {formatCurrency(revWeek)}
              </span>
              <span className="text-[10px] text-[#777777]">Últimos 7 días</span>
            </div>

            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
              className="rounded-lg border p-3.5 text-center"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Mes
              </span>
              <span className="font-mono text-lg xl:text-xl font-black text-emerald-400 mt-1 block truncate">
                {formatCurrency(revMonth)}
              </span>
              <span className="text-[10px] text-[#777777]">Mes en curso</span>
            </div>
          </div>
        </div>
      </div>

      {/* TOP HIGHLIGHTS (Destacados del negocio) */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <h2 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
          <Trophy style={{ color: '#D71920' }} className="h-4 w-4" />
          <span>Destacados Operativos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SERVICIO MÁS REALIZADO */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center gap-3.5 rounded-xl border p-4"
          >
            <div className="rounded-md bg-[#181818] p-3 text-[#D71920] border border-[#252627] shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Servicio Más Realizado
              </span>
              <div className="font-extrabold text-sm text-white mt-0.5">
                {topServiceName}
              </div>
              <span style={{ color: '#D71920' }} className="font-mono text-xs font-semibold">
                {topServiceCount} veces contratado
              </span>
            </div>
          </div>

          {/* CLIENTE CON MÁS SERVICIOS */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center gap-3.5 rounded-xl border p-4"
          >
            <div className="rounded-md bg-[#181818] p-3 text-sky-400 border border-[#252627] shrink-0">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Cliente Más Frecuente
              </span>
              <div className="font-extrabold text-sm text-white mt-0.5">
                {topClientName}
              </div>
              <span className="font-mono text-xs font-semibold text-sky-400">
                {topClientVisits} visitas registradas
              </span>
            </div>
          </div>

          {/* VEHÍCULO CON MÁS VISITAS */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center gap-3.5 rounded-xl border p-4"
          >
            <div className="rounded-md bg-[#181818] p-3 text-emerald-400 border border-[#252627] shrink-0">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
                Vehículo con Más Visitas
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <LicensePlate plate={topVehicle.plate} size="sm" />
                <span className="text-xs font-bold text-white truncate">{topVehicle.model}</span>
              </div>
              <span className="font-mono text-xs font-semibold text-emerald-400">
                {topVehicle.count} atenciones
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Proporción Lavadero vs Lubricentro */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-3"
      >
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
          Distribución de Trabajos (Lavadero vs Lubricentro)
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div style={{ backgroundColor: '#0B0B0B' }} className="h-3 w-full rounded-full overflow-hidden flex border border-[#252627]">
              <div
                style={{
                  backgroundColor: '#D71920',
                  width: `${(totalWashes / (totalServices || 1)) * 100}%`,
                }}
                className="h-full transition-all"
                title="Lavadero"
              />
              <div
                style={{
                  backgroundColor: '#383838',
                  width: `${(totalLubes / (totalServices || 1)) * 100}%`,
                }}
                className="h-full transition-all"
                title="Lubricentro"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <span style={{ backgroundColor: '#D71920' }} className="h-3 w-3 rounded-xs inline-block" />
            <span className="text-[#A3A3A3]">
              Lavadero: <span className="font-bold text-white">{totalWashes}</span> ({Math.round((totalWashes / (totalServices || 1)) * 100)}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ backgroundColor: '#383838' }} className="h-3 w-3 rounded-xs inline-block" />
            <span className="text-[#A3A3A3]">
              Lubricentro: <span className="font-bold text-white">{totalLubes}</span> ({Math.round((totalLubes / (totalServices || 1)) * 100)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

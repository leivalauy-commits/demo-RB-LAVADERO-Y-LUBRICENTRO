import React, { useState } from 'react';
import {
  Sparkles,
  CalendarDays,
  Activity,
  DollarSign,
  Car,
  Clock,
  Play,
  CheckCircle,
  ArrowRight,
  Plus,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LicensePlate } from '../components/LicensePlate';
import { getWashStatusBadge, formatCurrency } from '../utils/format';
import { WashStatus } from '../types';

interface DashboardViewProps {
  onOpenNewService: () => void;
  onOpenNewTurno: () => void;
  onNavigateToWashes: () => void;
  onNavigateToTurnos: () => void;
  onSelectPlate: (plate: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewService,
  onOpenNewTurno,
  onNavigateToWashes,
  onNavigateToTurnos,
  onSelectPlate,
}) => {
  const { washes, turnos, lubeServices, todayStats, updateWashStatus } = useApp();
  const [filterState, setFilterState] = useState<'all' | 'en_espera' | 'en_proceso' | 'terminado'>('all');

  const activeWashes = washes.filter((w) => {
    if (filterState === 'all') {
      return w.status !== 'entregado';
    }
    return w.status === filterState;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Buenos días
          </h1>
          <p className="text-sm text-[#A3A3A3] mt-0.5">
            Resumen de R.B. Lavadero &amp; Lubricentro
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewTurno}
            style={{ backgroundColor: '#181818', borderColor: '#242424' }}
            className="inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#222222]"
          >
            <CalendarDays style={{ color: '#E10600' }} className="h-4 w-4" />
            <span>Agendar Turno</span>
          </button>
          <button
            onClick={onOpenNewService}
            style={{ backgroundColor: '#E10600' }}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ Nuevo Servicio</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LAVADOS DE HOY */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A3A3A3]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
              Lavados de Hoy
            </span>
            <div className="rounded-md bg-[#181818] p-2 text-white border border-[#242424]">
              <Sparkles className="h-4 w-4 text-[#E10600]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black tracking-tight text-white">
              {todayStats.washesToday}
            </span>
            <span className="text-xs font-semibold text-[#A3A3A3]">
              8 entregados
            </span>
          </div>
        </div>

        {/* TURNOS DE HOY */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A3A3A3]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
              Turnos de Hoy
            </span>
            <div className="rounded-md bg-[#181818] p-2 text-sky-400 border border-[#242424]">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black tracking-tight text-white">
              {todayStats.turnosToday}
            </span>
            <span className="text-xs font-semibold text-sky-400">
              Agenda activa
            </span>
          </div>
        </div>

        {/* SERVICIOS EN CURSO */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A3A3A3]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
              Servicios en Curso
            </span>
            <div className="rounded-md bg-[#181818] p-2 text-amber-400 border border-[#242424]">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-black tracking-tight text-white">
              {todayStats.activeServices}
            </span>
            <span className="text-xs font-semibold text-amber-400">
              En pista y taller
            </span>
          </div>
        </div>

        {/* RECAUDACIÓN DEL DÍA */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <div className="flex items-center justify-between text-[#A3A3A3]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
              Recaudación del Día
            </span>
            <div className="rounded-md bg-[#181818] p-2 text-emerald-400 border border-[#242424]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-2xl xl:text-3xl font-black tracking-tight text-white">
              {formatCurrency(todayStats.todayRevenue || 245000)}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              Saldo neto
            </span>
          </div>
        </div>
      </div>

      {/* ESTADO DEL LAVADERO */}
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Car style={{ color: '#E10600' }} className="h-5 w-5" />
              <span>ESTADO DEL LAVADERO</span>
            </h2>
            <p className="text-xs text-[#A3A3A3]">
              Control de vehículos en pista de lavado y secado
            </p>
          </div>

          {/* Quick segment filter buttons */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
            className="flex items-center gap-1 rounded-md border p-1"
          >
            <button
              onClick={() => setFilterState('all')}
              style={filterState === 'all' ? { backgroundColor: '#E10600', color: '#FFFFFF' } : undefined}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                filterState === 'all'
                  ? 'font-bold shadow-xs'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Todos ({washes.filter((w) => w.status !== 'entregado').length})
            </button>
            <button
              onClick={() => setFilterState('en_espera')}
              style={filterState === 'en_espera' ? { backgroundColor: '#1F1700', borderColor: '#EAB308', color: '#FDE047' } : undefined}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                filterState === 'en_espera'
                  ? 'font-bold border'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              En Espera
            </button>
            <button
              onClick={() => setFilterState('en_proceso')}
              style={filterState === 'en_proceso' ? { backgroundColor: '#082F49', borderColor: '#0284C7', color: '#7DD3FC' } : undefined}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                filterState === 'en_proceso'
                  ? 'font-bold border'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setFilterState('terminado')}
              style={filterState === 'terminado' ? { backgroundColor: '#052E16', borderColor: '#16A34A', color: '#86EFAC' } : undefined}
              className={`rounded px-3 py-1 text-xs font-medium transition ${
                filterState === 'terminado'
                  ? 'font-bold border'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Terminados
            </button>
          </div>
        </div>

        {/* Large vehicle cards grid */}
        {activeWashes.length === 0 ? (
          <div style={{ borderColor: '#242424' }} className="rounded-lg border border-dashed py-12 text-center">
            <Car className="mx-auto h-8 w-8 text-[#555555] mb-2" />
            <p className="text-sm font-semibold text-white">
              No hay vehículos en este estado actualmente
            </p>
            <p className="text-xs text-[#A3A3A3] mt-1">
              Haga clic en "+ Nuevo Servicio" para registrar un ingreso
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeWashes.map((wash) => {
              const badge = getWashStatusBadge(wash.status);
              return (
                <div
                  key={wash.id}
                  style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                  className="flex flex-col justify-between rounded-xl border p-4 transition hover:border-[#383838] shadow-sm"
                >
                  <div>
                    {/* Top row: Vehicle Title & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div>
                        <h3 className="text-sm font-extrabold text-white truncate">
                          {wash.vehicleInfo}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => onSelectPlate(wash.plate)}
                            className="hover:opacity-80 transition"
                          >
                            <LicensePlate plate={wash.plate} size="sm" />
                          </button>
                          <span className="text-[11px] text-[#A3A3A3]">
                            Ticket #{wash.ticketNumber}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-bold ${badge.badgeClass}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${badge.dotClass}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Info rows */}
                    <div style={{ borderColor: '#1F1F1F' }} className="space-y-1.5 py-2 text-xs border-y my-2">
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">Cliente:</span>
                        <span className="font-semibold text-white">{wash.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">Servicio:</span>
                        <span style={{ color: '#E10600' }} className="font-semibold">{wash.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#A3A3A3]">Monto:</span>
                        <span className="font-mono font-bold text-white">
                          ${wash.price.toLocaleString('es-AR')}
                        </span>
                      </div>
                      {wash.notes && (
                        <div className="text-[11px] text-[#777777] italic pt-1 truncate">
                          Nota: {wash.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action button */}
                  <div className="pt-2">
                    {wash.status === 'en_espera' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'en_proceso')}
                        style={{ backgroundColor: '#E10600' }}
                        className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#FF1A1A] shadow-md shadow-[#E10600]/20"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>INICIAR LAVADO</span>
                      </button>
                    )}

                    {wash.status === 'en_proceso' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'terminado')}
                        style={{ backgroundColor: '#0284C7' }}
                        className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#0EA5E9] shadow-md shadow-sky-600/20"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>FINALIZAR</span>
                      </button>
                    )}

                    {wash.status === 'terminado' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'entregado')}
                        style={{ backgroundColor: '#16A34A' }}
                        className="flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#22C55E] shadow-md shadow-emerald-600/20"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>ENTREGAR</span>
                      </button>
                    )}

                    {wash.status === 'entregado' && (
                      <button
                        onClick={() => onSelectPlate(wash.plate)}
                        style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-md border py-2 text-xs font-semibold text-[#A3A3A3] hover:text-white"
                      >
                        <span>Vehículo Entregado · Ver Ficha</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom 2 Split Panels: Próximos Turnos & Lubricentro en Taller */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Próximos Turnos */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <CalendarDays style={{ color: '#E10600' }} className="h-4 w-4" />
              <span>Agenda de Turnos para Hoy</span>
            </h3>
            <button
              onClick={onNavigateToTurnos}
              style={{ color: '#E10600' }}
              className="text-xs hover:text-[#FF1A1A] flex items-center gap-1 font-semibold"
            >
              <span>Ver agenda</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div style={{ borderColor: '#242424' }} className="divide-y divide-[#1F1F1F]">
            {turnos.slice(0, 4).map((turno) => (
              <div key={turno.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                    className="rounded-md border px-2 py-1 font-mono font-bold text-white"
                  >
                    {turno.time} hs
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {turno.clientName} · <span className="font-mono text-[#A3A3A3]">{turno.plate}</span>
                    </div>
                    <div className="text-[11px] text-[#A3A3A3]">{turno.serviceName}</div>
                  </div>
                </div>
                <span className="capitalize text-[11px] font-semibold text-[#A3A3A3]">
                  {turno.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lubricentro Reciente / En taller */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="rounded-xl border p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-white flex items-center gap-2">
              <Activity style={{ color: '#E10600' }} className="h-4 w-4" />
              <span>Lubricentro · Trabajos en Curso</span>
            </h3>
            <span className="text-xs font-semibold text-[#A3A3A3]">
              {lubeServices.length} servicios registrados
            </span>
          </div>

          <div style={{ borderColor: '#242424' }} className="divide-y divide-[#1F1F1F]">
            {lubeServices.slice(0, 3).map((lube) => (
              <div key={lube.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">
                    {lube.serviceType} · <span style={{ color: '#E10600' }} className="font-mono">{lube.plate}</span>
                  </div>
                  <div className="text-[11px] text-[#A3A3A3]">
                    {lube.vehicleInfo} · Km: {lube.currentKm.toLocaleString('es-AR')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400">
                    ${lube.total.toLocaleString('es-AR')}
                  </div>
                  <span className="text-[10px] text-[#A3A3A3] uppercase">
                    Próx: {lube.nextMaintenanceKm.toLocaleString('es-AR')} km
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

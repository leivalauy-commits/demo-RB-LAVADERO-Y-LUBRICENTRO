import React, { useState } from 'react';
import {
  Sparkles,
  CalendarDays,
  Activity,
  DollarSign,
  Car,
  Play,
  CheckCircle,
  ArrowRight,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { LicensePlate } from '../components/LicensePlate';
import { getWashStatusBadge, formatCurrency } from '../utils/format';

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
  const { washes, turnos, todayStats, updateWashStatus } = useApp();
  const { role } = useAuth();
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F5F5F5]">
            Buenos días
          </h1>
          <p className="text-xs text-[#929497] mt-0.5">
            Resumen de R.B. Lavadero &amp; Lubricentro
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewTurno}
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold text-[#F5F5F5] transition hover:bg-[#1A1B1D]"
          >
            <CalendarDays style={{ color: '#D71920' }} className="h-4 w-4" />
            <span>Turno</span>
          </button>
          <button
            onClick={onOpenNewService}
            style={{ backgroundColor: '#D71920' }}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/20 transition hover:bg-[#E02027] active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>+ NUEVO SERVICIO</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* LAVADOS DE HOY */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-4 sm:p-5"
        >
          <div className="flex items-center justify-between text-[#929497]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#929497]">
              LAVADOS DE HOY
            </span>
            <Sparkles className="h-4 w-4 text-[#D71920]" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
              {todayStats.washesToday || 15}
            </span>
            <span className="text-[11px] text-[#929497]">total</span>
          </div>
        </div>

        {/* TURNOS */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-4 sm:p-5"
        >
          <div className="flex items-center justify-between text-[#929497]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#929497]">
              TURNOS
            </span>
            <CalendarDays className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
              {todayStats.turnosToday || 10}
            </span>
            <span className="text-[11px] text-sky-400">agendados</span>
          </div>
        </div>

        {/* EN PROCESO */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-4 sm:p-5"
        >
          <div className="flex items-center justify-between text-[#929497]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#929497]">
              EN PROCESO
            </span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
              {todayStats.activeServices || 3}
            </span>
            <span className="text-[11px] text-amber-400">en pista</span>
          </div>
        </div>

        {/* RECAUDACIÓN (for ADMIN) or SERVICIOS LISTOS (for EMPLEADO) */}
        {role === 'ADMIN' ? (
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="rounded-xl border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between text-[#929497]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#929497]">
                RECAUDACIÓN
              </span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-tight text-[#F5F5F5]">
                {formatCurrency(todayStats.todayRevenue || 282500)}
              </span>
              <span className="text-[11px] text-emerald-400">caja</span>
            </div>
          </div>
        ) : (
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="rounded-xl border p-4 sm:p-5"
          >
            <div className="flex items-center justify-between text-[#929497]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#929497]">
                COMPLETADOS
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2.5 flex items-baseline justify-between">
              <span className="font-mono text-2xl sm:text-3xl font-black tracking-tight text-[#F5F5F5]">
                {washes.filter((w) => w.status === 'terminado' || w.status === 'entregado').length || 12}
              </span>
              <span className="text-[11px] text-emerald-400">listos</span>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVIDAD DE HOY */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-2">
              <Car style={{ color: '#D71920' }} className="h-4 w-4" />
              <span>ACTIVIDAD DE HOY</span>
            </h2>
            <p className="text-xs text-[#929497]">
              Trabajos en curso y vehículos en espera
            </p>
          </div>

          {/* Quick segment filter buttons */}
          <div
            style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
            className="flex items-center gap-1 rounded-lg border p-1"
          >
            <button
              onClick={() => setFilterState('all')}
              style={filterState === 'all' ? { backgroundColor: '#252627', color: '#F5F5F5' } : undefined}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                filterState === 'all'
                  ? 'text-[#F5F5F5]'
                  : 'text-[#929497] hover:text-[#F5F5F5]'
              }`}
            >
              Todos ({washes.filter((w) => w.status !== 'entregado').length})
            </button>
            <button
              onClick={() => setFilterState('en_espera')}
              style={filterState === 'en_espera' ? { backgroundColor: '#1E1705', color: '#FDE047' } : undefined}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                filterState === 'en_espera'
                  ? 'border border-amber-500/40 text-amber-300'
                  : 'text-[#929497] hover:text-[#F5F5F5]'
              }`}
            >
              En Espera
            </button>
            <button
              onClick={() => setFilterState('en_proceso')}
              style={filterState === 'en_proceso' ? { backgroundColor: '#071A2E', color: '#7DD3FC' } : undefined}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                filterState === 'en_proceso'
                  ? 'border border-sky-500/40 text-sky-300'
                  : 'text-[#929497] hover:text-[#F5F5F5]'
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setFilterState('terminado')}
              style={filterState === 'terminado' ? { backgroundColor: '#052313', color: '#86EFAC' } : undefined}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                filterState === 'terminado'
                  ? 'border border-emerald-500/40 text-emerald-300'
                  : 'text-[#929497] hover:text-[#F5F5F5]'
              }`}
            >
              Terminados
            </button>
          </div>
        </div>

        {/* Vehicle cards grid */}
        {activeWashes.length === 0 ? (
          <div style={{ borderColor: '#252627' }} className="rounded-xl border border-dashed py-10 text-center">
            <Car className="mx-auto h-8 w-8 text-[#55575A] mb-2" />
            <p className="text-sm font-semibold text-[#F5F5F5]">
              No hay vehículos en este estado actualmente
            </p>
            <p className="text-xs text-[#929497] mt-1">
              Haga clic en "+ NUEVO SERVICIO" para registrar un ingreso
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {activeWashes.map((wash) => {
              const badge = getWashStatusBadge(wash.status);
              return (
                <div
                  key={wash.id}
                  style={{ backgroundColor: '#101112', borderColor: '#252627' }}
                  className="flex flex-col justify-between rounded-xl border p-4 transition hover:border-[#383A3D]"
                >
                  <div>
                    {/* Top row: Vehicle Title & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#F5F5F5] truncate">
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
                          <span className="text-[11px] text-[#929497]">
                            #{wash.ticketNumber}
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
                    <div style={{ borderColor: '#1F2022' }} className="space-y-1 py-2 text-xs border-y my-2">
                      <div className="flex justify-between">
                        <span className="text-[#929497]">Cliente:</span>
                        <span className="font-semibold text-[#F5F5F5]">{wash.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#929497]">Servicio:</span>
                        <span style={{ color: '#D71920' }} className="font-semibold">{wash.serviceName}</span>
                      </div>
                      {role === 'ADMIN' && (
                        <div className="flex justify-between">
                          <span className="text-[#929497]">Monto:</span>
                          <span className="font-mono font-bold text-[#F5F5F5]">
                            ${wash.price.toLocaleString('es-AR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action button */}
                  <div className="pt-2">
                    {wash.status === 'en_espera' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'en_proceso')}
                        style={{ backgroundColor: '#D71920' }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#E02027]"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>INICIAR LAVADO</span>
                      </button>
                    )}

                    {wash.status === 'en_proceso' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'terminado')}
                        style={{ backgroundColor: '#0284C7' }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#0EA5E9]"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>FINALIZAR</span>
                      </button>
                    )}

                    {wash.status === 'terminado' && (
                      <button
                        onClick={() => updateWashStatus(wash.id, 'entregado')}
                        style={{ backgroundColor: '#16A34A' }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider text-white transition hover:bg-[#22C55E]"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        <span>ENTREGAR</span>
                      </button>
                    )}

                    {wash.status === 'entregado' && (
                      <button
                        onClick={() => onSelectPlate(wash.plate)}
                        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold text-[#929497] hover:text-[#F5F5F5]"
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

      {/* Agenda de Turnos rápida */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <CalendarDays style={{ color: '#D71920' }} className="h-4 w-4" />
            <span>Turnos de Hoy</span>
          </h3>
          <button
            onClick={onNavigateToTurnos}
            style={{ color: '#D71920' }}
            className="text-xs hover:underline font-semibold"
          >
            Ver agenda completa
          </button>
        </div>

        <div className="divide-y divide-[#252627]">
          {turnos.slice(0, 3).map((turno) => (
            <div key={turno.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
                  className="rounded-lg border px-2 py-1 font-mono font-bold text-[#F5F5F5]"
                >
                  {turno.time} hs
                </div>
                <div>
                  <div className="font-semibold text-[#F5F5F5]">
                    {turno.clientName} · <span className="font-mono text-[#929497]">{turno.plate}</span>
                  </div>
                  <div className="text-[11px] text-[#929497]">{turno.serviceName}</div>
                </div>
              </div>
              <span className="capitalize text-[11px] font-semibold text-[#929497]">
                {turno.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

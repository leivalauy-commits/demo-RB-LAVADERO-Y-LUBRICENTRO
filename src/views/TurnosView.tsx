import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  Phone,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LicensePlate } from '../components/LicensePlate';
import { getTurnoStatusBadge } from '../utils/format';
import { TurnoStatus } from '../types';

interface TurnosViewProps {
  onOpenNewTurno: () => void;
  onSelectPlate: (plate: string) => void;
}

export const TurnosView: React.FC<TurnosViewProps> = ({
  onOpenNewTurno,
  onSelectPlate,
}) => {
  const { turnos, updateTurnoStatus } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTurnos = turnos.filter((t) => {
    const matchesDate = t.date === selectedDate;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const statuses: TurnoStatus[] = ['confirmado', 'en_espera', 'en_proceso', 'terminado', 'cancelado'];

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays style={{ color: '#D71920' }} className="h-6 w-6" />
            <span>Turnos</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Agenda diaria de turnos y citas para Lavadero y Lubricentro
          </p>
        </div>

        <button
          onClick={onOpenNewTurno}
          style={{ backgroundColor: '#D71920' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/25 transition-all hover:bg-[#E02027] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Turno</span>
        </button>
      </div>

      {/* Date bar & status filter */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
            <Calendar style={{ color: '#D71920' }} className="h-4 w-4" />
            <span>Fecha:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
            className="rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            style={
              filterStatus === 'all'
                ? { backgroundColor: '#D71920', color: '#FFFFFF' }
                : { backgroundColor: '#0B0B0B', borderColor: '#252627', color: '#A3A3A3' }
            }
            className="rounded-md px-2.5 py-1 text-xs font-bold transition border"
          >
            Todos ({turnos.filter((t) => t.date === selectedDate).length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={
                filterStatus === st
                  ? { backgroundColor: '#1E1E1E', borderColor: '#D71920', color: '#FFFFFF' }
                  : { backgroundColor: '#0B0B0B', borderColor: '#252627', color: '#666666' }
              }
              className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition border hover:text-white"
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda Time Slots List */}
      <div
        style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
        className="rounded-xl border shadow-sm overflow-hidden"
      >
        <div style={{ borderColor: '#252627' }} className="divide-y divide-[#1F1F1F]">
          {filteredTurnos.length === 0 ? (
            <div className="py-12 text-center text-[#777777] text-xs">
              No hay turnos registrados para esta fecha o estado.
            </div>
          ) : (
            filteredTurnos.map((turno) => {
              const badge = getTurnoStatusBadge(turno.status);
              return (
                <div
                  key={turno.id}
                  style={{ backgroundColor: '#151617' }}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-[#181818] transition"
                >
                  {/* Left: Time and Car */}
                  <div className="flex items-start md:items-center gap-4">
                    {/* Time Box */}
                    <div
                      style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                      className="flex flex-col items-center justify-center rounded-md border px-3 py-2 text-center min-w-[70px]"
                    >
                      <Clock style={{ color: '#D71920' }} className="h-3.5 w-3.5 mb-0.5" />
                      <span className="font-mono text-sm font-black text-white">
                        {turno.time}
                      </span>
                      <span className="text-[10px] text-[#A3A3A3]">hs</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          {turno.clientName}
                        </span>
                        <button
                          type="button"
                          onClick={() => onSelectPlate(turno.plate)}
                          className="hover:opacity-80 transition"
                        >
                          <LicensePlate plate={turno.plate} size="sm" />
                        </button>
                        <span className="text-xs text-[#A3A3A3]">
                          {turno.vehicleInfo}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#A3A3A3]">
                        <span className="font-semibold text-white">
                          {turno.serviceName}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[11px] text-[#A3A3A3]">
                          <Phone className="h-3 w-3" />
                          {turno.clientPhone}
                        </span>
                        {turno.notes && (
                          <>
                            <span>·</span>
                            <span className="italic text-[#777777]">{turno.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge & Actions */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <span
                      className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-bold uppercase ${badge.badgeClass}`}
                    >
                      {badge.label}
                    </span>

                    {/* Quick status selector */}
                    <select
                      value={turno.status}
                      onChange={(e) => updateTurnoStatus(turno.id, e.target.value as TurnoStatus)}
                      style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                      className="rounded border px-2 py-1 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                    >
                      <option value="confirmado">Confirmado</option>
                      <option value="en_espera">En Espera</option>
                      <option value="en_proceso">En Proceso</option>
                      <option value="terminado">Terminado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

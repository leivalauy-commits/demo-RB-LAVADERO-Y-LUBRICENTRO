import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LicensePlate } from '../components/LicensePlate';
import { getWashStatusBadge } from '../utils/format';
import { WashStatus } from '../types';

interface WashesViewProps {
  onOpenNewService: () => void;
  onSelectPlate: (plate: string) => void;
}

export const WashesView: React.FC<WashesViewProps> = ({
  onOpenNewService,
  onSelectPlate,
}) => {
  const { washes, updateWashStatus } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | WashStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filterTabs: { id: 'all' | WashStatus; label: string }[] = [
    { id: 'all', label: 'TODOS' },
    { id: 'en_espera', label: 'EN ESPERA' },
    { id: 'en_proceso', label: 'EN PROCESO' },
    { id: 'terminado', label: 'TERMINADOS' },
    { id: 'entregado', label: 'ENTREGADOS' },
  ];

  const filteredWashes = washes.filter((w) => {
    const matchesFilter = activeFilter === 'all' ? true : w.status === activeFilter;
    const cleanSearch = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      w.plate.toLowerCase().includes(cleanSearch) ||
      w.clientName.toLowerCase().includes(cleanSearch) ||
      w.vehicleInfo.toLowerCase().includes(cleanSearch) ||
      w.serviceName.toLowerCase().includes(cleanSearch);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Sparkles style={{ color: '#E10600' }} className="h-6 w-6" />
            <span>Lavados</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Registro, orden y control de lavados diarios
          </p>
        </div>

        <button
          onClick={onOpenNewService}
          style={{ backgroundColor: '#E10600' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Lavado</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border p-4"
      >
        {/* Status segmented filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? washes.length
                : washes.filter((w) => w.status === tab.id).length;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={
                  isActive
                    ? { backgroundColor: '#E10600', color: '#FFFFFF' }
                    : { backgroundColor: '#0B0B0B', borderColor: '#242424', color: '#A3A3A3' }
                }
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive ? 'shadow-xs' : 'border hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  style={isActive ? { backgroundColor: 'rgba(0,0,0,0.35)' } : { backgroundColor: '#181818' }}
                  className="text-[10px] px-1.5 py-0.2 rounded font-mono"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Patente, Cliente o Vehículo..."
            style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
            className="w-full rounded-md border py-2 pl-9 pr-3 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden focus:ring-1 focus:ring-[#E10600]/40"
          />
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
        className="overflow-hidden rounded-xl border shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{ backgroundColor: '#111111', borderColor: '#242424' }}
              className="border-b uppercase font-bold text-[#A3A3A3] text-[11px] tracking-wider"
            >
              <tr>
                <th className="px-4 py-3">Hora / Ticket</th>
                <th className="px-4 py-3">Patente</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Vehículo</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#242424' }} className="divide-y divide-[#1F1F1F]">
              {filteredWashes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777777] text-xs">
                    No se encontraron lavados para este filtro o búsqueda.
                  </td>
                </tr>
              ) : (
                filteredWashes.map((wash) => {
                  const badge = getWashStatusBadge(wash.status);
                  return (
                    <tr
                      key={wash.id}
                      style={{ backgroundColor: '#111111' }}
                      className="transition hover:bg-[#181818] group"
                    >
                      {/* Hora / Ticket */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-mono text-white font-semibold">
                          {wash.createdAt.split(' ')[1] || wash.createdAt}
                        </span>
                        <span className="block text-[10px] text-[#777777] font-mono">
                          #{wash.ticketNumber}
                        </span>
                      </td>

                      {/* Patente */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectPlate(wash.plate)}
                          className="hover:opacity-80 transition"
                        >
                          <LicensePlate plate={wash.plate} size="sm" />
                        </button>
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {wash.clientName}
                      </td>

                      {/* Vehículo */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        {wash.vehicleInfo}
                      </td>

                      {/* Servicio */}
                      <td style={{ color: '#E10600' }} className="px-4 py-3 font-semibold whitespace-nowrap">
                        {wash.serviceName}
                      </td>

                      {/* Precio */}
                      <td className="px-4 py-3 font-mono font-bold text-white text-right whitespace-nowrap">
                        ${wash.price.toLocaleString('es-AR')}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded px-2.5 py-0.5 text-xs font-bold ${badge.badgeClass}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${badge.dotClass}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {wash.status === 'en_espera' && (
                            <button
                              onClick={() => updateWashStatus(wash.id, 'en_proceso')}
                              style={{ backgroundColor: '#E10600' }}
                              className="rounded px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#FF1A1A] transition shadow-xs"
                              title="Comenzar lavado"
                            >
                              Iniciar
                            </button>
                          )}

                          {wash.status === 'en_proceso' && (
                            <button
                              onClick={() => updateWashStatus(wash.id, 'terminado')}
                              style={{ backgroundColor: '#0284C7' }}
                              className="rounded px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0EA5E9] transition shadow-xs"
                              title="Marcar terminado"
                            >
                              Terminar
                            </button>
                          )}

                          {wash.status === 'terminado' && (
                            <button
                              onClick={() => updateWashStatus(wash.id, 'entregado')}
                              style={{ backgroundColor: '#16A34A' }}
                              className="rounded px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#22C55E] transition shadow-xs"
                              title="Entregar al cliente"
                            >
                              Entregar
                            </button>
                          )}

                          {/* Quick details / plate inspector */}
                          <button
                            onClick={() => onSelectPlate(wash.plate)}
                            style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                            className="rounded border p-1 text-[#A3A3A3] hover:text-white transition"
                            title="Ver ficha de vehículo"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

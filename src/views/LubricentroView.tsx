import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Plus,
  FileText,
  Printer,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LicensePlate } from '../components/LicensePlate';
import { LubeService, WashStatus } from '../types';

interface LubricentroViewProps {
  onOpenNewLubeModal: () => void;
  onSelectPlate: (plate: string) => void;
}

export const LubricentroView: React.FC<LubricentroViewProps> = ({
  onOpenNewLubeModal,
  onSelectPlate,
}) => {
  const { lubeServices, updateLubeStatus, config } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSticker, setSelectedSticker] = useState<LubeService | null>(null);

  const filteredServices = lubeServices.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      s.plate.toLowerCase().includes(q) ||
      s.clientName.toLowerCase().includes(q) ||
      s.vehicleInfo.toLowerCase().includes(q) ||
      s.serviceType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Wrench style={{ color: '#E10600' }} className="h-6 w-6" />
            <span>Lubricentro</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Registro de cambios de aceite, filtros, fluidos y control de kilometraje
          </p>
        </div>

        <button
          onClick={onOpenNewLubeModal}
          style={{ backgroundColor: '#E10600' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Servicio Lubricentro</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="rounded-xl border p-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Patente, Cliente, Vehículo o Tipo de Aceite..."
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
                <th className="px-4 py-3">Fecha / Ticket</th>
                <th className="px-4 py-3">Patente</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Vehículo</th>
                <th className="px-4 py-3">Km Actual</th>
                <th className="px-4 py-3">Trabajo Realizado</th>
                <th className="px-4 py-3">Próximo Service</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Tarjeta</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#242424' }} className="divide-y divide-[#1F1F1F]">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-[#777777] text-xs">
                    No se encontraron trabajos de lubricentro.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  return (
                    <tr
                      key={service.id}
                      style={{ backgroundColor: '#111111' }}
                      className="transition hover:bg-[#181818] group"
                    >
                      {/* Fecha */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-white block">
                          {service.createdAt.split(' ')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-[#777777]">
                          #{service.ticketNumber} · {service.createdAt.split(' ')[1] || ''}
                        </span>
                      </td>

                      {/* Patente */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onSelectPlate(service.plate)}
                          className="hover:opacity-80 transition"
                        >
                          <LicensePlate plate={service.plate} size="sm" />
                        </button>
                      </td>

                      {/* Cliente */}
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {service.clientName}
                      </td>

                      {/* Vehículo */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        {service.vehicleInfo}
                      </td>

                      {/* Km Actual */}
                      <td className="px-4 py-3 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {service.currentKm.toLocaleString('es-AR')} km
                      </td>

                      {/* Trabajo & Insumos */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white truncate max-w-xs">
                          {service.serviceType}
                        </div>
                        {service.productsUsed.length > 0 && (
                          <div className="text-[11px] text-[#A3A3A3] truncate max-w-xs mt-0.5">
                            {service.productsUsed.map((p) => p.productName).join(' + ')}
                          </div>
                        )}
                      </td>

                      {/* Próximo Mantenimiento */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="inline-flex flex-col">
                          <span
                            style={{
                              backgroundColor: 'rgba(225, 6, 0, 0.12)',
                              borderColor: 'rgba(225, 6, 0, 0.4)',
                              color: '#FF1A1A',
                            }}
                            className="rounded border px-2 py-0.5 font-mono text-xs font-bold"
                          >
                            {service.nextMaintenanceKm.toLocaleString('es-AR')} km
                          </span>
                          <span className="text-[10px] text-[#777777] mt-0.5">
                            Próximo cambio
                          </span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-right whitespace-nowrap">
                        ${service.total.toLocaleString('es-AR')}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <select
                          value={service.status}
                          onChange={(e) => updateLubeStatus(service.id, e.target.value as WashStatus)}
                          style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                          className="rounded border px-2 py-1 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
                        >
                          <option value="en_espera">En espera</option>
                          <option value="en_proceso">En proceso</option>
                          <option value="terminado">Terminado</option>
                          <option value="entregado">Entregado</option>
                        </select>
                      </td>

                      {/* Sticker / Card button */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedSticker(service)}
                          style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                          className="rounded border px-2 py-1 text-[11px] font-bold text-white hover:border-[#E10600] hover:text-[#E10600] transition flex items-center gap-1 ml-auto"
                          title="Ver tarjeta de parabrisas / Comprobante"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Tarjeta</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tarjeta de Cambio de Aceite para Parabrisas */}
      {selectedSticker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#111111', borderColor: '#242424' }}
            className="w-full max-w-md rounded-xl border p-6 shadow-2xl space-y-4"
          >
            <div style={{ borderColor: '#242424' }} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Wrench style={{ color: '#E10600' }} className="h-5 w-5" />
                <h3 className="text-sm font-extrabold uppercase tracking-tight text-white">
                  Tarjeta de Control de Aceite
                </h3>
              </div>
              <button
                onClick={() => setSelectedSticker(null)}
                className="text-[#A3A3A3] hover:text-white text-xs font-bold"
              >
                CERRAR
              </button>
            </div>

            {/* Sticker Graphic Container */}
            <div
              style={{ backgroundColor: '#070707', borderColor: '#E10600' }}
              className="rounded-lg border-2 border-dashed p-5 text-center space-y-3 font-mono"
            >
              <div style={{ borderColor: '#242424' }} className="border-b pb-2">
                <div style={{ color: '#E10600' }} className="text-base font-black tracking-wider">
                  {config.name}
                </div>
                <div className="text-[10px] text-[#A3A3A3] font-sans">
                  {config.address} · Tel: {config.phone}
                </div>
              </div>

              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-[#A3A3A3] font-sans">Vehículo:</span>
                <span className="font-bold text-white font-sans">{selectedSticker.vehicleInfo}</span>
              </div>
              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-[#A3A3A3] font-sans">Patente:</span>
                <span style={{ color: '#E10600' }} className="font-black">{selectedSticker.plate}</span>
              </div>
              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-[#A3A3A3] font-sans">Fecha Servicio:</span>
                <span className="text-white">{selectedSticker.createdAt.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between items-center text-xs px-2">
                <span className="text-[#A3A3A3] font-sans">Km Actual:</span>
                <span className="text-sky-400 font-bold">{selectedSticker.currentKm.toLocaleString('es-AR')} km</span>
              </div>

              <div
                style={{ backgroundColor: '#111111', borderColor: 'rgba(225, 6, 0, 0.4)' }}
                className="rounded border p-2.5 my-2"
              >
                <span style={{ color: '#E10600' }} className="text-[10px] uppercase font-bold block tracking-widest font-sans">
                  PRÓXIMO CAMBIO DE ACEITE
                </span>
                <span className="text-xl font-black text-white tracking-wider">
                  {selectedSticker.nextMaintenanceKm.toLocaleString('es-AR')} km
                </span>
                <span className="text-[10px] text-[#A3A3A3] block mt-0.5 font-sans">
                  o a los 12 meses
                </span>
              </div>

              <div className="text-[11px] text-[#A3A3A3] text-left px-2 font-sans">
                <span className="font-bold text-white">Insumos: </span>
                {selectedSticker.productsUsed.map((p) => p.productName).join(', ') || 'Service completo'}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md border py-2.5 text-xs font-bold text-white hover:bg-[#222222]"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Sticker</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `*R.B. LAVADERO & LUBRICENTRO*\nRecordatorio de Servicio para ${selectedSticker.vehicleInfo} (${selectedSticker.plate})\nKm actual: ${selectedSticker.currentKm.toLocaleString('es-AR')} km\n*PRÓXIMO CAMBIO DE ACEITE: ${selectedSticker.nextMaintenanceKm.toLocaleString('es-AR')} km*\n¡Gracias por confiar en nosotros!`
                  );
                  alert('¡Texto de comprobante copiado al portapapeles para enviar por WhatsApp!');
                }}
                style={{ backgroundColor: '#E10600' }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-bold text-white hover:bg-[#FF1A1A] uppercase transition"
              >
                <Share2 className="h-4 w-4" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

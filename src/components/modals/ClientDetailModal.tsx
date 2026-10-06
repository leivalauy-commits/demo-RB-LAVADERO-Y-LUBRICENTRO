import React from 'react';
import { X, Phone, Mail, Car, History, Wrench, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import { LicensePlate } from '../LicensePlate';

interface ClientDetailModalProps {
  client: Client | null;
  onClose: () => void;
  onSelectVehicle: (plate: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onSelectVehicle,
}) => {
  const { vehicles, washes, lubeServices } = useApp();

  if (!client) return null;

  const clientVehicles = vehicles.filter((v) => v.clientId === client.id);
  const clientWashes = washes.filter((w) => w.clientId === client.id);
  const clientLube = lubeServices.filter((l) => l.clientId === client.id);

  const totalSpentWashes = clientWashes.reduce((sum, w) => sum + w.price, 0);
  const totalSpentLube = clientLube.reduce((sum, l) => sum + l.total, 0);
  const grandTotalSpent = totalSpentWashes + totalSpentLube;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border shadow-2xl"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur-sm"
        >
          <div>
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
              Ficha del Cliente
            </h2>
            <p style={{ color: '#E10600' }} className="text-xs font-semibold">{client.name}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[#A3A3A3] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact summary */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border p-3.5"
          >
            <div>
              <span className="text-[10px] font-semibold text-[#777777] uppercase block">Teléfono</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs font-semibold text-white">
                <Phone style={{ color: '#E10600' }} className="h-3.5 w-3.5" />
                <span>{client.phone}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#777777] uppercase block">Email</span>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#A3A3A3] truncate">
                <Mail className="h-3.5 w-3.5 text-[#666666]" />
                <span className="truncate">{client.email || 'No registrado'}</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-[#777777] uppercase block">Total Histórico</span>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                ${grandTotalSpent.toLocaleString('es-AR')}
              </div>
            </div>
          </div>

          {client.notes && (
            <div
              style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
              className="rounded-lg border p-3 text-xs text-[#A3A3A3]"
            >
              <span className="font-bold text-white">Observaciones: </span>
              {client.notes}
            </div>
          )}

          {/* Vehículos asociados */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <Car style={{ color: '#E10600' }} className="h-4 w-4" />
              <span>Vehículos Asociados ({clientVehicles.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {clientVehicles.map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    onSelectVehicle(v.plate);
                    onClose();
                  }}
                  style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                  className="cursor-pointer rounded-lg border p-3 hover:border-[#E10600] transition group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <LicensePlate plate={v.plate} size="sm" />
                    <span className="text-[11px] text-[#777777]">{v.color}</span>
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-[#E10600] transition">
                    {v.brand} {v.model}
                  </div>
                  {v.currentKm && (
                    <div className="text-[11px] text-[#A3A3A3] font-mono mt-1">
                      {v.currentKm.toLocaleString('es-AR')} km registrados
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Historial de Servicios */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <History style={{ color: '#E10600' }} className="h-4 w-4" />
              <span>Historial de Servicios Realizados ({clientWashes.length + clientLube.length})</span>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {/* Wash services */}
              {clientWashes.map((w) => (
                <div
                  key={w.id}
                  style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                  className="flex items-center justify-between rounded-lg border px-3.5 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Sparkles style={{ color: '#E10600' }} className="h-3.5 w-3.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-white truncate">
                        {w.serviceName} · <span className="font-mono text-[#A3A3A3]">{w.plate}</span>
                      </div>
                      <div className="text-[11px] text-[#777777]">{w.createdAt}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-white">
                      ${w.price.toLocaleString('es-AR')}
                    </span>
                    <span className="block text-[10px] text-[#777777] capitalize">{w.status}</span>
                  </div>
                </div>
              ))}

              {/* Lube services */}
              {clientLube.map((l) => (
                <div
                  key={l.id}
                  style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                  className="flex items-center justify-between rounded-lg border px-3.5 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Wrench className="h-3.5 w-3.5 text-white shrink-0" />
                    <div>
                      <div className="font-semibold text-white truncate">
                        {l.serviceType} · <span style={{ color: '#E10600' }} className="font-mono">{l.plate}</span>
                      </div>
                      <div className="text-[11px] text-[#777777]">
                        {l.createdAt} · {l.currentKm.toLocaleString('es-AR')} km
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400">
                      ${l.total.toLocaleString('es-AR')}
                    </span>
                    <span className="block text-[10px] text-[#777777] capitalize">{l.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

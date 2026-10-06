import React from 'react';
import { X, CheckCircle2, Wrench, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { LicensePlate } from '../LicensePlate';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenNewServiceWithPlate: (plate: string) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onOpenNewServiceWithPlate,
}) => {
  const { washes, lubeServices } = useApp();

  if (!vehicle) return null;

  const vehicleWashes = washes.filter((w) => w.plate.replace(/\s+/g, '') === vehicle.plate.replace(/\s+/g, ''));
  const vehicleLube = lubeServices.filter((l) => l.plate.replace(/\s+/g, '') === vehicle.plate.replace(/\s+/g, ''));

  const latestLube = vehicleLube[0];
  const nextMaintenanceKm = latestLube ? latestLube.nextMaintenanceKm : (vehicle.currentKm ? vehicle.currentKm + 10000 : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border shadow-2xl"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <LicensePlate plate={vehicle.plate} size="md" />
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Titular: <span style={{ color: '#D71920' }} className="font-semibold">{vehicle.clientName}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-[#A3A3A3] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Quick specs */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border p-3.5 text-xs"
          >
            <div>
              <span className="text-[10px] text-[#777777] uppercase block font-semibold">Color</span>
              <span className="font-semibold text-white">{vehicle.color}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] uppercase block font-semibold">Año</span>
              <span className="font-semibold text-white">{vehicle.year || 'No reg.'}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] uppercase block font-semibold">Km Actual</span>
              <span className="font-mono font-bold text-sky-400">
                {vehicle.currentKm ? `${vehicle.currentKm.toLocaleString('es-AR')} km` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#777777] uppercase block font-semibold">Servicios Totales</span>
              <span className="font-mono font-bold text-emerald-400">
                {vehicleWashes.length + vehicleLube.length} realizados
              </span>
            </div>
          </div>

          {/* Next oil change maintenance reminder */}
          {nextMaintenanceKm && (
            <div
              style={{ backgroundColor: 'rgba(225, 6, 0, 0.08)', borderColor: 'rgba(225, 6, 0, 0.4)' }}
              className="rounded-lg border p-3.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 style={{ color: '#D71920' }} className="h-5 w-5 shrink-0" />
                <div>
                  <span style={{ color: '#D71920' }} className="text-xs font-bold uppercase tracking-wider block">
                    Próximo Mantenimiento de Aceite
                  </span>
                  <p className="text-xs text-[#A3A3A3]">
                    Programado para los <span className="font-mono font-bold text-white">{nextMaintenanceKm.toLocaleString('es-AR')} km</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewServiceWithPlate(vehicle.plate);
                }}
                style={{ backgroundColor: '#D71920' }}
                className="rounded-md px-3 py-1.5 text-xs font-bold text-white hover:bg-[#E02027] transition"
              >
                + Cargar Servicio
              </button>
            </div>
          )}

          {/* Service history timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <span>Historial Completo del Vehículo</span>
            </h3>

            {vehicleWashes.length === 0 && vehicleLube.length === 0 ? (
              <div
                style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                className="rounded-lg border p-4 text-center text-xs text-[#777777]"
              >
                No hay servicios registrados previamente para este vehículo.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {vehicleLube.map((l) => (
                  <div
                    key={l.id}
                    style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                    className="flex items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="rounded bg-[#181818] p-1.5 text-white border border-[#252627]">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{l.serviceType}</div>
                        <div className="text-[11px] text-[#A3A3A3]">
                          {l.createdAt} · {l.currentKm.toLocaleString('es-AR')} km · {l.productsUsed.map((p) => p.productName).join(', ') || 'Service'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-400">
                        ${l.total.toLocaleString('es-AR')}
                      </span>
                      <span className="block text-[10px] text-[#777777] capitalize">{l.status}</span>
                    </div>
                  </div>
                ))}

                {vehicleWashes.map((w) => (
                  <div
                    key={w.id}
                    style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                    className="flex items-center justify-between rounded-lg border p-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="rounded bg-[#181818] p-1.5 text-[#D71920] border border-[#252627]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{w.serviceName}</div>
                        <div className="text-[11px] text-[#A3A3A3]">{w.createdAt}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-white">
                        ${w.price.toLocaleString('es-AR')}
                      </span>
                      <span className="block text-[10px] text-[#777777] capitalize">{w.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Car, Search, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';
import { LicensePlate } from '../components/LicensePlate';

interface VehiclesViewProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenNewServiceWithPlate: (plate: string) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  onSelectVehicle,
  onOpenNewServiceWithPlate,
}) => {
  const { vehicles, clients, washes, lubeServices, addVehicle } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New vehicle form state
  const [newPlate, setNewPlate] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newClientId, setNewClientId] = useState('');
  const [newKm, setNewKm] = useState<number | ''>('');

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      v.plate.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.clientName.toLowerCase().includes(q)
    );
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const matchedClient = clients.find((c) => c.id === newClientId);

    const created = addVehicle({
      plate: newPlate.trim().toUpperCase(),
      brand: newBrand.trim() || 'General',
      model: newModel.trim() || 'Auto',
      color: newColor.trim() || 'Gris',
      clientId: newClientId || 'c1',
      clientName: matchedClient ? matchedClient.name : 'Cliente Mostrador',
      currentKm: typeof newKm === 'number' ? newKm : undefined,
    });

    setShowAddModal(false);
    setNewPlate('');
    setNewBrand('');
    setNewModel('');
    setNewColor('');
    setNewKm('');
    onSelectVehicle(created);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Car style={{ color: '#D71920' }} className="h-6 w-6" />
            <span>Vehículos</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Flota y parque de automotores atendidos en el taller y lavadero
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#D71920' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/25 transition-all hover:bg-[#E02027] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Vehículo</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por Patente (ej: AB 123 CD), Marca, Modelo o Dueño..."
            style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
            className="w-full rounded-md border py-2 pl-9 pr-3 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden focus:ring-1 focus:ring-[#D71920]/40"
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <div
        style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
        className="overflow-hidden rounded-xl border shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="border-b uppercase font-bold text-[#A3A3A3] text-[11px] tracking-wider"
            >
              <tr>
                <th className="px-4 py-3">Patente</th>
                <th className="px-4 py-3">Marca y Modelo</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Cliente Titular</th>
                <th className="px-4 py-3">Kilometraje</th>
                <th className="px-4 py-3">Último Servicio</th>
                <th className="px-4 py-3 text-center">Servicios</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#252627' }} className="divide-y divide-[#1F1F1F]">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777777] text-xs">
                    No se encontraron vehículos.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const vPlateClean = vehicle.plate.replace(/\s+/g, '');
                  const vWashes = washes.filter((w) => w.plate.replace(/\s+/g, '') === vPlateClean);
                  const vLubes = lubeServices.filter((l) => l.plate.replace(/\s+/g, '') === vPlateClean);
                  const totalCount = vWashes.length + vLubes.length;

                  const allServices = [
                    ...vWashes.map((w) => ({ date: w.createdAt, name: w.serviceName })),
                    ...vLubes.map((l) => ({ date: l.createdAt, name: l.serviceType })),
                  ].sort((a, b) => b.date.localeCompare(a.date));

                  const last = allServices[0];

                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => onSelectVehicle(vehicle)}
                      style={{ backgroundColor: '#151617' }}
                      className="cursor-pointer transition hover:bg-[#181818] group"
                    >
                      {/* Patente */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <LicensePlate plate={vehicle.plate} size="sm" />
                      </td>

                      {/* Marca y Modelo */}
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap group-hover:text-[#D71920] transition">
                        {vehicle.brand} {vehicle.model}
                      </td>

                      {/* Color */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        {vehicle.color}
                      </td>

                      {/* Cliente Titular */}
                      <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">
                        {vehicle.clientName}
                      </td>

                      {/* Km */}
                      <td className="px-4 py-3 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {vehicle.currentKm ? `${vehicle.currentKm.toLocaleString('es-AR')} km` : '—'}
                      </td>

                      {/* Último Servicio */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        {last ? (
                          <div>
                            <span className="font-semibold text-white block">{last.name}</span>
                            <span className="text-[10px] text-[#777777]">{last.date.split(' ')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-[#666666] text-[11px]">—</span>
                        )}
                      </td>

                      {/* Cantidad de servicios */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                          className="rounded border px-2 py-0.5 font-mono font-bold text-white"
                        >
                          {totalCount}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onOpenNewServiceWithPlate(vehicle.plate)}
                            style={{
                              backgroundColor: 'rgba(225, 6, 0, 0.1)',
                              borderColor: 'rgba(225, 6, 0, 0.4)',
                              color: '#E02027',
                            }}
                            className="rounded border px-2.5 py-1 text-[11px] font-bold hover:bg-[#D71920] hover:text-white transition"
                          >
                            + Cargar Servicio
                          </button>
                          <button
                            onClick={() => onSelectVehicle(vehicle)}
                            className="rounded p-1 text-[#666666] group-hover:text-[#D71920] transition"
                          >
                            <ChevronRight className="h-4 w-4" />
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

      {/* Modal Add Vehicle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="w-full max-w-md rounded-xl border p-5 shadow-2xl"
          >
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white mb-4 flex items-center gap-2">
              <Car style={{ color: '#D71920' }} className="h-5 w-5" />
              <span>+ Nuevo Vehículo</span>
            </h2>
            <form onSubmit={handleCreateVehicle} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Patente *
                </label>
                <input
                  type="text"
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                  placeholder="AB 123 CD"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 font-mono text-sm font-bold uppercase text-white focus:border-[#D71920] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Marca *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="Toyota, Ford..."
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    placeholder="Corolla, Ranger..."
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Blanco, Gris..."
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Km Actual
                  </label>
                  <input
                    type="number"
                    value={newKm}
                    onChange={(e) => setNewKm(e.target.value ? Number(e.target.value) : '')}
                    placeholder="75000"
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 font-mono text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Cliente Titular
                </label>
                <select
                  value={newClientId}
                  onChange={(e) => setNewClientId(e.target.value)}
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                >
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ backgroundColor: '#181818', borderColor: '#252627' }}
                  className="flex-1 rounded-md border py-2 text-xs font-semibold text-[#A3A3A3] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#D71920' }}
                  className="flex-1 rounded-md py-2 text-xs font-bold uppercase text-white hover:bg-[#E02027] transition"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

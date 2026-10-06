import React, { useState } from 'react';
import { Users, Search, Plus, Phone, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';

interface ClientsViewProps {
  onSelectClient: (client: Client) => void;
  onSelectPlate: (plate: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  onSelectClient,
}) => {
  const { clients, vehicles, washes, lubeServices, addClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const created = addClient({
      name: newName.trim(),
      phone: newPhone.trim() || 'Sin teléfono',
      notes: newNotes.trim(),
    });
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewNotes('');
    onSelectClient(created);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Users style={{ color: '#D71920' }} className="h-6 w-6" />
            <span>Clientes</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Cartera de clientes, vehículos asociados e historial de facturación
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#D71920' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/25 transition-all hover:bg-[#E02027] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Cliente</span>
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
            placeholder="Buscar por Nombre, Apellido o Teléfono..."
            style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
            className="w-full rounded-md border py-2 pl-9 pr-3 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden focus:ring-1 focus:ring-[#D71920]/40"
          />
        </div>
      </div>

      {/* Clients Table */}
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
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Vehículos</th>
                <th className="px-4 py-3 text-center">Servicios</th>
                <th className="px-4 py-3">Último Servicio</th>
                <th className="px-4 py-3 text-right">Total Gastado</th>
                <th className="px-4 py-3 text-right">Ficha</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#252627' }} className="divide-y divide-[#1F1F1F]">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777] text-xs">
                    No se encontraron clientes con ese criterio.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const clientVehs = vehicles.filter((v) => v.clientId === client.id);
                  const clientWashes = washes.filter((w) => w.clientId === client.id);
                  const clientLubes = lubeServices.filter((l) => l.clientId === client.id);
                  const totalServices = clientWashes.length + clientLubes.length;

                  const spentWashes = clientWashes.reduce((sum, w) => sum + w.price, 0);
                  const spentLubes = clientLubes.reduce((sum, l) => sum + l.total, 0);
                  const totalSpent = spentWashes + spentLubes;

                  const allServices = [
                    ...clientWashes.map((w) => ({ date: w.createdAt, name: w.serviceName })),
                    ...clientLubes.map((l) => ({ date: l.createdAt, name: l.serviceType })),
                  ].sort((a, b) => b.date.localeCompare(a.date));

                  const lastService = allServices[0];

                  return (
                    <tr
                      key={client.id}
                      onClick={() => onSelectClient(client)}
                      style={{ backgroundColor: '#151617' }}
                      className="cursor-pointer transition hover:bg-[#181818] group"
                    >
                      {/* Nombre */}
                      <td className="px-4 py-3 font-bold text-white whitespace-nowrap group-hover:text-[#D71920] transition">
                        {client.name}
                      </td>

                      {/* Teléfono */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-[#666666]" />
                          <span>{client.phone}</span>
                        </div>
                      </td>

                      {/* Vehículos */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {clientVehs.length === 0 ? (
                            <span className="text-[#666666] text-[11px]">—</span>
                          ) : (
                            clientVehs.map((v) => (
                              <span
                                key={v.id}
                                style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                                className="rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white"
                              >
                                {v.plate} ({v.brand})
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Cantidad de servicios */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                          className="rounded border px-2 py-0.5 font-mono font-bold text-white"
                        >
                          {totalServices}
                        </span>
                      </td>

                      {/* Último servicio */}
                      <td className="px-4 py-3 text-[#A3A3A3] whitespace-nowrap">
                        {lastService ? (
                          <div>
                            <span className="text-white font-medium block">
                              {lastService.name}
                            </span>
                            <span className="text-[10px] text-[#777777]">
                              {lastService.date.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#666666]">—</span>
                        )}
                      </td>

                      {/* Total gastado */}
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-right whitespace-nowrap">
                        ${totalSpent.toLocaleString('es-AR')}
                      </td>

                      {/* Ficha */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="rounded p-1 text-[#666666] group-hover:text-[#D71920] transition"
                        >
                          <ChevronRight className="h-4 w-4" />
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

      {/* Add Client Inline Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="w-full max-w-md rounded-xl border p-5 shadow-2xl"
          >
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white mb-4">
              + Nuevo Cliente
            </h2>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Marcelo Gallardo"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="11 6789-0123"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Observaciones
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ej: Cliente de confianza, prefiere cera"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                />
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

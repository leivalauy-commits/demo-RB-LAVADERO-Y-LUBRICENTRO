import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';

interface NewTurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTurnoModal: React.FC<NewTurnoModalProps> = ({ isOpen, onClose }) => {
  const { clients, vehicles, services, addTurno } = useApp();

  const [time, setTime] = useState('11:00');
  const [date, setDate] = useState('2026-10-06');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [serviceName, setServiceName] = useState('Lavado Completo');
  const [category, setCategory] = useState<ServiceCategory>('lavadero');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSelectClient = (cId: string) => {
    const c = clients.find((client) => client.id === cId);
    if (c) {
      setClientName(c.name);
      setClientPhone(c.phone);
      const v = vehicles.find((veh) => veh.clientId === c.id);
      if (v) {
        setPlate(v.plate);
        setVehicleInfo(`${v.brand} ${v.model}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !plate.trim()) {
      alert('Por favor complete el nombre del cliente y la patente');
      return;
    }

    addTurno({
      time,
      date,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || 'Sin teléfono',
      plate: plate.trim().toUpperCase(),
      vehicleInfo: vehicleInfo.trim() || 'Vehículo',
      serviceName,
      category,
      status: 'confirmado',
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="relative w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden"
      >
        <div
          style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
          className="flex items-center justify-between border-b px-5 py-4"
        >
          <div className="flex items-center gap-2">
            <Calendar style={{ color: '#D71920' }} className="h-5 w-5" />
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
              Nuevo Turno en Agenda
            </h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-[#A3A3A3] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Horario
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                {[
                  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                  '12:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00',
                  '16:30', '17:00', '17:30', '18:00',
                ].map((t) => (
                  <option key={t} value={t}>
                    {t} hs
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Cliente
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre y apellido..."
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="flex-1 rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
              />
              <select
                onChange={(e) => handleSelectClient(e.target.value)}
                style={{ backgroundColor: '#181818', borderColor: '#252627' }}
                className="w-36 rounded-md border px-2 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="">O elegir...</option>
                {clients.slice(0, 10).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="11 5566-7788"
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Patente *
              </label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                placeholder="AB 123 CD"
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 font-mono text-xs font-bold uppercase text-white focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Vehículo
              </label>
              <input
                type="text"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="Ej: Ford Ranger"
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Área
              </label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ServiceCategory;
                  setCategory(cat);
                  const firstServ = services.find((s) => s.category === cat);
                  if (firstServ) setServiceName(firstServ.name);
                }}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="lavadero">Lavadero</option>
                <option value="lubricentro">Lubricentro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Servicio Solicitado
            </label>
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
            >
              {services
                .filter((s) => s.category === category)
                .map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} (${s.price.toLocaleString('es-AR')})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#777777] block mb-1">
              Notas adicionales
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Avisar por WhatsApp antes de empezar"
              style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              style={{ backgroundColor: '#D71920' }}
              className="w-full rounded-md py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#E02027] transition shadow-md shadow-[#D71920]/25"
            >
              Agendar Turno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

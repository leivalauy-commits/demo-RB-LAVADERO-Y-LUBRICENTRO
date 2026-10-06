import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, WashStatus } from '../../types';

interface NewServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlate?: string;
}

export const NewServiceModal: React.FC<NewServiceModalProps> = ({
  isOpen,
  onClose,
  initialPlate = '',
}) => {
  const { clients, vehicles, services, addWashService, addLubeService, addClient, addVehicle } = useApp();

  const [isCreatingNewClient, setIsCreatingNewClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientSearchText, setClientSearchText] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');

  const [plate, setPlate] = useState(initialPlate);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [currentKm, setCurrentKm] = useState<number | ''>('');

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customServiceName, setCustomServiceName] = useState('');
  const [price, setPrice] = useState<number>(14000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [status, setStatus] = useState<WashStatus>('en_espera');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialPlate) {
      setPlate(initialPlate);
      const matchedVeh = vehicles.find((v) => v.plate.toUpperCase() === initialPlate.toUpperCase());
      if (matchedVeh) {
        setBrand(matchedVeh.brand);
        setModel(matchedVeh.model);
        setColor(matchedVeh.color);
        setSelectedClientId(matchedVeh.clientId);
        setCurrentKm(matchedVeh.currentKm || '');
      }
    }
  }, [initialPlate, vehicles]);

  useEffect(() => {
    if (selectedClientId && !plate) {
      const clientVehicles = vehicles.filter((v) => v.clientId === selectedClientId);
      if (clientVehicles.length > 0) {
        const v = clientVehicles[0];
        setPlate(v.plate);
        setBrand(v.brand);
        setModel(v.model);
        setColor(v.color);
        setCurrentKm(v.currentKm || '');
      }
    }
  }, [selectedClientId, plate, vehicles]);

  const handleSelectService = (servId: string) => {
    setSelectedServiceId(servId);
    const s = services.find((srv) => srv.id === servId);
    if (s) {
      setPrice(s.price);
      setCustomServiceName(s.name);
    }
  };

  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      const defaultServ = services.find((s) => s.name.includes('Completo')) || services[0];
      setSelectedServiceId(defaultServ.id);
      setPrice(defaultServ.price);
      setCustomServiceName(defaultServ.name);
    }
  }, [services, selectedServiceId]);

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(clientSearchText.toLowerCase()) ||
      c.phone.includes(clientSearchText)
  );

  const handlePlateChange = (val: string) => {
    const formatted = val.toUpperCase();
    setPlate(formatted);
    const existing = vehicles.find((v) => v.plate.replace(/\s+/g, '') === formatted.replace(/\s+/g, ''));
    if (existing) {
      setBrand(existing.brand);
      setModel(existing.model);
      setColor(existing.color);
      setSelectedClientId(existing.clientId);
      if (existing.currentKm) setCurrentKm(existing.currentKm);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!plate.trim()) {
      alert('Por favor ingrese la patente del vehículo');
      return;
    }

    let finalClientId = selectedClientId;
    let finalClientName = '';

    if (isCreatingNewClient) {
      if (!newClientName.trim()) {
        alert('Ingrese el nombre del nuevo cliente');
        return;
      }
      const createdClient = addClient({
        name: newClientName.trim(),
        phone: newClientPhone.trim() || 'Sin teléfono',
      });
      finalClientId = createdClient.id;
      finalClientName = createdClient.name;
    } else {
      const existingClient = clients.find((c) => c.id === selectedClientId);
      if (existingClient) {
        finalClientName = existingClient.name;
      } else {
        finalClientName = clientSearchText.trim() || 'Cliente Particular';
      }
    }

    let matchedVehicle = vehicles.find((v) => v.plate.toUpperCase() === plate.trim().toUpperCase());
    let finalVehicleId = matchedVehicle ? matchedVehicle.id : '';

    if (!matchedVehicle) {
      const newVeh = addVehicle({
        plate: plate.trim().toUpperCase(),
        brand: brand.trim() || 'General',
        model: model.trim() || 'Vehículo',
        color: color.trim() || 'No especificado',
        clientId: finalClientId || 'c1',
        clientName: finalClientName,
        currentKm: typeof currentKm === 'number' ? currentKm : undefined,
      });
      finalVehicleId = newVeh.id;
      matchedVehicle = newVeh;
    }

    const selectedServiceObj = services.find((s) => s.id === selectedServiceId);
    const serviceCategory = selectedServiceObj ? selectedServiceObj.category : 'lavadero';
    const vehicleInfo = `${brand || matchedVehicle.brand} ${model || matchedVehicle.model} (${color || matchedVehicle.color || 'Gris'})`;

    if (serviceCategory === 'lubricentro' || customServiceName.toLowerCase().includes('aceite') || customServiceName.toLowerCase().includes('filtro')) {
      addLubeService({
        clientId: finalClientId || 'c1',
        clientName: finalClientName,
        vehicleId: finalVehicleId,
        plate: plate.trim().toUpperCase(),
        vehicleInfo,
        currentKm: typeof currentKm === 'number' ? currentKm : (matchedVehicle.currentKm || 50000),
        serviceType: customServiceName || 'Service de Lubricentro',
        productsUsed: [],
        laborPrice: price,
        productsTotal: 0,
        total: price,
        paymentMethod,
        status,
        nextMaintenanceKm: (typeof currentKm === 'number' ? currentKm : 50000) + 10000,
        notes: notes.trim(),
      });
    } else {
      addWashService({
        clientId: finalClientId || 'c1',
        clientName: finalClientName,
        vehicleId: finalVehicleId,
        plate: plate.trim().toUpperCase(),
        vehicleInfo,
        serviceId: selectedServiceId || 's2',
        serviceName: customServiceName || 'Lavado Completo',
        price,
        paymentMethod,
        status,
        notes: notes.trim(),
      });
    }

    setSuccessMsg(`¡Servicio registrado exitosamente para ${plate}!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
      setPlate('');
      setBrand('');
      setModel('');
      setColor('');
      setNotes('');
      setIsCreatingNewClient(false);
      setNewClientName('');
      setNewClientPhone('');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border shadow-2xl"
      >
        {/* Header */}
        <div
          style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#E10600' }}
              className="flex h-8 w-8 items-center justify-center rounded-md font-black text-white"
            >
              +
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
                Nuevo Servicio Rápido
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Registro de mostrador para Lavadero y Lubricentro
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#A3A3A3] hover:bg-[#181818] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg && (
          <div className="m-4 flex items-center gap-2 rounded-md bg-[#042111] border border-emerald-500 p-3 text-xs font-semibold text-emerald-300">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* PASO 1: CLIENTE */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
            className="rounded-lg border p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label style={{ color: '#E10600' }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Cliente</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingNewClient(!isCreatingNewClient)}
                style={{ color: '#E10600' }}
                className="text-xs font-semibold hover:text-[#FF1A1A] flex items-center gap-1"
              >
                {isCreatingNewClient ? '← Seleccionar existente' : '+ Nuevo Cliente'}
              </button>
            </div>

            {isCreatingNewClient ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej: Marcos Ramos"
                    style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="Ej: 11 3344-5566"
                    style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={clientSearchText}
                  onChange={(e) => setClientSearchText(e.target.value)}
                  placeholder="Escriba para buscar cliente o teléfono..."
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                  {filteredClients.slice(0, 8).map((client) => {
                    const isSelected = selectedClientId === client.id;
                    return (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setClientSearchText(client.name);
                        }}
                        style={
                          isSelected
                            ? { backgroundColor: '#E10600', color: '#FFFFFF' }
                            : { backgroundColor: '#141414', color: '#A3A3A3', borderColor: '#242424' }
                        }
                        className="rounded-md border px-2.5 py-1 text-xs font-medium transition hover:text-white"
                      >
                        {client.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PASO 2: VEHÍCULO */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
            className="rounded-lg border p-3.5 space-y-3"
          >
            <label style={{ color: '#E10600' }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>2. Vehículo</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Patente *
                </label>
                <input
                  type="text"
                  required
                  value={plate}
                  onChange={(e) => handlePlateChange(e.target.value)}
                  placeholder="AB 123 CD"
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Marca
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Toyota, Ford..."
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Modelo
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Corolla, Ranger..."
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Blanco, Negro..."
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#777777] block mb-1">
                Kilometraje actual (opcional)
              </label>
              <input
                type="number"
                value={currentKm}
                onChange={(e) => setCurrentKm(e.target.value ? Number(e.target.value) : '')}
                placeholder="Ej: 85000"
                style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                className="w-48 rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
              />
            </div>
          </div>

          {/* PASO 3: TIPO DE SERVICIO Y PRECIO */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
            className="rounded-lg border p-3.5 space-y-3"
          >
            <label style={{ color: '#E10600' }} className="text-xs font-bold uppercase tracking-wider block">
              3. Tipo de Servicio
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {services.map((s) => {
                const isSelected = selectedServiceId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectService(s.id)}
                    style={
                      isSelected
                        ? {
                            backgroundColor: 'rgba(225, 6, 0, 0.15)',
                            borderColor: '#E10600',
                          }
                        : {
                            backgroundColor: '#111111',
                            borderColor: '#242424',
                          }
                    }
                    className="flex flex-col items-start rounded-md border p-2.5 text-left transition hover:border-[#383838]"
                  >
                    <span className="text-xs font-bold truncate w-full text-white">{s.name}</span>
                    <span style={{ color: '#E10600' }} className="text-[11px] font-semibold mt-1">
                      ${s.price.toLocaleString('es-AR')}
                    </span>
                    <span className="text-[10px] text-[#777777] uppercase mt-0.5">
                      {s.category}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Nombre de Servicio / Detalle
                </label>
                <input
                  type="text"
                  value={customServiceName}
                  onChange={(e) => setCustomServiceName(e.target.value)}
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Precio Final ($ ARS) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-1.5 font-mono text-sm font-bold text-emerald-400 focus:border-[#E10600] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* PASO 4: FORMA DE PAGO Y ESTADO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Forma de pago */}
            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
              className="rounded-lg border p-3.5 space-y-2"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-white block">
                Forma de Pago
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['efectivo', 'transferencia', 'tarjeta', 'pendiente'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    style={
                      paymentMethod === m
                        ? { backgroundColor: '#E10600', color: '#FFFFFF' }
                        : { backgroundColor: '#111111', borderColor: '#242424', color: '#A3A3A3' }
                    }
                    className="rounded-md border py-2 text-xs font-semibold capitalize transition hover:text-white"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div
              style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
              className="rounded-lg border p-3.5 space-y-2"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-white block">
                Estado Inicial
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('en_espera')}
                  style={
                    status === 'en_espera'
                      ? { backgroundColor: '#1C1500', borderColor: '#EAB308', color: '#FDE047' }
                      : { backgroundColor: '#111111', borderColor: '#242424', color: '#A3A3A3' }
                  }
                  className="rounded-md border py-2 text-xs font-bold transition"
                >
                  🟡 EN ESPERA
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('en_proceso')}
                  style={
                    status === 'en_proceso'
                      ? { backgroundColor: '#051C2C', borderColor: '#0284C7', color: '#7DD3FC' }
                      : { backgroundColor: '#111111', borderColor: '#242424', color: '#A3A3A3' }
                  }
                  className="rounded-md border py-2 text-xs font-bold transition"
                >
                  🔵 EN PROCESO
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('terminado')}
                  style={
                    status === 'terminado'
                      ? { backgroundColor: '#042111', borderColor: '#16A34A', color: '#86EFAC' }
                      : { backgroundColor: '#111111', borderColor: '#242424', color: '#A3A3A3' }
                  }
                  className="rounded-md border py-2 text-xs font-bold transition"
                >
                  🟢 TERMINADO
                </button>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="text-[11px] font-semibold text-[#777777] block mb-1">
              Observaciones (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Aspirar baúl a fondo..."
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-1.5 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              style={{ backgroundColor: '#E10600' }}
              className="flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#E10600]/30 transition hover:bg-[#FF1A1A] active:scale-99"
            >
              <span>REGISTRAR SERVICIO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

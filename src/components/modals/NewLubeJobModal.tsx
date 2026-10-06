import React, { useState } from 'react';
import { X, Wrench, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LubeProductUsage, PaymentMethod, WashStatus } from '../../types';

interface NewLubeJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLubeJobModal: React.FC<NewLubeJobModalProps> = ({ isOpen, onClose }) => {
  const { clients, vehicles, products, addLubeService } = useApp();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [currentKm, setCurrentKm] = useState<number>(80000);
  const [serviceType, setServiceType] = useState('Cambio de Aceite y Filtro');
  const [laborPrice, setLaborPrice] = useState<number>(18000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');
  const [status, setStatus] = useState<WashStatus>('en_espera');
  const [notes, setNotes] = useState('');

  const [usedProducts, setUsedProducts] = useState<LubeProductUsage[]>([
    { productId: 'p1', productName: 'Aceite Motul 8100 5W40 (4L)', quantity: 1, unitPrice: 42000, subtotal: 42000 },
    { productId: 'p4', productName: 'Filtro de Aceite Mann W712', quantity: 1, unitPrice: 11000, subtotal: 11000 },
  ]);

  if (!isOpen) return null;

  const handleSelectClient = (cId: string) => {
    setSelectedClientId(cId);
    const c = clients.find((client) => client.id === cId);
    const v = vehicles.find((veh) => veh.clientId === cId);
    if (v) {
      setPlate(v.plate);
      setVehicleInfo(`${v.brand} ${v.model}`);
      if (v.currentKm) setCurrentKm(v.currentKm);
    }
  };

  const handleAddProduct = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    if (!prod) return;

    setUsedProducts((prev) => {
      const exists = prev.find((item) => item.productId === prodId);
      if (exists) {
        return prev.map((item) =>
          item.productId === prodId
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unitPrice }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          quantity: 1,
          unitPrice: prod.price,
          subtotal: prod.price,
        },
      ];
    });
  };

  const handleRemoveProduct = (prodId: string) => {
    setUsedProducts((prev) => prev.filter((p) => p.productId !== prodId));
  };

  const productsTotal = usedProducts.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = laborPrice + productsTotal;
  const nextMaintenanceKm = currentKm + 10000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) {
      alert('Por favor ingrese la patente');
      return;
    }

    const c = clients.find((client) => client.id === selectedClientId);
    const clientName = c ? c.name : 'Cliente Mostrador';
    const veh = vehicles.find((v) => v.plate.toUpperCase() === plate.toUpperCase());

    addLubeService({
      clientId: selectedClientId || 'c1',
      clientName,
      vehicleId: veh ? veh.id : 'v1',
      plate: plate.toUpperCase(),
      vehicleInfo: vehicleInfo || 'Vehículo',
      currentKm,
      serviceType,
      productsUsed: usedProducts,
      laborPrice,
      productsTotal,
      total: grandTotal,
      paymentMethod,
      status,
      nextMaintenanceKm,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-xl border shadow-2xl"
      >
        <div
          style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#D71920' }}
              className="flex h-8 w-8 items-center justify-center rounded-md font-bold text-white"
            >
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
                Nuevo Trabajo de Lubricentro
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Cambio de aceite, filtros y control de mantenimiento
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[#A3A3A3] hover:bg-[#181818] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Cliente y Vehículo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Cliente
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => handleSelectClient(e.target.value)}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Vehículo
              </label>
              <input
                type="text"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="Ej: Ford Ranger XLT"
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Kilometraje Actual *
              </label>
              <input
                type="number"
                required
                value={currentKm}
                onChange={(e) => setCurrentKm(Number(e.target.value))}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 font-mono text-xs font-bold text-sky-400 focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Próximo Mantenimiento
              </label>
              <div
                style={{ backgroundColor: '#141414', borderColor: '#252627' }}
                className="rounded-md border px-3 py-1.5 font-mono text-xs font-bold text-white"
              >
                {nextMaintenanceKm.toLocaleString('es-AR')} km (+10.000)
              </div>
            </div>
          </div>

          {/* Tipo de Trabajo */}
          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Servicio Realizado
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
            >
              <option value="Cambio de Aceite y Filtro">Cambio de Aceite y Filtro</option>
              <option value="Service Completo 10.000 km">Service Completo 10.000 km</option>
              <option value="Cambio de Aceite + Filtro de Aire y Combustible">Cambio de Aceite + Filtro de Aire y Combustible</option>
              <option value="Revisión y Cambio de Fluidos">Revisión y Cambio de Fluidos</option>
              <option value="Cambio de Líquido Refrigerante">Cambio de Líquido Refrigerante</option>
              <option value="Otro Mantenimiento Rápido">Otro Mantenimiento Rápido</option>
            </select>
          </div>

          {/* Insumos Utilizados */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="rounded-lg border p-3.5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <label style={{ color: '#D71920' }} className="text-xs font-bold uppercase tracking-wider">
                Productos / Insumos Utilizados
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddProduct(e.target.value);
                    e.target.value = '';
                  }
                }}
                style={{ backgroundColor: '#181818', borderColor: '#252627' }}
                className="rounded-md border px-2.5 py-1 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="">+ Agregar Producto...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price.toLocaleString('es-AR')} - Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            {usedProducts.length === 0 ? (
              <div className="text-xs text-[#777777] py-2 text-center">
                No hay productos agregados (solo mano de obra)
              </div>
            ) : (
              <div className="space-y-1.5">
                {usedProducts.map((item) => (
                  <div
                    key={item.productId}
                    style={{ backgroundColor: '#151617' }}
                    className="flex items-center justify-between rounded px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-white truncate">{item.productName}</span>
                      <span className="text-[11px] text-[#A3A3A3]">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-bold text-white">
                        ${item.subtotal.toLocaleString('es-AR')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(item.productId)}
                        className="text-[#666666] hover:text-[#E02027]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Precios y Liquidación */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg border p-3.5"
          >
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Mano de Obra ($)
              </label>
              <input
                type="number"
                value={laborPrice}
                onChange={(e) => setLaborPrice(Number(e.target.value))}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 font-mono text-xs font-bold text-white focus:border-[#D71920] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Subtotal Insumos ($)
              </label>
              <div
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="rounded-md border px-3 py-1.5 font-mono text-xs text-white"
              >
                ${productsTotal.toLocaleString('es-AR')}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-white block mb-1">
                TOTAL FINAL ($)
              </label>
              <div
                style={{ backgroundColor: '#141414', borderColor: 'rgba(225, 6, 0, 0.4)' }}
                className="rounded-md border px-3 py-1.5 font-mono text-sm font-black text-white"
              >
                ${grandTotal.toLocaleString('es-AR')}
              </div>
            </div>
          </div>

          {/* Pago y Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Forma de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white capitalize focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WashStatus)}
                style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                className="w-full rounded-md border px-3 py-1.5 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
              >
                <option value="en_espera">En espera</option>
                <option value="en_proceso">En proceso</option>
                <option value="terminado">Terminado</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              style={{ backgroundColor: '#D71920' }}
              className="w-full rounded-md py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#E02027] transition shadow-md shadow-[#D71920]/25"
            >
              Registrar Trabajo de Lubricentro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

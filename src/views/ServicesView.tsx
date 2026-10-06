import React, { useState } from 'react';
import { SprayCan, Plus, Edit2, Trash2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ServiceItem, ServiceCategory } from '../types';

export const ServicesView: React.FC = () => {
  const { services, addServiceItem, updateServiceItem, toggleServiceActive, deleteServiceItem } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategory>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('lavadero');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(15000);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);

  const filteredServices = services.filter((s) =>
    selectedCategory === 'all' ? true : s.category === selectedCategory
  );

  const handleOpenEdit = (serv: ServiceItem) => {
    setEditingService(serv);
    setName(serv.name);
    setCategory(serv.category);
    setDescription(serv.description);
    setPrice(serv.price);
    setDurationMinutes(serv.durationMinutes);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateServiceItem({
        ...editingService,
        name: name.trim(),
        category,
        description: description.trim(),
        price,
        durationMinutes,
      });
    } else {
      addServiceItem({
        name: name.trim(),
        category,
        description: description.trim(),
        price,
        durationMinutes,
        active: true,
      });
    }

    setShowAddModal(false);
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(15000);
    setDurationMinutes(45);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <SprayCan style={{ color: '#E10600' }} className="h-6 w-6" />
            <span>Servicios</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Administración de precios, catálogo de lavados y lubricentro
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService(null);
            setName('');
            setDescription('');
            setPrice(15000);
            setDurationMinutes(45);
            setShowAddModal(true);
          }}
          style={{ backgroundColor: '#E10600' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Servicio</span>
        </button>
      </div>

      {/* Category Segmented Selector */}
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="flex items-center gap-2 rounded-xl border p-2"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          style={selectedCategory === 'all' ? { backgroundColor: '#E10600', color: '#FFFFFF' } : undefined}
          className={`rounded-md px-4 py-2 text-xs font-bold transition ${
            selectedCategory === 'all' ? 'font-black' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          TODOS LOS SERVICIOS ({services.length})
        </button>
        <button
          onClick={() => setSelectedCategory('lavadero')}
          style={selectedCategory === 'lavadero' ? { backgroundColor: '#E10600', color: '#FFFFFF' } : undefined}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase transition ${
            selectedCategory === 'lavadero' ? 'font-black' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          🧽 LAVADERO ({services.filter((s) => s.category === 'lavadero').length})
        </button>
        <button
          onClick={() => setSelectedCategory('lubricentro')}
          style={selectedCategory === 'lubricentro' ? { backgroundColor: '#E10600', color: '#FFFFFF' } : undefined}
          className={`rounded-md px-4 py-2 text-xs font-bold uppercase transition ${
            selectedCategory === 'lubricentro' ? 'font-black' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          🔧 LUBRICENTRO ({services.filter((s) => s.category === 'lubricentro').length})
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            style={{
              backgroundColor: service.active ? '#111111' : '#0B0B0B',
              borderColor: '#242424',
            }}
            className={`flex flex-col justify-between rounded-xl border p-5 transition shadow-sm ${
              service.active ? 'hover:border-[#383838]' : 'opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  style={{ backgroundColor: '#0B0B0B', borderColor: '#242424' }}
                  className="rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                >
                  {service.category}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                    service.active ? 'text-emerald-400' : 'text-[#666666]'
                  }`}
                >
                  {service.active ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Activo</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Inactivo</span>
                    </>
                  )}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white mt-1">
                {service.name}
              </h3>
              <p className="text-xs text-[#A3A3A3] mt-1 line-clamp-2">
                {service.description || 'Sin descripción adicional'}
              </p>

              <div style={{ borderColor: '#1F1F1F' }} className="mt-4 flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3]">
                  <Clock className="h-3.5 w-3.5 text-[#666666]" />
                  <span>~{service.durationMinutes} min</span>
                </div>
                <div className="font-mono text-lg font-black text-white">
                  ${service.price.toLocaleString('es-AR')}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ borderColor: '#1F1F1F' }} className="mt-4 flex items-center justify-end gap-2 border-t pt-3">
              <button
                onClick={() => toggleServiceActive(service.id)}
                style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                className="rounded border px-2.5 py-1 text-xs font-semibold text-[#A3A3A3] hover:text-white transition"
              >
                {service.active ? 'Desactivar' : 'Activar'}
              </button>
              <button
                onClick={() => handleOpenEdit(service)}
                style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                className="rounded border p-1.5 text-[#A3A3A3] hover:text-white transition"
                title="Editar servicio"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`¿Eliminar el servicio "${service.name}"?`)) {
                    deleteServiceItem(service.id);
                  }
                }}
                style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                className="rounded border p-1.5 text-[#666666] hover:text-[#FF1A1A] transition"
                title="Eliminar servicio"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Service */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#111111', borderColor: '#242424' }}
            className="w-full max-w-md rounded-xl border p-5 shadow-2xl"
          >
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white mb-4">
              {editingService ? 'Editar Servicio' : '+ Nuevo Servicio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Lavado + Cera Premium"
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                    style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white uppercase focus:border-[#E10600] focus:outline-hidden"
                  >
                    <option value="lavadero">Lavadero</option>
                    <option value="lubricentro">Lubricentro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Duración Estimada (min)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white font-mono focus:border-[#E10600] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Precio al Público ($ ARS) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 font-mono text-sm font-bold text-emerald-400 focus:border-[#E10600] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Descripción del Trabajo
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles incluidos en el servicio..."
                  style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ backgroundColor: '#181818', borderColor: '#242424' }}
                  className="flex-1 rounded-md border py-2 text-xs font-semibold text-[#A3A3A3] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#E10600' }}
                  className="flex-1 rounded-md py-2 text-xs font-bold uppercase text-white hover:bg-[#FF1A1A] transition"
                >
                  {editingService ? 'Guardar Cambios' : 'Crear Servicio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

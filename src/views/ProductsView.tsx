import React, { useState } from 'react';
import { Package, Search, Plus, AlertTriangle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductsView: React.FC = () => {
  const { products, addProduct, adjustStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'aceite' | 'filtro' | 'fluido' | 'detailing' | 'insumo'>('aceite');
  const [price, setPrice] = useState<number>(35000);
  const [cost, setCost] = useState<number>(22000);
  const [stock, setStock] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(5);
  const [unit, setUnit] = useState('Bidón 4L');

  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.unit.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name: name.trim(),
      category,
      price,
      cost,
      stock,
      minStock,
      unit: unit.trim() || 'Unidad',
    });

    setShowAddModal(false);
    setName('');
    setPrice(35000);
    setCost(22000);
    setStock(10);
    setMinStock(5);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Package style={{ color: '#D71920' }} className="h-6 w-6" />
            <span>Productos e Insumos</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Control de stock de aceites, filtros, químicos de detailing y repuestos
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{ backgroundColor: '#D71920' }}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/25 transition-all hover:bg-[#E02027] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>+ Nuevo Producto</span>
        </button>
      </div>

      {/* Stock Alert Banner if any items below min */}
      {lowStockProducts.length > 0 && (
        <div
          style={{ backgroundColor: 'rgba(225, 6, 0, 0.08)', borderColor: 'rgba(225, 6, 0, 0.35)' }}
          className="rounded-xl border p-4 space-y-2"
        >
          <div className="flex items-center gap-2 text-[#E02027] font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 text-[#D71920]" />
            <span>⚠️ ALERTA DE STOCK BAJO ({lowStockProducts.length} productos para reponer)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {lowStockProducts.map((lp) => (
              <div
                key={lp.id}
                style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-bold text-white block truncate">{lp.name}</span>
                  <span className="text-[11px] text-[#E02027] font-mono">
                    Stock: {lp.stock} (Mínimo: {lp.minStock})
                  </span>
                </div>
                <button
                  onClick={() => adjustStock(lp.id, 5)}
                  style={{ backgroundColor: '#D71920' }}
                  className="rounded px-2 py-1 text-[10px] font-bold text-white hover:bg-[#E02027] transition"
                >
                  +5 Reponer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Category Filter */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border p-4"
      >
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'aceite', label: 'Aceites' },
            { id: 'filtro', label: 'Filtros' },
            { id: 'fluido', label: 'Fluidos' },
            { id: 'detailing', label: 'Detailing' },
            { id: 'insumo', label: 'Insumos' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={
                selectedCategory === cat.id
                  ? { backgroundColor: '#D71920', color: '#FFFFFF' }
                  : { backgroundColor: '#0B0B0B', borderColor: '#252627', color: '#A3A3A3' }
              }
              className="rounded-md px-3 py-1.5 text-xs font-bold transition border hover:text-white"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar producto o envase..."
            style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
            className="w-full rounded-md border py-2 pl-9 pr-3 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden focus:ring-1 focus:ring-[#D71920]/40"
          />
        </div>
      </div>

      {/* Products Table */}
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
                <th className="px-4 py-3">Producto / Presentación</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3 text-right">Costo</th>
                <th className="px-4 py-3 text-right">Precio Venta</th>
                <th className="px-4 py-3 text-center">Stock Actual</th>
                <th className="px-4 py-3 text-center">Stock Mínimo</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#252627' }} className="divide-y divide-[#1F1F1F]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777777] text-xs">
                    No se encontraron productos en esta categoría.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isLow = prod.stock <= prod.minStock;
                  return (
                    <tr
                      key={prod.id}
                      style={{ backgroundColor: '#151617' }}
                      className="transition hover:bg-[#181818]"
                    >
                      {/* Nombre y presentación */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-white block">{prod.name}</span>
                        <span className="text-[10px] text-[#A3A3A3]">{prod.unit}</span>
                      </td>

                      {/* Categoría */}
                      <td className="px-4 py-3 whitespace-nowrap capitalize text-[#A3A3A3]">
                        {prod.category}
                      </td>

                      {/* Costo */}
                      <td className="px-4 py-3 font-mono text-[#A3A3A3] text-right whitespace-nowrap">
                        ${prod.cost.toLocaleString('es-AR')}
                      </td>

                      {/* Precio */}
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-right whitespace-nowrap">
                        ${prod.price.toLocaleString('es-AR')}
                      </td>

                      {/* Stock Actual */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          style={
                            isLow
                              ? { backgroundColor: 'rgba(225, 6, 0, 0.2)', borderColor: '#D71920', color: '#E02027' }
                              : { backgroundColor: '#0B0B0B', borderColor: '#252627', color: '#FFFFFF' }
                          }
                          className="inline-block rounded border px-2.5 py-0.5 font-mono text-xs font-bold"
                        >
                          {prod.stock}
                        </span>
                      </td>

                      {/* Stock Mínimo */}
                      <td className="px-4 py-3 font-mono text-[#A3A3A3] text-center whitespace-nowrap">
                        {prod.minStock}
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E02027]">
                            <AlertTriangle className="h-3 w-3 text-[#D71920]" />
                            <span>STOCK BAJO</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <Check className="h-3 w-3" />
                            <span>Normal</span>
                          </span>
                        )}
                      </td>

                      {/* Quick adjust */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => adjustStock(prod.id, -1)}
                            style={{ backgroundColor: '#181818', borderColor: '#252627' }}
                            className="rounded border px-2 py-1 text-white hover:bg-[#252525] font-bold"
                            title="Restar 1 unidad"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => adjustStock(prod.id, 1)}
                            style={{ backgroundColor: '#181818', borderColor: '#252627' }}
                            className="rounded border px-2 py-1 text-white hover:bg-[#252525] font-bold"
                            title="Sumar 1 unidad"
                          >
                            +1
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

      {/* Modal Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="w-full max-w-md rounded-xl border p-5 shadow-2xl"
          >
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white mb-4">
              + Nuevo Producto / Insumo
            </h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Aceite Castrol Magnatec 10W40 (4L)"
                  style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                  className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                  >
                    <option value="aceite">Aceite</option>
                    <option value="filtro">Filtro</option>
                    <option value="fluido">Fluido</option>
                    <option value="detailing">Detailing</option>
                    <option value="insumo">Insumo</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Presentación / Unidad
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Bidón 4L, Unidad..."
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Precio Costo ($)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 font-mono text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Precio Venta ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 font-mono text-xs font-bold text-emerald-400 focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Stock Inicial
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 font-mono text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
                    Stock Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    style={{ backgroundColor: '#0B0B0C', borderColor: '#292929' }}
                    className="w-full rounded-md border px-3 py-2 font-mono text-xs text-white focus:border-[#D71920] focus:outline-hidden"
                  />
                </div>
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
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

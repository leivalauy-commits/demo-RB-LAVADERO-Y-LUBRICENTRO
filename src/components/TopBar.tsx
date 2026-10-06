import React, { useState } from 'react';
import {
  Menu,
  Search,
  Plus,
  CalendarPlus,
  Sparkles,
  Wrench,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenNewService: () => void;
  onOpenNewTurno: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectVehiclePlate: (plate: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenNewService,
  onOpenNewTurno,
  onSelectTab,
  onSelectVehiclePlate,
}) => {
  const { washes, lubeServices, vehicles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const activeWashes = washes.filter((w) => w.status === 'en_proceso').length;
  const waitingWashes = washes.filter((w) => w.status === 'en_espera').length;
  const activeLube = lubeServices.filter((l) => l.status === 'en_proceso').length;

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Panel Principal';
      case 'washes':
        return 'Control de Lavados';
      case 'turnos':
        return 'Agenda de Turnos';
      case 'vehicles':
        return 'Parque de Vehículos';
      case 'clients':
        return 'Cartera de Clientes';
      case 'lube':
        return 'Taller de Lubricentro';
      case 'services':
        return 'Catálogo de Servicios';
      case 'products':
        return 'Inventario de Insumos y Repuestos';
      case 'cash':
        return 'Flujo de Caja y Arqueo';
      case 'reports':
        return 'Estadísticas y Reportes';
      case 'settings':
        return 'Ajustes del Sistema';
    }
  };

  const filteredVehicles = searchQuery.trim()
    ? vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header
      style={{ backgroundColor: '#101010', borderColor: '#242424' }}
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:px-6 backdrop-blur-md"
    >
      {/* Zone 1: Mobile toggle & Breadcrumb title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          style={{ backgroundColor: '#181818', borderColor: '#242424' }}
          className="rounded-md border p-2 text-[#A3A3A3] hover:text-white md:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col">
          <span style={{ color: '#E10600' }} className="text-xs font-bold uppercase tracking-wider">
            R.B. Gestión
          </span>
          <span className="text-sm font-bold text-white md:text-base">
            {getTabTitle(currentTab)}
          </span>
        </div>
      </div>

      {/* Zone 2: Fast Search Bar */}
      <div className="relative hidden lg:block w-72 xl:w-96">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#777777]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Buscar por Patente (ej: AB 123 CD) o Cliente..."
            style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
            className="w-full rounded-md border py-2 pl-9 pr-4 text-xs text-white placeholder-[#777777] transition focus:border-[#E10600] focus:outline-hidden focus:ring-1 focus:ring-[#E10600]/40"
          />
        </div>

        {/* Dropdown Quick Search Results */}
        {showSearchResults && searchQuery.trim().length > 1 && (
          <div
            style={{ backgroundColor: '#111111', borderColor: '#242424' }}
            className="absolute left-0 right-0 top-full mt-1.5 rounded-md border shadow-2xl overflow-hidden z-50"
          >
            <div
              style={{ borderColor: '#242424' }}
              className="border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A3A3A3]"
            >
              Coincidencias de vehículos ({filteredVehicles.length})
            </div>
            {filteredVehicles.length === 0 ? (
              <div className="p-3 text-xs text-[#777777]">No se encontraron vehículos</div>
            ) : (
              <div className="divide-y divide-[#242424]">
                {filteredVehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelectVehiclePlate(v.plate);
                      setShowSearchResults(false);
                      setSearchQuery('');
                      onSelectTab('vehicles');
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-[#181818] transition"
                  >
                    <div>
                      <span style={{ color: '#E10600' }} className="font-mono font-bold mr-2">
                        {v.plate}
                      </span>
                      <span className="text-white">
                        {v.brand} {v.model}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#A3A3A3]">{v.clientName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Workshop Quick Status Counters + Action Buttons */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Active Workshop Status Indicator */}
        <div
          style={{ backgroundColor: '#111111', borderColor: '#242424' }}
          className="hidden sm:flex items-center gap-3 rounded-md border px-3 py-1.5 text-xs"
        >
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold" title="Lavados en pista">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-white">{activeWashes}</span>
            <span className="text-[#A3A3A3]">en lavado</span>
          </div>
          <span className="text-[#333333]">|</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold" title="En espera">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-white">{waitingWashes}</span>
            <span className="text-[#A3A3A3]">en espera</span>
          </div>
          <span className="text-[#333333]">|</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold" title="En lubricentro">
            <Wrench className="h-3.5 w-3.5" />
            <span className="text-white">{activeLube}</span>
            <span className="text-[#A3A3A3]">en taller</span>
          </div>
        </div>

        {/* Turno Button */}
        <button
          onClick={onOpenNewTurno}
          style={{ backgroundColor: '#181818', borderColor: '#242424' }}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#202020] hover:border-[#333333]"
        >
          <CalendarPlus style={{ color: '#E10600' }} className="h-4 w-4" />
          <span>+ Turno</span>
        </button>

        {/* New Service Primary CTA */}
        <button
          onClick={onOpenNewService}
          style={{ backgroundColor: '#E10600' }}
          className="inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span className="hidden xs:inline">Nuevo Servicio</span>
          <span className="xs:hidden">Nuevo</span>
        </button>
      </div>
    </header>
  );
};

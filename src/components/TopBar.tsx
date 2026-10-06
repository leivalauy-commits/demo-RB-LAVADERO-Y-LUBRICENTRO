import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Sparkles,
  Wrench,
  Clock,
  LogOut,
  User as UserIcon,
  ChevronDown,
  X,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { NavTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavTab;
  onOpenMobileMenu: () => void;
  onOpenNewService: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectVehiclePlate: (plate: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onOpenNewService,
  onSelectTab,
  onSelectVehiclePlate,
}) => {
  const { washes, lubeServices, vehicles } = useApp();
  const { currentUser, role, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeWashes = washes.filter((w) => w.status === 'en_proceso').length;
  const waitingWashes = washes.filter((w) => w.status === 'en_espera').length;
  const activeLube = lubeServices.filter((l) => l.status === 'en_proceso').length;

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Inicio';
      case 'washes':
        return 'Lavados';
      case 'turnos':
        return 'Turnos';
      case 'vehicles':
        return 'Vehículos';
      case 'clients':
        return 'Clientes';
      case 'lube':
        return 'Lubricentro';
      case 'services':
        return 'Servicios';
      case 'products':
        return 'Productos';
      case 'cash':
        return 'Caja';
      case 'reports':
        return 'Reportes';
      case 'settings':
        return 'Configuración';
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
    <>
      <header
        style={{ backgroundColor: '#101112', borderColor: '#252627' }}
        className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:px-6"
      >
        {/* Zone 1: Mobile toggle & Breadcrumb title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="rounded-lg border p-2 text-[#929497] hover:text-[#F5F5F5] md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <span style={{ color: '#D71920' }} className="text-[10px] font-bold uppercase tracking-wider">
              R.B. Gestión
            </span>
            <span className="text-sm font-bold text-[#F5F5F5] md:text-base">
              {getTabTitle(currentTab)}
            </span>
          </div>
        </div>

        {/* Zone 2: Fast Search Bar */}
        <div className="relative hidden lg:block w-72 xl:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#55575A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Buscar por patente o cliente..."
              style={{ backgroundColor: '#0B0B0C', borderColor: '#252627' }}
              className="w-full rounded-lg border py-2 pl-9 pr-4 text-xs text-[#F5F5F5] placeholder-[#55575A] transition focus:border-[#D71920] focus:outline-hidden"
            />
          </div>

          {/* Dropdown Quick Search Results */}
          {showSearchResults && searchQuery.trim().length > 1 && (
            <div
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border shadow-2xl overflow-hidden z-50"
            >
              <div
                style={{ borderColor: '#252627' }}
                className="border-b px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#929497]"
              >
                Coincidencias ({filteredVehicles.length})
              </div>
              {filteredVehicles.length === 0 ? (
                <div className="p-3 text-xs text-[#55575A]">No se encontraron vehículos</div>
              ) : (
                <div className="divide-y divide-[#252627]">
                  {filteredVehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        onSelectVehiclePlate(v.plate);
                        setShowSearchResults(false);
                        setSearchQuery('');
                        onSelectTab('vehicles');
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-[#1A1B1D] transition"
                    >
                      <div>
                        <span style={{ color: '#D71920' }} className="font-mono font-bold mr-2">
                          {v.plate}
                        </span>
                        <span className="text-[#F5F5F5]">
                          {v.brand} {v.model}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#929497]">{v.clientName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Workshop Quick Status Counters + User Menu */}
        <div className="flex items-center gap-3">
          {/* Quick Active Workshop Status Indicator */}
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="hidden sm:flex items-center gap-3 rounded-lg border px-3 py-1.5 text-xs"
          >
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold" title="Lavados en pista">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[#F5F5F5]">{activeWashes}</span>
              <span className="text-[#929497]">lavado</span>
            </div>
            <span className="text-[#252627]">|</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold" title="En espera">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-[#F5F5F5]">{waitingWashes}</span>
              <span className="text-[#929497]">espera</span>
            </div>
            <span className="text-[#252627]">|</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold" title="En lubricentro">
              <Wrench className="h-3.5 w-3.5" />
              <span className="text-[#F5F5F5]">{activeLube}</span>
              <span className="text-[#929497]">taller</span>
            </div>
          </div>

          {/* New Service Primary CTA */}
          <button
            onClick={onOpenNewService}
            style={{ backgroundColor: '#D71920' }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/20 transition hover:bg-[#E02027] active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">+ NUEVO</span>
            <span className="sm:hidden">+</span>
          </button>

          {/* User Indicator & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition hover:border-[#383A3D] hover:bg-[#1A1B1D]"
            >
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-[#F5F5F5] leading-tight">
                  {currentUser?.name || (role === 'ADMIN' ? 'Admin' : 'Empleado')}
                </div>
                <div className="text-[10px] text-[#929497] flex items-center justify-end gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      role === 'ADMIN' ? 'bg-[#D71920]' : 'bg-emerald-400'
                    }`}
                  />
                  <span>{role === 'ADMIN' ? 'Administrador' : 'Empleado'}</span>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: role === 'ADMIN' ? '#A80F15' : '#252627',
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-white font-bold text-xs"
              >
                {role === 'ADMIN' ? 'A' : 'E'}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#929497]" />
            </button>

            {/* Popover User Menu */}
            {userMenuOpen && (
              <div
                style={{ backgroundColor: '#151617', borderColor: '#252627' }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border p-1 shadow-2xl z-50 animate-in fade-in"
              >
                <div className="border-b border-[#252627] px-3 py-2 text-left">
                  <div className="text-xs font-bold text-[#F5F5F5]">
                    {currentUser?.name}
                  </div>
                  <div className="text-[10px] font-mono text-[#929497]">
                    @{currentUser?.username}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                        role === 'ADMIN'
                          ? 'bg-[#A80F15]/20 text-[#F5F5F5] border border-[#D71920]/40'
                          : 'bg-[#1E2022] text-[#929497] border border-[#3A3D40]'
                      }`}
                    >
                      <Shield className="h-2.5 w-2.5" />
                      <span>{role}</span>
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      setShowAccountModal(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#929497] hover:bg-[#1A1B1D] hover:text-[#F5F5F5] transition"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>Mi cuenta</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#E02027] hover:bg-[#1A1B1D] transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Account Info Modal */}
      {showAccountModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div
            style={{ backgroundColor: '#151617', borderColor: '#252627' }}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#252627] pb-3 mb-4">
              <h3 className="text-sm font-extrabold uppercase tracking-tight text-[#F5F5F5]">
                Mi Cuenta
              </h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="rounded p-1 text-[#929497] hover:text-[#F5F5F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#929497] block text-[11px] mb-0.5">Nombre:</span>
                <span className="font-bold text-[#F5F5F5] text-sm">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-[#929497] block text-[11px] mb-0.5">Usuario:</span>
                <span className="font-mono text-[#F5F5F5]">{currentUser.username}</span>
              </div>
              <div>
                <span className="text-[#929497] block text-[11px] mb-0.5">Rol asignado:</span>
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-[#A80F15]/20 text-[#F5F5F5] border border-[#D71920]/40'
                      : 'bg-[#1E2022] text-[#929497] border border-[#3A3D40]'
                  }`}
                >
                  <Shield className="h-3 w-3" />
                  <span>{currentUser.role}</span>
                </span>
              </div>
              <div>
                <span className="text-[#929497] block text-[11px] mb-0.5">Alcance de acceso:</span>
                <span className="text-[#929497]">
                  {currentUser.role === 'ADMIN'
                    ? 'Acceso total a todas las operaciones, finanzas, inventarios y administración.'
                    : 'Acceso operativo simplificado (Lavados, Turnos, Vehículos, Clientes y Lubricentro).'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#252627] flex items-center justify-between">
              <button
                onClick={() => {
                  setShowAccountModal(false);
                  logout();
                }}
                className="flex items-center gap-1.5 text-xs text-[#E02027] font-semibold hover:underline"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar sesión</span>
              </button>
              <button
                onClick={() => setShowAccountModal(false)}
                style={{ backgroundColor: '#101112', borderColor: '#252627' }}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-[#F5F5F5] hover:bg-[#1A1B1D]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

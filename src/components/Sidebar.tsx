import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  Car,
  Users,
  Wrench,
  SprayCan,
  Package,
  Wallet,
  BarChart3,
  Settings,
  AlertTriangle,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'washes'
  | 'turnos'
  | 'vehicles'
  | 'clients'
  | 'lube'
  | 'services'
  | 'products'
  | 'cash'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenNewService: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onOpenNewService,
}) => {
  const { washes, products, turnos, config } = useApp();
  const { role } = useAuth();

  const activeWashesCount = washes.filter((w) => w.status === 'en_proceso' || w.status === 'en_espera').length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const todayTurnosCount = turnos.filter((t) => t.status === 'confirmado' || t.status === 'en_espera').length;

  const operationalItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Inicio',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'washes' as NavTab,
      label: 'Lavados',
      icon: Sparkles,
      badge: activeWashesCount > 0 ? activeWashesCount : null,
      badgeColor: 'bg-[#151617] text-[#D71920] border-[#D71920]/40',
    },
    {
      id: 'turnos' as NavTab,
      label: 'Turnos',
      icon: CalendarDays,
      badge: todayTurnosCount > 0 ? todayTurnosCount : null,
      badgeColor: 'bg-[#151617] text-sky-400 border-sky-500/30',
    },
    {
      id: 'vehicles' as NavTab,
      label: 'Vehículos',
      icon: Car,
      badge: null,
    },
    {
      id: 'clients' as NavTab,
      label: 'Clientes',
      icon: Users,
      badge: null,
    },
    {
      id: 'lube' as NavTab,
      label: 'Lubricentro',
      icon: Wrench,
      badge: null,
    },
  ];

  const adminItems = [
    {
      id: 'services' as NavTab,
      label: 'Servicios',
      icon: SprayCan,
      badge: null,
    },
    {
      id: 'products' as NavTab,
      label: 'Productos',
      icon: Package,
      badge: lowStockCount > 0 ? `! ${lowStockCount}` : null,
      badgeColor: 'bg-[#A80F15]/20 text-[#F5F5F5] border-[#D71920]/50',
    },
    {
      id: 'cash' as NavTab,
      label: 'Caja',
      icon: Wallet,
      badge: null,
    },
    {
      id: 'reports' as NavTab,
      label: 'Reportes',
      icon: BarChart3,
      badge: null,
    },
  ];

  const configItem = {
    id: 'settings' as NavTab,
    label: 'Configuración',
    icon: Settings,
    badge: null,
  };

  const renderNavItem = (item: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    badge: string | number | null;
    badgeColor?: string;
  }) => {
    const Icon = item.icon;
    const isActive = currentTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => {
          onSelectTab(item.id);
          onCloseMobile();
        }}
        style={
          isActive
            ? {
                backgroundColor: 'rgba(215, 25, 32, 0.12)',
                borderLeftColor: '#D71920',
              }
            : undefined
        }
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition ${
          isActive
            ? 'text-[#F5F5F5] font-bold border-l-2'
            : 'text-[#929497] hover:bg-[#1A1B1D] hover:text-[#F5F5F5] font-medium'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Icon
            style={{ color: isActive ? '#D71920' : '#66686A' }}
            className="h-4 w-4 shrink-0 transition-colors"
          />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge && (
          <span
            className={`ml-2 inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-bold border ${
              item.badgeColor || 'bg-[#151617] text-[#929497] border-[#252627]'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        style={{ backgroundColor: '#101112', borderColor: '#252627' }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-60 flex-col border-r transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div style={{ borderColor: '#252627' }} className="flex items-center justify-between border-b px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#D71920' }}
              className="flex h-9 w-9 items-center justify-center rounded-lg font-black text-white shadow-md shadow-[#D71920]/20"
            >
              <span className="text-lg tracking-tighter">RB</span>
            </div>
            <div>
              <h1 className="text-xs font-extrabold uppercase tracking-tight text-[#F5F5F5] leading-tight">
                R.B. LAVADERO
              </h1>
              <p style={{ color: '#D71920' }} className="text-[10px] font-bold tracking-wider uppercase">
                &amp; LUBRICENTRO
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded p-1 text-[#929497] hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick CTA */}
        <div className="p-3">
          <button
            onClick={() => {
              onOpenNewService();
              onCloseMobile();
            }}
            style={{ backgroundColor: '#D71920' }}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/20 transition hover:bg-[#E02027] active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>NUEVO SERVICIO</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-2.5 py-1">
          {/* Operaciones */}
          <div className="space-y-0.5">
            <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#55575A]">
              Operaciones
            </div>
            {operationalItems.map(renderNavItem)}
          </div>

          {/* Administración: Only visible for ADMIN */}
          {role === 'ADMIN' && (
            <div className="space-y-0.5 pt-2 border-t border-[#252627]/60">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#55575A]">
                Administración
              </div>
              {adminItems.map(renderNavItem)}
            </div>
          )}

          {/* Configuración: Only visible for ADMIN */}
          {role === 'ADMIN' && (
            <div className="space-y-0.5 pt-2 border-t border-[#252627]/60">
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#55575A]">
                Sistema
              </div>
              {renderNavItem(configItem)}
            </div>
          )}
        </nav>

        {/* Low stock alert banner inside sidebar (ADMIN only) */}
        {role === 'ADMIN' && lowStockCount > 0 && (
          <div
            style={{ backgroundColor: 'rgba(215, 25, 32, 0.08)', borderColor: 'rgba(215, 25, 32, 0.3)' }}
            className="mx-3 mb-2 rounded-lg border p-2 text-xs text-[#F5F5F5]"
          >
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              <AlertTriangle className="h-3 w-3 shrink-0 text-[#D71920]" />
              <span>{lowStockCount} insumos bajo stock</span>
            </div>
            <button
              onClick={() => {
                onSelectTab('products');
                onCloseMobile();
              }}
              className="mt-0.5 text-[10px] text-[#929497] hover:text-[#F5F5F5] underline"
            >
              Ver inventario
            </button>
          </div>
        )}

        {/* Bottom Business Info */}
        <div style={{ borderColor: '#252627' }} className="border-t p-3 text-[11px]">
          <div className="truncate font-semibold text-[#F5F5F5]">{config.name}</div>
          <div className="text-[10px] text-[#66686A]">
            {role === 'ADMIN' ? 'Modo Administrador' : 'Modo Operador / Empleado'}
          </div>
        </div>
      </aside>
    </>
  );
};

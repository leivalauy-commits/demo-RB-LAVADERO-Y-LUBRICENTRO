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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

  const activeWashesCount = washes.filter((w) => w.status === 'en_proceso' || w.status === 'en_espera').length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const todayTurnosCount = turnos.filter((t) => t.status === 'confirmado' || t.status === 'en_espera').length;

  const navItems = [
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
      badgeColor: 'bg-[#181818] text-[#E10600] border-[#E10600]/40',
    },
    {
      id: 'turnos' as NavTab,
      label: 'Turnos',
      icon: CalendarDays,
      badge: todayTurnosCount > 0 ? todayTurnosCount : null,
      badgeColor: 'bg-[#181818] text-sky-400 border-sky-500/30',
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
      badgeColor: 'bg-[#E10600]/20 text-[#FF1A1A] border-[#E10600]/50',
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
    {
      id: 'settings' as NavTab,
      label: 'Configuración',
      icon: Settings,
      badge: null,
    },
  ];

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
        style={{ backgroundColor: '#0A0A0A', borderColor: '#242424' }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-200 md:static md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div style={{ borderColor: '#242424' }} className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: '#E10600' }}
              className="flex h-10 w-10 items-center justify-center rounded-md font-black text-white shadow-md shadow-[#E10600]/20"
            >
              <span className="text-xl tracking-tighter">RB</span>
            </div>
            <div>
              <h1 className="text-sm font-extrabold uppercase tracking-tight text-white leading-tight">
                R.B. LAVADERO
              </h1>
              <p style={{ color: '#E10600' }} className="text-[11px] font-bold tracking-wider uppercase">
                &amp; LUBRICENTRO
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded p-1 text-[#A3A3A3] hover:text-white md:hidden"
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
            style={{ backgroundColor: '#E10600' }}
            className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#E10600]/25 transition-all hover:bg-[#FF1A1A] active:scale-98"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Nuevo Servicio</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
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
                        backgroundColor: 'rgba(225, 6, 0, 0.12)',
                        borderLeftColor: '#E10600',
                      }
                    : undefined
                }
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs transition ${
                  isActive
                    ? 'text-white font-bold border-l-2'
                    : 'text-[#A3A3A3] hover:bg-[#181818] hover:text-white font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    style={{ color: isActive ? '#E10600' : '#888888' }}
                    className="h-4 w-4 shrink-0 transition-colors"
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold border ${item.badgeColor || 'bg-[#141414] text-[#A3A3A3] border-[#242424]'}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Low stock alert banner inside sidebar if any */}
        {lowStockCount > 0 && (
          <div
            style={{ backgroundColor: 'rgba(225, 6, 0, 0.08)', borderColor: 'rgba(225, 6, 0, 0.3)' }}
            className="mx-3 mb-2 rounded-md border p-2.5 text-xs text-[#FF1A1A]"
          >
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#E10600]" />
              <span>{lowStockCount} insumo(s) bajo stock</span>
            </div>
            <button
              onClick={() => {
                onSelectTab('products');
                onCloseMobile();
              }}
              className="mt-1 text-[11px] underline text-[#A3A3A3] hover:text-white"
            >
              Ver inventario
            </button>
          </div>
        )}

        {/* Bottom Business Info */}
        <div style={{ borderColor: '#242424' }} className="border-t p-3 text-[11px]">
          <div className="truncate font-semibold text-white">{config.address}</div>
          <div className="text-[10px] text-[#666666]">Mostrador Activo · Demo Local</div>
        </div>
      </aside>
    </>
  );
};

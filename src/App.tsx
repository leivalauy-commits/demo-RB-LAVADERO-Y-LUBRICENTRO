/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { canAccessTab } from './auth/permissions';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';

// Views
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { WashesView } from './views/WashesView';
import { TurnosView } from './views/TurnosView';
import { VehiclesView } from './views/VehiclesView';
import { ClientsView } from './views/ClientsView';
import { LubricentroView } from './views/LubricentroView';
import { ServicesView } from './views/ServicesView';
import { ProductsView } from './views/ProductsView';
import { CashView } from './views/CashView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

// Modals & UI
import { NewServiceModal } from './components/modals/NewServiceModal';
import { NewTurnoModal } from './components/modals/NewTurnoModal';
import { NewLubeJobModal } from './components/modals/NewLubeJobModal';
import { NewCashMovementModal } from './components/modals/NewCashMovementModal';
import { ClientDetailModal } from './components/modals/ClientDetailModal';
import { VehicleDetailModal } from './components/modals/VehicleDetailModal';
import { Client, Vehicle, CashMovementType } from './types';
import { ShieldAlert, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { vehicles } = useApp();
  const { role } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [permissionDeniedToast, setPermissionDeniedToast] = useState(false);

  // Modals state
  const [isNewServiceOpen, setIsNewServiceOpen] = useState(false);
  const [newServiceInitialPlate, setNewServiceInitialPlate] = useState('');
  const [isNewTurnoOpen, setIsNewTurnoOpen] = useState(false);
  const [isNewLubeOpen, setIsNewLubeOpen] = useState(false);
  const [isNewCashOpen, setIsNewCashOpen] = useState(false);
  const [cashMovementType, setCashMovementType] = useState<CashMovementType>('ingreso');

  // Detail modals
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Guard tab changes against unauthorized roles
  useEffect(() => {
    if (!canAccessTab(role, currentTab)) {
      setPermissionDeniedToast(true);
      setCurrentTab('dashboard');
      const timer = setTimeout(() => setPermissionDeniedToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [role, currentTab]);

  const handleSelectTab = (tab: NavTab) => {
    if (!canAccessTab(role, tab)) {
      setPermissionDeniedToast(true);
      setTimeout(() => setPermissionDeniedToast(false), 3500);
      setCurrentTab('dashboard');
      return;
    }
    setCurrentTab(tab);
  };

  const handleOpenNewService = (initialPlate: string = '') => {
    setNewServiceInitialPlate(initialPlate);
    setIsNewServiceOpen(true);
  };

  const handleOpenNewCashMovement = (type: CashMovementType) => {
    if (role !== 'ADMIN') {
      setPermissionDeniedToast(true);
      setTimeout(() => setPermissionDeniedToast(false), 3500);
      return;
    }
    setCashMovementType(type);
    setIsNewCashOpen(true);
  };

  const handleSelectPlate = (plate: string) => {
    const cleanPlate = plate.replace(/\s+/g, '').toUpperCase();
    const found = vehicles.find(
      (v) => v.plate.replace(/\s+/g, '').toUpperCase() === cleanPlate
    );
    if (found) {
      setSelectedVehicle(found);
    } else {
      setSelectedVehicle({
        id: 'temp',
        plate: plate.toUpperCase(),
        brand: 'Vehículo',
        model: 'Registrado',
        color: 'Gris',
        clientId: 'c1',
        clientName: 'Cliente Particular',
        createdAt: '2026-10-06',
      });
    }
  };

  return (
    <div
      style={{ backgroundColor: '#0B0B0C', color: '#F5F5F5' }}
      className="flex h-screen w-screen overflow-hidden font-sans"
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenNewService={() => handleOpenNewService('')}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <TopBar
          currentTab={currentTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNewService={() => handleOpenNewService('')}
          onSelectTab={handleSelectTab}
          onSelectVehiclePlate={handleSelectPlate}
        />

        {/* Viewport Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'dashboard' && (
              <DashboardView
                onOpenNewService={() => handleOpenNewService('')}
                onOpenNewTurno={() => setIsNewTurnoOpen(true)}
                onNavigateToWashes={() => handleSelectTab('washes')}
                onNavigateToTurnos={() => handleSelectTab('turnos')}
                onSelectPlate={handleSelectPlate}
              />
            )}

            {currentTab === 'washes' && (
              <WashesView
                onOpenNewService={() => handleOpenNewService('')}
                onSelectPlate={handleSelectPlate}
              />
            )}

            {currentTab === 'turnos' && (
              <TurnosView
                onOpenNewTurno={() => setIsNewTurnoOpen(true)}
                onSelectPlate={handleSelectPlate}
              />
            )}

            {currentTab === 'vehicles' && (
              <VehiclesView
                onSelectVehicle={setSelectedVehicle}
                onOpenNewServiceWithPlate={(plate) => handleOpenNewService(plate)}
              />
            )}

            {currentTab === 'clients' && (
              <ClientsView
                onSelectClient={setSelectedClient}
                onSelectPlate={handleSelectPlate}
              />
            )}

            {currentTab === 'lube' && (
              <LubricentroView
                onOpenNewLubeModal={() => setIsNewLubeOpen(true)}
                onSelectPlate={handleSelectPlate}
              />
            )}

            {/* Admin-only views with permission checks */}
            {currentTab === 'services' && role === 'ADMIN' && <ServicesView />}

            {currentTab === 'products' && role === 'ADMIN' && <ProductsView />}

            {currentTab === 'cash' && role === 'ADMIN' && (
              <CashView onOpenNewMovement={handleOpenNewCashMovement} />
            )}

            {currentTab === 'reports' && role === 'ADMIN' && <ReportsView />}

            {currentTab === 'settings' && role === 'ADMIN' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <NewServiceModal
        isOpen={isNewServiceOpen}
        onClose={() => {
          setIsNewServiceOpen(false);
          setNewServiceInitialPlate('');
        }}
        initialPlate={newServiceInitialPlate}
      />

      <NewTurnoModal
        isOpen={isNewTurnoOpen}
        onClose={() => setIsNewTurnoOpen(false)}
      />

      <NewLubeJobModal
        isOpen={isNewLubeOpen}
        onClose={() => setIsNewLubeOpen(false)}
      />

      {role === 'ADMIN' && (
        <NewCashMovementModal
          isOpen={isNewCashOpen}
          onClose={() => setIsNewCashOpen(false)}
          defaultType={cashMovementType}
        />
      )}

      <ClientDetailModal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
        onSelectVehicle={handleSelectPlate}
      />

      <VehicleDetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        onOpenNewServiceWithPlate={(plate) => handleOpenNewService(plate)}
      />

      {/* Floating Permission Denied Toast */}
      {permissionDeniedToast && (
        <div
          style={{ backgroundColor: '#151617', borderColor: '#D71920' }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#D71920]/60 p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#A80F15]/20 text-[#D71920]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#F5F5F5]">Acceso Restringido</div>
            <div className="text-[11px] text-[#929497]">
              No tenés permisos para acceder a esta sección.
            </div>
          </div>
          <button
            onClick={() => setPermissionDeniedToast(false)}
            className="ml-2 rounded p-1 text-[#929497] hover:text-[#F5F5F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const RootRouter: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, render ONLY the Login screen
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootRouter />
      </AppProvider>
    </AuthProvider>
  );
}

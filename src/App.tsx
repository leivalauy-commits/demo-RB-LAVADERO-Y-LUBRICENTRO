/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopBar } from './components/TopBar';

// Views
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

// Modals
import { NewServiceModal } from './components/modals/NewServiceModal';
import { NewTurnoModal } from './components/modals/NewTurnoModal';
import { NewLubeJobModal } from './components/modals/NewLubeJobModal';
import { NewCashMovementModal } from './components/modals/NewCashMovementModal';
import { ClientDetailModal } from './components/modals/ClientDetailModal';
import { VehicleDetailModal } from './components/modals/VehicleDetailModal';
import { Client, Vehicle, CashMovementType } from './types';

const MainLayout: React.FC = () => {
  const { vehicles } = useApp();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleOpenNewService = (initialPlate: string = '') => {
    setNewServiceInitialPlate(initialPlate);
    setIsNewServiceOpen(true);
  };

  const handleOpenNewCashMovement = (type: CashMovementType) => {
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
      // Create temporary vehicle preview
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
      style={{ backgroundColor: '#050505', color: '#FFFFFF' }}
      className="flex h-screen w-screen overflow-hidden font-sans"
    >
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
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
          onOpenNewTurno={() => setIsNewTurnoOpen(true)}
          onSelectTab={setCurrentTab}
          onSelectVehiclePlate={handleSelectPlate}
        />

        {/* Viewport Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'dashboard' && (
              <DashboardView
                onOpenNewService={() => handleOpenNewService('')}
                onOpenNewTurno={() => setIsNewTurnoOpen(true)}
                onNavigateToWashes={() => setCurrentTab('washes')}
                onNavigateToTurnos={() => setCurrentTab('turnos')}
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

            {currentTab === 'services' && <ServicesView />}

            {currentTab === 'products' && <ProductsView />}

            {currentTab === 'cash' && (
              <CashView onOpenNewMovement={handleOpenNewCashMovement} />
            )}

            {currentTab === 'reports' && <ReportsView />}

            {currentTab === 'settings' && <SettingsView />}
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

      <NewCashMovementModal
        isOpen={isNewCashOpen}
        onClose={() => setIsNewCashOpen(false)}
        defaultType={cashMovementType}
      />

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
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

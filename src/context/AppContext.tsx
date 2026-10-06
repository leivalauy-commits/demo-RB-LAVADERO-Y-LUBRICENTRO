import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Vehicle,
  ServiceItem,
  ProductItem,
  WashService,
  LubeService,
  Turno,
  CashMovement,
  BusinessConfig,
  WashStatus,
  TurnoStatus,
  PaymentMethod,
} from '../types';
import {
  INITIAL_CONFIG,
  INITIAL_CLIENTS,
  INITIAL_VEHICLES,
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_WASHES,
  INITIAL_TURNOS,
  INITIAL_LUBE_SERVICES,
  INITIAL_CASH_MOVEMENTS,
} from '../data/initialData';

interface AppContextType {
  config: BusinessConfig;
  clients: Client[];
  vehicles: Vehicle[];
  services: ServiceItem[];
  products: ProductItem[];
  washes: WashService[];
  turnos: Turno[];
  lubeServices: LubeService[];
  cashMovements: CashMovement[];

  // Quick stats
  todayStats: {
    washesToday: number;
    turnosToday: number;
    activeServices: number;
    todayRevenue: number;
    todayIncome: number;
    todayExpense: number;
    netBalance: number;
    cashTotal: number;
    transferTotal: number;
    cardTotal: number;
  };

  // Wash actions
  addWashService: (data: Omit<WashService, 'id' | 'ticketNumber' | 'createdAt'>) => WashService;
  updateWashStatus: (id: string, newStatus: WashStatus) => void;
  deleteWashService: (id: string) => void;

  // Lube actions
  addLubeService: (data: Omit<LubeService, 'id' | 'ticketNumber' | 'createdAt'>) => LubeService;
  updateLubeStatus: (id: string, newStatus: WashStatus) => void;
  deleteLubeService: (id: string) => void;

  // Turno actions
  addTurno: (data: Omit<Turno, 'id'>) => Turno;
  updateTurnoStatus: (id: string, newStatus: TurnoStatus) => void;
  deleteTurno: (id: string) => void;

  // Client actions
  addClient: (data: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (client: Client) => void;

  // Vehicle actions
  addVehicle: (data: Omit<Vehicle, 'id' | 'createdAt'>) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;

  // Product actions
  addProduct: (data: Omit<ProductItem, 'id'>) => ProductItem;
  updateProduct: (product: ProductItem) => void;
  adjustStock: (productId: string, delta: number) => void;

  // Service actions
  addServiceItem: (data: Omit<ServiceItem, 'id'>) => ServiceItem;
  updateServiceItem: (service: ServiceItem) => void;
  toggleServiceActive: (id: string) => void;
  deleteServiceItem: (id: string) => void;

  // Cash actions
  addCashMovement: (movement: Omit<CashMovement, 'id' | 'date' | 'time'>) => void;

  // Demo helpers
  resetDemoData: () => void;
  updateConfig: (config: BusinessConfig) => void;
}

const STORAGE_KEYS = {
  CONFIG: 'rb_config_v1',
  CLIENTS: 'rb_clients_v1',
  VEHICLES: 'rb_vehicles_v1',
  SERVICES: 'rb_services_v1',
  PRODUCTS: 'rb_products_v1',
  WASHES: 'rb_washes_v1',
  TURNOS: 'rb_turnos_v1',
  LUBE: 'rb_lube_v1',
  CASH: 'rb_cash_v1',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, data: T) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving localStorage for ${key}`, e);
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<BusinessConfig>(() => getStorage(STORAGE_KEYS.CONFIG, INITIAL_CONFIG));
  const [clients, setClients] = useState<Client[]>(() => getStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES));
  const [services, setServices] = useState<ServiceItem[]>(() => getStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES));
  const [products, setProducts] = useState<ProductItem[]>(() => getStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
  const [washes, setWashes] = useState<WashService[]>(() => getStorage(STORAGE_KEYS.WASHES, INITIAL_WASHES));
  const [turnos, setTurnos] = useState<Turno[]>(() => getStorage(STORAGE_KEYS.TURNOS, INITIAL_TURNOS));
  const [lubeServices, setLubeServices] = useState<LubeService[]>(() => getStorage(STORAGE_KEYS.LUBE, INITIAL_LUBE_SERVICES));
  const [cashMovements, setCashMovements] = useState<CashMovement[]>(() => getStorage(STORAGE_KEYS.CASH, INITIAL_CASH_MOVEMENTS));

  // Sync to localStorage
  useEffect(() => setStorage(STORAGE_KEYS.CONFIG, config), [config]);
  useEffect(() => setStorage(STORAGE_KEYS.CLIENTS, clients), [clients]);
  useEffect(() => setStorage(STORAGE_KEYS.VEHICLES, vehicles), [vehicles]);
  useEffect(() => setStorage(STORAGE_KEYS.SERVICES, services), [services]);
  useEffect(() => setStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => setStorage(STORAGE_KEYS.WASHES, washes), [washes]);
  useEffect(() => setStorage(STORAGE_KEYS.TURNOS, turnos), [turnos]);
  useEffect(() => setStorage(STORAGE_KEYS.LUBE, lubeServices), [lubeServices]);
  useEffect(() => setStorage(STORAGE_KEYS.CASH, cashMovements), [cashMovements]);

  const getTimeString = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const getDateString = () => {
    return '2026-10-06';
  };

  // WASH ACTIONS
  const addWashService = (data: Omit<WashService, 'id' | 'ticketNumber' | 'createdAt'>): WashService => {
    const highestTicket = Math.max(1000, ...washes.map((w) => w.ticketNumber), ...lubeServices.map((l) => l.ticketNumber));
    const newTicket = highestTicket + 1;
    const nowStr = `${getDateString()} ${getTimeString()}`;

    const newWash: WashService = {
      ...data,
      id: `w_${Date.now()}`,
      ticketNumber: newTicket,
      createdAt: nowStr,
      startedAt: data.status === 'en_proceso' ? nowStr : undefined,
    };

    setWashes((prev) => [newWash, ...prev]);

    // If paid upfront, add cash movement
    if (data.paymentMethod && data.paymentMethod !== 'pendiente') {
      const movement: CashMovement = {
        id: `cm_${Date.now()}`,
        time: getTimeString(),
        date: getDateString(),
        concept: `${data.serviceName} - ${data.plate}`,
        type: 'ingreso',
        method: data.paymentMethod,
        amount: data.price,
        relatedTicket: newTicket,
      };
      setCashMovements((prev) => [movement, ...prev]);
    }

    return newWash;
  };

  const updateWashStatus = (id: string, newStatus: WashStatus) => {
    const nowStr = `${getDateString()} ${getTimeString()}`;
    setWashes((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          status: newStatus,
          startedAt: newStatus === 'en_proceso' && !w.startedAt ? nowStr : w.startedAt,
          finishedAt: newStatus === 'terminado' && !w.finishedAt ? nowStr : w.finishedAt,
          deliveredAt: newStatus === 'entregado' && !w.deliveredAt ? nowStr : w.deliveredAt,
        };
      })
    );
  };

  const deleteWashService = (id: string) => {
    setWashes((prev) => prev.filter((w) => w.id !== id));
  };

  // LUBE ACTIONS
  const addLubeService = (data: Omit<LubeService, 'id' | 'ticketNumber' | 'createdAt'>): LubeService => {
    const highestTicket = Math.max(500, ...lubeServices.map((l) => l.ticketNumber));
    const newTicket = highestTicket + 1;
    const nowStr = `${getDateString()} ${getTimeString()}`;

    const newLube: LubeService = {
      ...data,
      id: `lub_${Date.now()}`,
      ticketNumber: newTicket,
      createdAt: nowStr,
    };

    setLubeServices((prev) => [newLube, ...prev]);

    // Update vehicle km
    if (data.vehicleId && data.currentKm) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === data.vehicleId ? { ...v, currentKm: data.currentKm } : v))
      );
    }

    // Deduct stock for products used
    if (data.productsUsed && data.productsUsed.length > 0) {
      setProducts((prev) =>
        prev.map((p) => {
          const used = data.productsUsed.find((u) => u.productId === p.id);
          if (used) {
            return { ...p, stock: Math.max(0, p.stock - used.quantity) };
          }
          return p;
        })
      );
    }

    // Add cash movement if paid
    if (data.paymentMethod && data.paymentMethod !== 'pendiente') {
      const movement: CashMovement = {
        id: `cm_${Date.now()}`,
        time: getTimeString(),
        date: getDateString(),
        concept: `${data.serviceType} - ${data.plate}`,
        type: 'ingreso',
        method: data.paymentMethod,
        amount: data.total,
        relatedTicket: newTicket,
      };
      setCashMovements((prev) => [movement, ...prev]);
    }

    return newLube;
  };

  const updateLubeStatus = (id: string, newStatus: WashStatus) => {
    setLubeServices((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
  };

  const deleteLubeService = (id: string) => {
    setLubeServices((prev) => prev.filter((l) => l.id !== id));
  };

  // TURNO ACTIONS
  const addTurno = (data: Omit<Turno, 'id'>): Turno => {
    const newTurno: Turno = {
      ...data,
      id: `t_${Date.now()}`,
    };
    setTurnos((prev) => [...prev, newTurno].sort((a, b) => a.time.localeCompare(b.time)));
    return newTurno;
  };

  const updateTurnoStatus = (id: string, newStatus: TurnoStatus) => {
    setTurnos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTurno = (id: string) => {
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  };

  // CLIENT ACTIONS
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...data,
      id: `c_${Date.now()}`,
      createdAt: getDateString(),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (client: Client) => {
    setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
  };

  // VEHICLE ACTIONS
  const addVehicle = (data: Omit<Vehicle, 'id' | 'createdAt'>): Vehicle => {
    const newVehicle: Vehicle = {
      ...data,
      id: `v_${Date.now()}`,
      createdAt: getDateString(),
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? vehicle : v)));
  };

  // PRODUCT ACTIONS
  const addProduct = (data: Omit<ProductItem, 'id'>): ProductItem => {
    const newProd: ProductItem = {
      ...data,
      id: `p_${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (product: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const adjustStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  // SERVICE ACTIONS
  const addServiceItem = (data: Omit<ServiceItem, 'id'>): ServiceItem => {
    const newServ: ServiceItem = {
      ...data,
      id: `s_${Date.now()}`,
    };
    setServices((prev) => [newServ, ...prev]);
    return newServ;
  };

  const updateServiceItem = (service: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const deleteServiceItem = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // CASH ACTIONS
  const addCashMovement = (movement: Omit<CashMovement, 'id' | 'date' | 'time'>) => {
    const newMovement: CashMovement = {
      ...movement,
      id: `cm_${Date.now()}`,
      time: getTimeString(),
      date: getDateString(),
    };
    setCashMovements((prev) => [newMovement, ...prev]);
  };

  // RESET DEMO
  const resetDemoData = () => {
    localStorage.clear();
    setConfig(INITIAL_CONFIG);
    setClients(INITIAL_CLIENTS);
    setVehicles(INITIAL_VEHICLES);
    setServices(INITIAL_SERVICES);
    setProducts(INITIAL_PRODUCTS);
    setWashes(INITIAL_WASHES);
    setTurnos(INITIAL_TURNOS);
    setLubeServices(INITIAL_LUBE_SERVICES);
    setCashMovements(INITIAL_CASH_MOVEMENTS);
  };

  const updateConfig = (newConfig: BusinessConfig) => {
    setConfig(newConfig);
  };

  // TODAY STATS COMPUTATIONS
  const todayDate = getDateString();
  const todayWashes = washes.filter((w) => w.createdAt.startsWith(todayDate));
  const activeWashesCount = washes.filter((w) => w.status === 'en_proceso').length;
  const activeLubeCount = lubeServices.filter((l) => l.status === 'en_proceso').length;
  const activeServices = activeWashesCount + activeLubeCount;

  const todayIncome = cashMovements
    .filter((cm) => cm.date === todayDate && cm.type === 'ingreso')
    .reduce((sum, cm) => sum + cm.amount, 0);

  const todayExpense = cashMovements
    .filter((cm) => cm.date === todayDate && cm.type === 'egreso')
    .reduce((sum, cm) => sum + cm.amount, 0);

  const netBalance = todayIncome - todayExpense;

  const cashTotal = cashMovements
    .filter((cm) => cm.date === todayDate && cm.type === 'ingreso' && cm.method === 'efectivo')
    .reduce((sum, cm) => sum + cm.amount, 0);

  const transferTotal = cashMovements
    .filter((cm) => cm.date === todayDate && cm.type === 'ingreso' && cm.method === 'transferencia')
    .reduce((sum, cm) => sum + cm.amount, 0);

  const cardTotal = cashMovements
    .filter((cm) => cm.date === todayDate && cm.type === 'ingreso' && cm.method === 'tarjeta')
    .reduce((sum, cm) => sum + cm.amount, 0);

  const todayStats = {
    washesToday: todayWashes.length || 18,
    turnosToday: turnos.filter((t) => t.date === todayDate).length || 12,
    activeServices: activeServices || 4,
    todayRevenue: netBalance,
    todayIncome,
    todayExpense,
    netBalance,
    cashTotal,
    transferTotal,
    cardTotal,
  };

  return (
    <AppContext.Provider
      value={{
        config,
        clients,
        vehicles,
        services,
        products,
        washes,
        turnos,
        lubeServices,
        cashMovements,
        todayStats,
        addWashService,
        updateWashStatus,
        deleteWashService,
        addLubeService,
        updateLubeStatus,
        deleteLubeService,
        addTurno,
        updateTurnoStatus,
        deleteTurno,
        addClient,
        updateClient,
        addVehicle,
        updateVehicle,
        addProduct,
        updateProduct,
        adjustStock,
        addServiceItem,
        updateServiceItem,
        toggleServiceActive,
        deleteServiceItem,
        addCashMovement,
        resetDemoData,
        updateConfig,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

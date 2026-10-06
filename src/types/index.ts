export type ServiceCategory = 'lavadero' | 'lubricentro';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'tarjeta' | 'pendiente';
export type WashStatus = 'en_espera' | 'en_proceso' | 'terminado' | 'entregado';
export type TurnoStatus = 'confirmado' | 'en_espera' | 'en_proceso' | 'terminado' | 'cancelado';
export type CashMovementType = 'ingreso' | 'egreso';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string; // Patente (e.g. "AB 123 CD", "AD 789 GH")
  brand: string;
  model: string;
  year?: number;
  color: string;
  clientId: string;
  clientName: string;
  currentKm?: number;
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'aceite' | 'filtro' | 'fluido' | 'detailing' | 'insumo';
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  unit: string;
}

export interface WashService {
  id: string;
  ticketNumber: number;
  clientId: string;
  clientName: string;
  vehicleId: string;
  plate: string;
  vehicleInfo: string; // e.g. "Toyota Corolla (Blanco)"
  serviceId: string;
  serviceName: string;
  price: number;
  paymentMethod: PaymentMethod;
  status: WashStatus;
  notes?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  deliveredAt?: string;
}

export interface LubeProductUsage {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface LubeService {
  id: string;
  ticketNumber: number;
  clientId: string;
  clientName: string;
  vehicleId: string;
  plate: string;
  vehicleInfo: string;
  currentKm: number;
  serviceType: string; // e.g. "Cambio de Aceite + Filtros"
  productsUsed: LubeProductUsage[];
  laborPrice: number;
  productsTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: WashStatus;
  nextMaintenanceKm: number; // e.g. 10.000 km after current
  nextMaintenanceDate?: string;
  notes?: string;
  createdAt: string;
}

export interface Turno {
  id: string;
  time: string; // e.g. "09:00"
  date: string; // e.g. "2026-10-06"
  clientName: string;
  clientPhone: string;
  plate: string;
  vehicleInfo: string;
  serviceName: string;
  category: ServiceCategory;
  status: TurnoStatus;
  notes?: string;
}

export interface CashMovement {
  id: string;
  time: string; // "10:45"
  date: string; // "2026-10-06"
  concept: string;
  type: CashMovementType;
  method: PaymentMethod;
  amount: number;
  relatedTicket?: number;
}

export interface BusinessConfig {
  name: string;
  subtitle: string;
  phone: string;
  cuit: string;
  address: string;
  openingHours: string;
  oilIntervalKm: number;
}

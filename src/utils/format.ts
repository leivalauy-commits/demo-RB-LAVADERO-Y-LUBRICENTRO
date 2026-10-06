import { WashStatus, TurnoStatus, PaymentMethod } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKm(km: number | undefined): string {
  if (!km) return '—';
  return new Intl.NumberFormat('es-AR').format(km) + ' km';
}

export function getWashStatusBadge(status: WashStatus) {
  switch (status) {
    case 'en_espera':
      return {
        label: 'EN ESPERA',
        dotClass: 'bg-amber-400',
        badgeClass: 'bg-[#1C1500] border border-amber-500/40 text-amber-300',
        actionLabel: 'INICIAR LAVADO',
        nextStatus: 'en_proceso' as WashStatus,
      };
    case 'en_proceso':
      return {
        label: 'EN PROCESO',
        dotClass: 'bg-sky-400 animate-pulse',
        badgeClass: 'bg-[#051C2C] border border-sky-500/40 text-sky-300',
        actionLabel: 'FINALIZAR',
        nextStatus: 'terminado' as WashStatus,
      };
    case 'terminado':
      return {
        label: 'TERMINADO',
        dotClass: 'bg-emerald-400',
        badgeClass: 'bg-[#042111] border border-emerald-500/40 text-emerald-300',
        actionLabel: 'ENTREGAR',
        nextStatus: 'entregado' as WashStatus,
      };
    case 'entregado':
      return {
        label: 'ENTREGADO',
        dotClass: 'bg-[#666666]',
        badgeClass: 'bg-[#141414] border border-[#2E2E2E] text-[#A3A3A3]',
        actionLabel: 'VER DETALLE',
        nextStatus: null,
      };
  }
}

export function getTurnoStatusBadge(status: TurnoStatus) {
  switch (status) {
    case 'confirmado':
      return {
        label: 'CONFIRMADO',
        badgeClass: 'bg-[#141414] border border-[#383838] text-white',
      };
    case 'en_espera':
      return {
        label: 'EN ESPERA',
        badgeClass: 'bg-[#1C1500] border border-amber-500/40 text-amber-300',
      };
    case 'en_proceso':
      return {
        label: 'EN PROCESO',
        badgeClass: 'bg-[#051C2C] border border-sky-500/40 text-sky-300',
      };
    case 'terminado':
      return {
        label: 'TERMINADO',
        badgeClass: 'bg-[#042111] border border-emerald-500/40 text-emerald-300',
      };
    case 'cancelado':
      return {
        label: 'CANCELADO',
        badgeClass: 'bg-[#2A0505] border border-[#E10600]/40 text-[#FF1A1A]',
      };
  }
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  switch (method) {
    case 'efectivo':
      return 'Efectivo';
    case 'transferencia':
      return 'Transferencia';
    case 'tarjeta':
      return 'Tarjeta';
    case 'pendiente':
      return 'Pendiente de cobro';
  }
}

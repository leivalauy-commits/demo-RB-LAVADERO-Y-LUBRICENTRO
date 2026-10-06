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
        badgeClass: 'bg-[#1A1608] border border-amber-500/30 text-amber-300',
        actionLabel: 'INICIAR LAVADO',
        nextStatus: 'en_proceso' as WashStatus,
      };
    case 'en_proceso':
      return {
        label: 'EN PROCESO',
        dotClass: 'bg-sky-400 animate-pulse',
        badgeClass: 'bg-[#071626] border border-sky-500/30 text-sky-300',
        actionLabel: 'FINALIZAR',
        nextStatus: 'terminado' as WashStatus,
      };
    case 'terminado':
      return {
        label: 'TERMINADO',
        dotClass: 'bg-emerald-400',
        badgeClass: 'bg-[#071F11] border border-emerald-500/30 text-emerald-300',
        actionLabel: 'ENTREGAR',
        nextStatus: 'entregado' as WashStatus,
      };
    case 'entregado':
      return {
        label: 'ENTREGADO',
        dotClass: 'bg-[#55575A]',
        badgeClass: 'bg-[#151617] border border-[#252627] text-[#929497]',
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
        badgeClass: 'bg-[#151617] border border-[#252627] text-[#F5F5F5]',
      };
    case 'en_espera':
      return {
        label: 'EN ESPERA',
        badgeClass: 'bg-[#1A1608] border border-amber-500/30 text-amber-300',
      };
    case 'en_proceso':
      return {
        label: 'EN PROCESO',
        badgeClass: 'bg-[#071626] border border-sky-500/30 text-sky-300',
      };
    case 'terminado':
      return {
        label: 'TERMINADO',
        badgeClass: 'bg-[#071F11] border border-emerald-500/30 text-emerald-300',
      };
    case 'cancelado':
      return {
        label: 'CANCELADO',
        badgeClass: 'bg-[#1F1012] border border-[#D71920]/30 text-[#E02027]',
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

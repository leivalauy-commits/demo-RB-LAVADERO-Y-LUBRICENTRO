import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getPaymentMethodLabel } from '../utils/format';
import { CashMovementType } from '../types';

interface CashViewProps {
  onOpenNewMovement: (type: CashMovementType) => void;
}

export const CashView: React.FC<CashViewProps> = ({ onOpenNewMovement }) => {
  const { cashMovements, todayStats } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'ingreso' | 'egreso'>('all');

  const filteredMovements = cashMovements.filter((m) =>
    filterType === 'all' ? true : m.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <Wallet style={{ color: '#D71920' }} className="h-6 w-6" />
            <span>Caja Diaria</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Control de ingresos por mostrador, egresos y arqueo del día
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenNewMovement('egreso')}
            style={{ backgroundColor: '#181818', borderColor: '#252627' }}
            className="inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-xs font-bold text-white hover:bg-[#222222] transition"
          >
            <Minus className="h-4 w-4 text-[#E02027]" />
            <span>- EGRESO</span>
          </button>
          <button
            onClick={() => onOpenNewMovement('ingreso')}
            style={{ backgroundColor: '#D71920' }}
            className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#D71920]/25 hover:bg-[#E02027] transition"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>+ INGRESO</span>
          </button>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RECAUDACIÓN DEL DÍA */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] block">
            Recaudación del Día
          </span>
          <div className="mt-2 text-2xl xl:text-3xl font-mono font-black text-white">
            {formatCurrency(todayStats.todayRevenue || 245000)}
          </div>
          <span className="text-[11px] text-[#777777] mt-1 block">
            Fecha: 06/10/2026
          </span>
        </div>

        {/* INGRESOS */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block flex items-center justify-between">
            <span>Ingresos Brutos</span>
            <ArrowDownRight className="h-4 w-4 text-emerald-400" />
          </span>
          <div className="mt-2 text-2xl xl:text-3xl font-mono font-black text-emerald-400">
            {formatCurrency(todayStats.todayIncome || 280000)}
          </div>
          <span className="text-[11px] text-[#777777] mt-1 block">
            Cobros realizados
          </span>
        </div>

        {/* EGRESOS */}
        <div
          style={{ backgroundColor: '#151617', borderColor: '#252627' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E02027] block flex items-center justify-between">
            <span>Egresos / Gastos</span>
            <ArrowUpRight className="h-4 w-4 text-[#D71920]" />
          </span>
          <div className="mt-2 text-2xl xl:text-3xl font-mono font-black text-[#E02027]">
            {formatCurrency(todayStats.todayExpense || 35000)}
          </div>
          <span className="text-[11px] text-[#777777] mt-1 block">
            Insumos y gastos menores
          </span>
        </div>

        {/* SALDO NETO */}
        <div
          style={{ backgroundColor: '#151617', borderColor: 'rgba(225, 6, 0, 0.3)' }}
          className="rounded-xl border p-5 shadow-sm"
        >
          <span style={{ color: '#D71920' }} className="text-[11px] font-bold uppercase tracking-wider block">
            Saldo en Caja
          </span>
          <div className="mt-2 text-2xl xl:text-3xl font-mono font-black text-white">
            {formatCurrency(todayStats.netBalance || 245000)}
          </div>
          <span className="text-[11px] text-[#A3A3A3] mt-1 block">
            Disponible real
          </span>
        </div>
      </div>

      {/* Desglose por método de pago */}
      <div
        style={{ backgroundColor: '#151617', borderColor: '#252627' }}
        className="rounded-xl border p-5 space-y-4"
      >
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3]">
          Desglose por Forma de Pago
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* EFECTIVO */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-[#181818] p-2.5 text-emerald-400 border border-[#252627]">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-[#A3A3A3]">Efectivo</span>
                <div className="font-mono text-lg font-black text-white mt-0.5">
                  {formatCurrency(todayStats.cashTotal || 120000)}
                </div>
              </div>
            </div>
          </div>

          {/* TRANSFERENCIA */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-[#181818] p-2.5 text-sky-400 border border-[#252627]">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-[#A3A3A3]">Transferencia</span>
                <div className="font-mono text-lg font-black text-sky-400 mt-0.5">
                  {formatCurrency(todayStats.transferTotal || 85000)}
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA */}
          <div
            style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-[#181818] p-2.5 text-purple-400 border border-[#252627]">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-[#A3A3A3]">Tarjeta</span>
                <div className="font-mono text-lg font-black text-purple-400 mt-0.5">
                  {formatCurrency(todayStats.cardTotal || 40000)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div
        style={{ backgroundColor: '#0B0B0B', borderColor: '#252627' }}
        className="rounded-xl border shadow-sm overflow-hidden space-y-3"
      >
        <div style={{ borderColor: '#252627' }} className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-tight text-white">
              Movimientos del Día
            </h2>
            <span className="text-xs text-[#777777] font-mono">
              ({filteredMovements.length})
            </span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setFilterType('all')}
              style={filterType === 'all' ? { backgroundColor: '#D71920', color: '#FFFFFF' } : undefined}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                filterType === 'all' ? 'font-bold' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('ingreso')}
              style={filterType === 'ingreso' ? { backgroundColor: '#052E16', borderColor: '#16A34A', color: '#86EFAC' } : undefined}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                filterType === 'ingreso' ? 'font-bold border' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setFilterType('egreso')}
              style={filterType === 'egreso' ? { backgroundColor: 'rgba(225, 6, 0, 0.15)', borderColor: '#D71920', color: '#E02027' } : undefined}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                filterType === 'egreso' ? 'font-bold border' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Egresos
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              style={{ backgroundColor: '#151617', borderColor: '#252627' }}
              className="border-b uppercase font-bold text-[#A3A3A3] text-[11px] tracking-wider"
            >
              <tr>
                <th className="px-4 py-2.5">Hora</th>
                <th className="px-4 py-2.5">Concepto</th>
                <th className="px-4 py-2.5 text-center">Tipo</th>
                <th className="px-4 py-2.5">Método</th>
                <th className="px-4 py-2.5 text-right">Monto</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: '#252627' }} className="divide-y divide-[#1F1F1F]">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#777777] text-xs">
                    No se registran movimientos para este filtro.
                  </td>
                </tr>
              ) : (
                filteredMovements.map((m) => (
                  <tr
                    key={m.id}
                    style={{ backgroundColor: '#151617' }}
                    className="transition hover:bg-[#181818]"
                  >
                    <td className="px-4 py-3 font-mono font-semibold text-[#A3A3A3] whitespace-nowrap">
                      {m.time} hs
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {m.concept}
                      {m.relatedTicket && (
                        <span className="ml-2 font-mono text-[10px] text-[#777777]">
                          (Ticket #{m.relatedTicket})
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                          m.type === 'ingreso'
                            ? 'bg-[#042111] border border-emerald-500/30 text-emerald-300'
                            : 'bg-[#2A0505] border border-[#D71920]/40 text-[#E02027]'
                        }`}
                      >
                        {m.type === 'ingreso' ? '+' : '-'} {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap capitalize text-white font-medium">
                      {getPaymentMethodLabel(m.method)}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono font-bold text-right whitespace-nowrap ${
                        m.type === 'ingreso' ? 'text-emerald-400' : 'text-[#E02027]'
                      }`}
                    >
                      {m.type === 'ingreso' ? '+' : '-'} {formatCurrency(m.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

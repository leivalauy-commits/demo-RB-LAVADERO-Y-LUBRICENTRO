import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod, CashMovementType } from '../../types';

interface NewCashMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: CashMovementType;
}

export const NewCashMovementModal: React.FC<NewCashMovementModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'ingreso',
}) => {
  const { addCashMovement } = useApp();

  const [type, setType] = useState<CashMovementType>(defaultType);
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [method, setMethod] = useState<PaymentMethod>('efectivo');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || !amount || Number(amount) <= 0) {
      alert('Ingrese un concepto válido y un monto mayor a cero');
      return;
    }

    addCashMovement({
      concept: concept.trim(),
      type,
      method,
      amount: Number(amount),
    });

    onClose();
    setConcept('');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        style={{ backgroundColor: '#111111', borderColor: '#242424' }}
        className="relative w-full max-w-md rounded-xl border shadow-2xl overflow-hidden"
      >
        <div
          style={{ backgroundColor: '#0D0D0D', borderColor: '#242424' }}
          className="flex items-center justify-between border-b px-5 py-4"
        >
          <div className="flex items-center gap-2">
            {type === 'ingreso' ? (
              <ArrowDownRight className="h-5 w-5 text-emerald-400" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-[#FF1A1A]" />
            )}
            <h2 className="text-base font-extrabold uppercase tracking-tight text-white">
              {type === 'ingreso' ? 'Registrar Ingreso de Caja' : 'Registrar Egreso de Caja'}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-[#A3A3A3] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('ingreso')}
              style={
                type === 'ingreso'
                  ? { backgroundColor: '#052E16', borderColor: '#16A34A', color: '#86EFAC' }
                  : { backgroundColor: '#141414', borderColor: '#242424', color: '#A3A3A3' }
              }
              className="rounded-md py-2 text-xs font-bold transition border"
            >
              + INGRESO
            </button>
            <button
              type="button"
              onClick={() => setType('egreso')}
              style={
                type === 'egreso'
                  ? { backgroundColor: 'rgba(225, 6, 0, 0.15)', borderColor: '#E10600', color: '#FF1A1A' }
                  : { backgroundColor: '#141414', borderColor: '#242424', color: '#A3A3A3' }
              }
              className="rounded-md py-2 text-xs font-bold transition border"
            >
              - EGRESO
            </button>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Concepto / Detalle *
            </label>
            <input
              type="text"
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder={type === 'ingreso' ? 'Ej: Venta de cera / Adicional' : 'Ej: Compra insumos / Flete / Limpieza'}
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 text-xs text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Monto ($ ARS) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="0"
              style={{ backgroundColor: '#0D0D0D', borderColor: '#292929' }}
              className="w-full rounded-md border px-3 py-2 font-mono text-base font-bold text-white placeholder-[#777777] focus:border-[#E10600] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#A3A3A3] block mb-1">
              Método
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['efectivo', 'transferencia', 'tarjeta'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  style={
                    method === m
                      ? { backgroundColor: '#E10600', color: '#FFFFFF' }
                      : { backgroundColor: '#0D0D0D', borderColor: '#242424', color: '#A3A3A3' }
                  }
                  className="rounded-md border py-1.5 text-xs font-medium capitalize transition hover:text-white"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              style={{
                backgroundColor: type === 'ingreso' ? '#16A34A' : '#E10600',
              }}
              className="w-full rounded-md py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:opacity-90 shadow-md shadow-black/40"
            >
              Guardar {type === 'ingreso' ? 'Ingreso' : 'Egreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

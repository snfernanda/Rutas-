import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingTicket } from '../../types';
import { Banknote, X, Check, Calculator, AlertCircle } from 'lucide-react';

interface CashCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingTicket | null;
}

export const CashCollectionModal: React.FC<CashCollectionModalProps> = ({
  isOpen,
  onClose,
  booking
}) => {
  const { collectCash } = useApp();
  const [cashReceived, setCashReceived] = useState<string>('20');
  const [resultChange, setResultChange] = useState<number | null>(null);

  if (!isOpen || !booking) return null;

  const fare = booking.price;
  const receivedNum = parseFloat(cashReceived) || 0;
  const change = Math.max(0, receivedNum - fare);

  const handleConfirmCollection = () => {
    if (receivedNum < fare) {
      alert(`El monto recibido (Q${receivedNum}) es menor a la tarifa (Q${fare}).`);
      return;
    }

    const res = collectCash(booking.id, receivedNum);
    setResultChange(res.change);

    setTimeout(() => {
      setResultChange(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 text-slate-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <Banknote className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Cobro en Efectivo</h3>
            <p className="text-xs text-slate-500">Unidad y Chofer en Servicio</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Pasajero:</span>
            <span className="font-semibold text-slate-800">{booking.passengerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Asiento asignado:</span>
            <span className="font-bold text-blue-900">Asiento #{booking.seatNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tarifa fija de pasaje:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">Q{fare.toFixed(2)}</span>
          </div>
        </div>

        {/* Input Cash Received */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Efectivo Entregado por Pasajero (Q)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-slate-400">Q</span>
              <input
                type="number"
                min={fare}
                step="5"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-8 pr-3 text-sm font-mono font-bold text-slate-900 focus:border-blue-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Denominations */}
          <div className="flex gap-2">
            {[fare, 20, 50, 100].map(den => (
              <button
                key={den}
                type="button"
                onClick={() => setCashReceived(den.toString())}
                className={`flex-1 rounded-lg py-1.5 font-mono text-xs font-semibold transition-colors ${
                  receivedNum === den
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Q{den}
              </button>
            ))}
          </div>

          {/* Change Display */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
            <span className="text-[11px] font-medium text-emerald-800">Cambio / Vuelto a Entregar:</span>
            <p className="font-mono text-2xl font-black text-emerald-700">
              Q{change.toFixed(2)}
            </p>
          </div>

          {resultChange !== null ? (
            <div className="rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4" />
              <span>¡Cobro registrado! Boleto marcado como Pagado</span>
            </div>
          ) : (
            <button
              onClick={handleConfirmCollection}
              className="w-full rounded-xl bg-blue-900 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-800 transition-colors"
            >
              Confirmar y Registrar Q{fare.toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BookingTicket } from '../../types';
import { X, CheckCircle2, AlertCircle, Bus, MapPin, User, Calendar, QrCode, Download } from 'lucide-react';

interface QRCodeModalProps {
  ticket: BookingTicket | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900 mb-2">
            <Bus className="h-3.5 w-3.5" />
            <span>Pase de Abordaje Oficial</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">RutaBus GT</h3>
          <p className="text-xs text-slate-500">Muestra este código al chofer al subir al bus</p>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="relative flex h-48 w-48 items-center justify-center rounded-lg bg-white p-2 shadow-xs border border-slate-200">
            {/* Authentic SVG QR Code Pattern */}
            <svg viewBox="0 0 100 100" className="h-full w-full fill-slate-900">
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" fill="#1E3A8A" rx="4" />
              <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="13" width="12" height="12" fill="#1E3A8A" rx="2" />

              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" fill="#1E3A8A" rx="4" />
              <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="75" y="13" width="12" height="12" fill="#1E3A8A" rx="2" />

              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" fill="#1E3A8A" rx="4" />
              <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="75" width="12" height="12" fill="#1E3A8A" rx="2" />

              {/* Data matrix dots */}
              <rect x="38" y="8" width="6" height="6" />
              <rect x="48" y="8" width="6" height="6" />
              <rect x="56" y="14" width="6" height="6" />
              <rect x="38" y="22" width="6" height="6" />
              <rect x="48" y="26" width="6" height="6" />
              <rect x="12" y="38" width="6" height="6" />
              <rect x="22" y="38" width="6" height="6" />
              <rect x="28" y="46" width="6" height="6" />
              <rect x="38" y="38" width="6" height="6" />
              <rect x="46" y="38" width="8" height="8" fill="#10B981" />
              <rect x="58" y="38" width="6" height="6" />
              <rect x="68" y="38" width="6" height="6" />
              <rect x="78" y="38" width="6" height="6" />
              <rect x="88" y="46" width="6" height="6" />
              <rect x="38" y="50" width="6" height="6" />
              <rect x="48" y="52" width="6" height="6" />
              <rect x="58" y="50" width="6" height="6" />
              <rect x="38" y="66" width="6" height="6" />
              <rect x="48" y="68" width="6" height="6" />
              <rect x="58" y="66" width="6" height="6" />
              <rect x="68" y="54" width="6" height="6" />
              <rect x="78" y="62" width="6" height="6" />
              <rect x="88" y="72" width="6" height="6" />
              <rect x="68" y="78" width="6" height="6" />
              <rect x="78" y="84" width="6" height="6" />
              <rect x="86" y="86" width="6" height="6" />
            </svg>
          </div>
          <p className="mt-2 font-mono text-[10px] tracking-wider text-slate-500">
            {ticket.qrToken}
          </p>
        </div>

        {/* Ticket Details */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Asiento asignado</span>
            <span className="rounded-md bg-blue-900 px-2.5 py-0.5 font-bold text-white text-sm">
              Asiento #{ticket.seatNumber}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Unidad de Bus</span>
            <span className="font-semibold text-slate-800">{ticket.busUnit} · {ticket.driverName}</span>
          </div>

          <div className="flex items-start justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 shrink-0">Trayecto</span>
            <span className="text-right font-medium text-slate-800 truncate pl-2 max-w-[200px]">
              {ticket.boardingStopName} → {ticket.destinationStopName}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Pasajero / DPI</span>
            <span className="font-medium text-slate-800 text-right">
              {ticket.passengerName}
              <br />
              <span className="font-mono text-[10px] text-slate-500">{ticket.passengerCui}</span>
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-500">Estado de Pago</span>
            {ticket.paymentStatus === 'pagado' ? (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Pagado (Q{ticket.price.toFixed(2)})
              </span>
            ) : (
              <span className="flex items-center gap-1 font-semibold text-amber-600">
                <AlertCircle className="h-3.5 w-3.5" />
                Pagar Q{ticket.price.toFixed(2)} al Chofer
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-blue-900 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors"
        >
          Cerrar Boleto
        </button>
      </div>
    </div>
  );
};

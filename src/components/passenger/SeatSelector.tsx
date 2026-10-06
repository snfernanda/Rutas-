import React from 'react';
import { Bus, User, Check, Shield } from 'lucide-react';

interface SeatSelectorProps {
  totalSeats?: number;
  occupiedSeats: number[];
  selectedSeat: number | null;
  onSelectSeat: (seatNum: number) => void;
  price: number;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  totalSeats = 40,
  occupiedSeats,
  selectedSeat,
  onSelectSeat,
  price
}) => {
  // Generate 10 rows of 4 seats: [A, B] aisle [C, D]
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const seatA = i * 4 + 1;
    const seatB = i * 4 + 2;
    const seatC = i * 4 + 3;
    const seatD = i * 4 + 4;
    rows.push({ rowNum: i + 1, seats: [seatA, seatB, seatC, seatD] });
  }

  const renderSeat = (seatNum: number) => {
    const isOccupied = occupiedSeats.includes(seatNum);
    const isSelected = selectedSeat === seatNum;

    let buttonClass = 'relative flex flex-col items-center justify-center h-11 w-11 rounded-lg font-mono text-xs font-semibold transition-all duration-150 ';
    
    if (isSelected) {
      buttonClass += 'bg-blue-900 text-white shadow-md ring-2 ring-blue-500 scale-105';
    } else if (isOccupied) {
      buttonClass += 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300';
    } else {
      buttonClass += 'bg-white text-slate-800 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 active:scale-95 shadow-2xs';
    }

    return (
      <button
        key={seatNum}
        disabled={isOccupied}
        onClick={() => onSelectSeat(seatNum)}
        className={buttonClass}
        title={isOccupied ? `Asiento ${seatNum} ocupado` : `Seleccionar asiento ${seatNum}`}
      >
        <span className="text-[11px] leading-none">{seatNum}</span>
        {isSelected && <Check className="h-3 w-3 mt-0.5 text-emerald-400" />}
        {isOccupied && <User className="h-2.5 w-2.5 mt-0.5 text-slate-400" />}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-md border border-slate-300 bg-white"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-md bg-blue-900 text-white flex items-center justify-center text-[10px]">✓</div>
          <span>Tu Selección</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded-md border border-slate-300 bg-slate-200"></div>
          <span>Ocupado</span>
        </div>
      </div>

      {/* Bus Shell Layout */}
      <div className="relative w-full max-w-xs rounded-3xl border-2 border-slate-300 bg-white p-4 shadow-sm">
        {/* Front of bus indicator */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white shadow-2xs">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Frente del Bus</p>
              <p className="text-[10px] text-slate-500">Chofer</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              Puerta Acceso
            </span>
          </div>
        </div>

        {/* 2 + 2 Seats Rows */}
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.rowNum} className="flex items-center justify-between">
              {/* Left pair (A, B) */}
              <div className="flex items-center gap-1.5">
                {renderSeat(row.seats[0])}
                {renderSeat(row.seats[1])}
              </div>

              {/* Central Aisle */}
              <div className="flex h-7 w-6 items-center justify-center text-[10px] font-mono text-slate-400">
                {row.rowNum}
              </div>

              {/* Right pair (C, D) */}
              <div className="flex items-center gap-1.5">
                {renderSeat(row.seats[2])}
                {renderSeat(row.seats[3])}
              </div>
            </div>
          ))}
        </div>

        {/* Back of bus */}
        <div className="mt-4 rounded-lg bg-slate-100 py-1.5 text-center text-[10px] font-medium text-slate-500">
          Última Fila · Ventanilla Trasera
        </div>
      </div>

      {/* Selection summary */}
      <div className="mt-4 flex w-full max-w-xs items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[11px] text-slate-500">Asiento Seleccionado</span>
          <p className="text-sm font-bold text-blue-900">
            {selectedSeat ? `Asiento #${selectedSeat}` : 'Ninguno seleccionado'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-slate-500">Tarifa</span>
          <p className="text-sm font-bold font-mono text-emerald-700">Q{price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

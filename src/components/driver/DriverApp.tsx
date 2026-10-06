import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CashCollectionModal } from './CashCollectionModal';
import { ReportIncidentModal } from './ReportIncidentModal';
import { LeafletMap } from '../common/LeafletMap';
import { 
  Bus, 
  MapPin, 
  Play, 
  Square, 
  Navigation, 
  AlertTriangle, 
  Banknote, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldCheck, 
  Radio, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  RotateCw
} from 'lucide-react';
import { BookingTicket } from '../../types';

export const DriverApp: React.FC = () => {
  const { 
    currentDriver, 
    allDrivers, 
    setDriver, 
    driverTripState, 
    startDriverTrip, 
    endDriverTrip, 
    toggleDriverGps,
    nextDriverStop,
    routes, 
    buses,
    bookings,
    incidents
  } = useApp();

  const [activeDriverTab, setActiveDriverTab] = useState<'panel' | 'manifest' | 'earnings' | 'switch'>('panel');
  const [selectedTicketForCash, setSelectedTicketForCash] = useState<BookingTicket | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const assignedRoute = routes.find(r => r.id === currentDriver.assignedRouteId) || routes[0];
  const assignedBus = buses.find(b => b.id === currentDriver.assignedBusId) || buses[0];

  // Current stop based on trip state
  const currentStop = assignedRoute.stops[driverTripState.currentStopIndex] || assignedRoute.stops[0];
  const nextStop = assignedRoute.stops[driverTripState.currentStopIndex + 1] || assignedRoute.stops[assignedRoute.stops.length - 1];

  // Bookings associated with this route/bus
  const currentBusBookings = bookings.filter(b => b.routeId === assignedRoute.id);

  // Group passengers: getting on, staying on, getting off
  const passengersAtCurrentStop = currentBusBookings.filter(b => b.boardingStopId === currentStop.id);

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Top Driver Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
              <Bus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-bold text-white uppercase tracking-wider">Modo Chofer</h1>
                <span className="text-[10px] text-slate-400">· {assignedBus.unitNumber}</span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate max-w-[190px]">
                {currentDriver.name}
              </p>
            </div>
          </div>

          {/* GPS Status Indicator */}
          <button
            onClick={toggleDriverGps}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              driverTripState.gpsActive
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Radio className={`h-3 w-3 ${driverTripState.gpsActive ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span>GPS {driverTripState.gpsActive ? 'ACTIVO' : 'PAUSA'}</span>
          </button>
        </div>
      </div>

      {/* Main Driver Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* TAB: PANEL DE VIAJE ACTIVO */}
        {activeDriverTab === 'panel' && (
          <div className="p-4 space-y-4">
            {/* Trip Control Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    {assignedRoute.code} · En Servicio
                  </span>
                  <h2 className="text-xs font-bold text-white mt-0.5">{assignedRoute.name}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">ETA Destino</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">~22 min</span>
                </div>
              </div>

              {/* Start / Finish Trip Actions */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {driverTripState.tripActive ? (
                  <button
                    onClick={endDriverTrip}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-red-900/80 border border-red-700 py-2.5 text-xs font-bold text-red-100 hover:bg-red-800 transition-colors"
                  >
                    <Square className="h-3.5 w-3.5 fill-red-200" />
                    <span>Finalizar Viaje</span>
                  </button>
                ) : (
                  <button
                    onClick={startDriverTrip}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Iniciar Viaje</span>
                  </button>
                )}

                <button
                  onClick={() => setShowIncidentModal(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-800 bg-amber-950/60 py-2.5 text-xs font-bold text-amber-200 hover:bg-amber-900/60 transition-colors"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Incidencia</span>
                </button>
              </div>
            </div>

            {/* Current Stop & Passenger Action Center */}
            <div className="rounded-2xl border border-blue-900/60 bg-gradient-to-b from-blue-950/60 to-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Estación Actual (Parada #{driverTripState.currentStopIndex + 1})
                </span>

                <button
                  onClick={nextDriverStop}
                  className="flex items-center gap-1 rounded-md bg-blue-900/80 px-2 py-1 text-[10px] font-bold text-blue-200 hover:bg-blue-800"
                >
                  <span>Siguiente Parada</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{currentStop.name}</h3>
                <p className="text-[11px] text-slate-400">{currentStop.municipality} · Hacia: {nextStop.name}</p>
              </div>

              {/* Occupancy and Cash Counter */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-900/90 p-2.5 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">A bordo</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {assignedBus.currentOccupancy}/{assignedBus.capacity}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Suben aquí</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {passengersAtCurrentStop.length} pax
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Efectivo Hoy</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    Q{currentDriver.todayEarnings.cashCollected.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Passengers on this stop list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-300">
                  Pasajeros en esta Parada ({passengersAtCurrentStop.length})
                </h3>
                <button
                  onClick={() => setActiveDriverTab('manifest')}
                  className="text-[11px] text-blue-400 font-medium"
                >
                  Ver manifiesto total
                </button>
              </div>

              {passengersAtCurrentStop.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center text-xs text-slate-400">
                  No hay abordajes registrados específicamente en esta parada para hoy.
                </div>
              ) : (
                <div className="space-y-2">
                  {passengersAtCurrentStop.map(pax => (
                    <div
                      key={pax.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 font-mono text-xs font-bold text-white">
                          #{pax.seatNumber}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{pax.passengerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{pax.passengerCui}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {pax.paymentStatus === 'pagado' ? (
                          <span className="flex items-center gap-1 rounded bg-emerald-950 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            Pagado
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedTicketForCash(pax)}
                            className="flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-500 shadow-2xs"
                          >
                            <Banknote className="h-3.5 w-3.5" />
                            <span>Cobrar Q{pax.price.toFixed(2)}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live GPS Map Mini */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300">Posición en Ruta (GPS En Vivo)</h3>
              <div className="h-56 w-full overflow-hidden rounded-2xl border border-slate-800">
                <LeafletMap
                  buses={[assignedBus]}
                  routes={[assignedRoute]}
                  selectedBusId={assignedBus.id}
                  activeRouteId={assignedRoute.id}
                  height="100%"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: PASSENGER MANIFEST */}
        {activeDriverTab === 'manifest' && (
          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white">Manifiesto de Pasajeros</h2>
                <p className="text-xs text-slate-400">Lista completa de pasajeros por parada</p>
              </div>
              <span className="font-mono text-xs font-bold text-blue-400">
                {currentBusBookings.length} Reservas
              </span>
            </div>

            <div className="space-y-2.5">
              {currentBusBookings.map(b => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">Asiento #{b.seatNumber}</span>
                      <span className="text-[10px] text-slate-500">· {b.id}</span>
                    </div>

                    {b.paymentStatus === 'pagado' ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        PAGADO DIGITAL
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedTicketForCash(b)}
                        className="rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-amber-500"
                      >
                        Cobrar en Efectivo
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-white">{b.passengerName}</h4>
                    <p className="text-[10px] font-mono text-slate-400">DPI: {b.passengerCui}</p>
                  </div>

                  <div className="flex justify-between border-t border-slate-800/80 pt-1.5 text-[11px] text-slate-400">
                    <span>Sube: <b>{b.boardingStopName}</b></span>
                    <span>Baja: <b>{b.destinationStopName}</b></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: EARNINGS OF THE DAY */}
        {activeDriverTab === 'earnings' && (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-bold text-white">Resumen de Ganancias del Día</h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-[11px] text-slate-400 block">Efectivo Cobrado</span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  Q{currentDriver.todayEarnings.cashCollected.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">En caja de mano</span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-[11px] text-slate-400 block">Pagos Digitales</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  Q{currentDriver.todayEarnings.digitalPaid.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Directo a cuenta</span>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-900/60 bg-blue-950/40 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Total Recaudado en el Turno:</span>
                <span className="font-mono font-bold text-white text-sm">
                  Q{(currentDriver.todayEarnings.cashCollected + currentDriver.todayEarnings.digitalPaid).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Comisión del Chofer (15%):</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  Q{((currentDriver.todayEarnings.cashCollected + currentDriver.todayEarnings.digitalPaid) * currentDriver.todayEarnings.commissionRate).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-blue-900/60 pt-2">
                <span className="text-slate-300">Viajes Completados:</span>
                <span className="font-bold text-white">{currentDriver.todayEarnings.tripsCompleted} vueltas</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SWITCH DRIVER */}
        {activeDriverTab === 'switch' && (
          <div className="p-4 space-y-3.5">
            <h2 className="text-sm font-bold text-white">Cambiar de Chofer / Turno</h2>
            <p className="text-xs text-slate-400">
              Selecciona el perfil de chofer para simular su panel de control específico:
            </p>

            <div className="space-y-2.5">
              {allDrivers.map(drv => (
                <div
                  key={drv.id}
                  onClick={() => {
                    setDriver(drv.id);
                    setActiveDriverTab('panel');
                  }}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-colors ${
                    drv.id === currentDriver.id
                      ? 'border-blue-500 bg-blue-950/60 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 font-bold text-white text-xs">
                      {drv.name.split(' ')[0][0]}{drv.name.split(' ')[1] ? drv.name.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{drv.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {drv.assignedBusId.toUpperCase()} · Licencia: {drv.licenseNumber}
                      </p>
                    </div>
                  </div>

                  {drv.id === currentDriver.id && (
                    <span className="rounded bg-blue-900 px-2 py-0.5 text-[10px] font-bold text-blue-200">
                      Activo
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Driver Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          <button
            onClick={() => setActiveDriverTab('panel')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeDriverTab === 'panel' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="h-5 w-5 mb-0.5" />
            <span>Viaje Activo</span>
          </button>

          <button
            onClick={() => setActiveDriverTab('manifest')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeDriverTab === 'manifest' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-5 w-5 mb-0.5" />
            <span>Manifiesto</span>
          </button>

          <button
            onClick={() => setActiveDriverTab('earnings')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeDriverTab === 'earnings' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-5 w-5 mb-0.5" />
            <span>Ganancias</span>
          </button>

          <button
            onClick={() => setActiveDriverTab('switch')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeDriverTab === 'switch' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="h-5 w-5 mb-0.5" />
            <span>Cambiar Chofer</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CashCollectionModal
        isOpen={selectedTicketForCash !== null}
        onClose={() => setSelectedTicketForCash(null)}
        booking={selectedTicketForCash}
      />

      <ReportIncidentModal
        isOpen={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
      />
    </div>
  );
};

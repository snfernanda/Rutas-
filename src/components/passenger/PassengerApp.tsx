import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { SeatSelector } from './SeatSelector';
import { PncVerificationModal } from './PncVerificationModal';
import { QRCodeModal } from '../common/QRCodeModal';
import { 
  Bus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  Landmark, 
  QrCode, 
  ShieldCheck, 
  ShieldAlert, 
  Bell, 
  Compass, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Ticket
} from 'lucide-react';
import { RouteItem, BookingTicket, PaymentMethod } from '../../types';

export const PassengerApp: React.FC = () => {
  const { 
    currentPassenger, 
    routes, 
    buses, 
    selectedBusId, 
    setSelectedBusId, 
    bookings, 
    createBooking, 
    alerts, 
    markAlertAsRead 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'map' | 'routes' | 'booking' | 'tickets' | 'alerts' | 'profile'>('map');
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(routes[0]);
  const [boardingStopId, setBoardingStopId] = useState<string>(routes[0].stops[0].id);
  const [destinationStopId, setDestinationStopId] = useState<string>(routes[0].stops[routes[0].stops.length - 1].id);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(18);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tarjeta');
  
  // Modals
  const [showPncModal, setShowPncModal] = useState(false);
  const [activeQrTicket, setActiveQrTicket] = useState<BookingTicket | null>(null);
  const [bookingSuccessTicket, setBookingSuccessTicket] = useState<BookingTicket | null>(null);

  // Filter occupied seats for selected bus
  const currentBus = buses.find(b => b.routeId === selectedRoute.id) || buses[0];
  const occupiedSeats = [1, 2, 5, 8, 9, 14, 15, 16, 21, 22, 27, 28, 32, 35];

  const handleRouteSelect = (route: RouteItem) => {
    setSelectedRoute(route);
    setBoardingStopId(route.stops[0].id);
    setDestinationStopId(route.stops[route.stops.length - 1].id);
    setSelectedSeat(null);
    setActiveTab('booking');
  };

  const handleConfirmPurchase = () => {
    if (!selectedSeat) return;

    if (currentPassenger.pncStatus === 'criminal_record') {
      alert('Aviso: Tu CUI tiene una observación policial activa. Se registrará la compra pero debes presentar DPI original al abordar.');
    }

    const newTicket = createBooking({
      routeId: selectedRoute.id,
      busUnit: currentBus.unitNumber,
      seatNumber: selectedSeat,
      boardingStopId,
      destinationStopId,
      price: selectedRoute.basePrice,
      paymentMethod
    });

    setBookingSuccessTicket(newTicket);
  };

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      {/* Top Banner / Passenger Header */}
      <div className="border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-900 text-white font-black text-sm shadow-xs">
              RB
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold tracking-tight text-white">RutaBus GT</h1>
                <span className="text-[10px] text-slate-400">· Amatitlán & Sur</span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                Hola, {currentPassenger.fullName.split(' ')[0]}
              </p>
            </div>
          </div>

          {/* PNC Status Badge */}
          <button
            onClick={() => setShowPncModal(true)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
              currentPassenger.pncStatus === 'clean'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                : 'bg-red-950/80 text-red-400 border border-red-800'
            }`}
          >
            {currentPassenger.pncStatus === 'clean' ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>DPI Verificado</span>
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
                <span>Verificar DPI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* TAB: MAP & LIVE BUSES */}
        {activeTab === 'map' && (
          <div className="space-y-4 p-4">
            {/* Quick Hero Notification */}
            <div className="rounded-2xl border border-blue-900/60 bg-gradient-to-r from-blue-950/80 to-slate-900 p-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-blue-900/60 p-2 text-blue-300">
                  <Compass className="h-4 w-4 animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">Monitoreo Satelital de Buses</p>
                    <span className="text-[10px] text-emerald-400 font-mono">6 buses activos</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Unidades en tiempo real en la CA-9, Villa Nueva, Petapa y Mixco.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Leaflet Map */}
            <div className="h-72 w-full overflow-hidden rounded-2xl border border-slate-800 shadow-md">
              <LeafletMap
                buses={buses}
                routes={routes}
                selectedBusId={selectedBusId}
                onSelectBus={(id) => setSelectedBusId(id)}
                height="100%"
              />
            </div>

            {/* Quick Route Cards */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-xs font-bold text-slate-300">Rutas Disponibles</h2>
                <button
                  onClick={() => setActiveTab('routes')}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                >
                  Ver todas
                </button>
              </div>

              <div className="space-y-2.5">
                {routes.map(route => {
                  const assignedBus = buses.find(b => b.routeId === route.id);
                  return (
                    <div
                      key={route.id}
                      onClick={() => handleRouteSelect(route)}
                      className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 transition-all hover:border-blue-700 hover:bg-slate-900"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-7 px-2 items-center justify-center rounded-md font-mono text-xs font-bold text-white shadow-2xs"
                            style={{ backgroundColor: route.color }}
                          >
                            {route.code}
                          </span>
                          <div>
                            <h3 className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                              {route.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>Próxima: <b>{assignedBus ? `${assignedBus.etaNextStopMin} min` : '8 min'}</b></span>
                              <span>·</span>
                              <span>{route.durationMin} min</span>
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-sm font-bold text-emerald-400">
                            Q{route.basePrice.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-slate-400">por boleto</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                        <span className="truncate max-w-[200px]">{route.origin} → {route.destination}</span>
                        <span className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform">
                          Elegir asiento <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ALL ROUTES */}
        {activeTab === 'routes' && (
          <div className="p-4 space-y-3.5">
            <h2 className="text-sm font-bold text-white">Catálogo Completo de Rutas</h2>
            <p className="text-xs text-slate-400">Selecciona tu origen y destino para reservar tu asiento.</p>

            <div className="space-y-3">
              {routes.map(route => (
                <div
                  key={route.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 transition-all hover:border-blue-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-bold font-mono text-white"
                      style={{ backgroundColor: route.color }}
                    >
                      {route.code}
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-400">
                      Q{route.basePrice.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{route.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{route.description}</p>

                  <div className="my-3 space-y-1 rounded-xl bg-slate-900 p-2.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Horario de operación:</span>
                      <span className="font-medium text-slate-200">{route.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tiempo de viaje estimado:</span>
                      <span className="font-medium text-slate-200">{route.durationMin} minutos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Paradas totales:</span>
                      <span className="font-medium text-slate-200">{route.stops.length} estaciones</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRouteSelect(route)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
                  >
                    <span>Seleccionar Paradas y Asiento</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: BOOKING PROCESS */}
        {activeTab === 'booking' && (
          <div className="p-4 space-y-4">
            {bookingSuccessTicket ? (
              // Booking Confirmation View with Boarding QR
              <div className="space-y-4 rounded-2xl border border-emerald-800/80 bg-slate-950 p-5 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">¡Reserva y Boleto Confirmados!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tu asiento está apartado. Muestra el código QR al piloto al abordar la unidad.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boleto #:</span>
                    <span className="font-mono font-bold text-blue-400">{bookingSuccessTicket.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Asiento Reservado:</span>
                    <span className="font-bold text-emerald-400">Asiento #{bookingSuccessTicket.seatNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bus Asignado:</span>
                    <span className="text-white">{bookingSuccessTicket.busUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subida:</span>
                    <span className="text-white truncate max-w-[180px]">{bookingSuccessTicket.boardingStopName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bajada:</span>
                    <span className="text-white truncate max-w-[180px]">{bookingSuccessTicket.destinationStopName}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setActiveQrTicket(bookingSuccessTicket)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Ver Código QR de Abordaje</span>
                  </button>

                  <button
                    onClick={() => {
                      setBookingSuccessTicket(null);
                      setActiveTab('tickets');
                    }}
                    className="w-full rounded-xl border border-slate-700 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  >
                    Ir a mis Boletos
                  </button>
                </div>
              </div>
            ) : (
              // Step-by-Step Booking Form
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">Reserva de Asiento</h2>
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {selectedRoute.code}
                  </span>
                </div>

                {/* 1. Stop Selection */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300">1. Paradas de Subida y Bajada</h3>
                  
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Parada de Abordaje (Subida)
                    </label>
                    <select
                      value={boardingStopId}
                      onChange={(e) => setBoardingStopId(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-900 focus:outline-none"
                    >
                      {selectedRoute.stops.map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} ({stop.municipality})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Parada de Destino (Bajada)
                    </label>
                    <select
                      value={destinationStopId}
                      onChange={(e) => setDestinationStopId(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-900 focus:outline-none"
                    >
                      {selectedRoute.stops.map(stop => (
                        <option key={stop.id} value={stop.id}>
                          {stop.name} ({stop.municipality})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Visual 2+2 Seat Map */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300">2. Mapa 2+2 de Asientos</h3>
                    <span className="text-[11px] text-slate-400">Unidad {currentBus.unitNumber}</span>
                  </div>

                  <SeatSelector
                    occupiedSeats={occupiedSeats}
                    selectedSeat={selectedSeat}
                    onSelectSeat={(num) => setSelectedSeat(num)}
                    price={selectedRoute.basePrice}
                  />
                </div>

                {/* 3. Payment Method */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-300">3. Método de Pago</h3>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('tarjeta')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-medium transition-all ${
                        paymentMethod === 'tarjeta'
                          ? 'border-2 border-blue-500 bg-blue-950 text-white shadow-xs'
                          : 'border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mb-1 text-blue-400" />
                      <span>Tarjeta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-medium transition-all ${
                        paymentMethod === 'efectivo'
                          ? 'border-2 border-blue-500 bg-blue-950 text-white shadow-xs'
                          : 'border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <Banknote className="h-5 w-5 mb-1 text-emerald-400" />
                      <span>Efectivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('banco')}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-medium transition-all ${
                        paymentMethod === 'banco'
                          ? 'border-2 border-blue-500 bg-blue-950 text-white shadow-xs'
                          : 'border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      <Landmark className="h-5 w-5 mb-1 text-amber-400" />
                      <span>Banca GT</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {paymentMethod === 'tarjeta' && 'Cargo inmediato a tarjeta de débito o crédito.'}
                    {paymentMethod === 'efectivo' && 'Pagarás en mano al chofer al subir mostrando tu código QR.'}
                    {paymentMethod === 'banco' && 'Transferencia bancaria Banco Industrial / Banrural / BAM.'}
                  </p>
                </div>

                {/* Final Checkout CTA */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-400">Total a Pagar:</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      Q{selectedRoute.basePrice.toFixed(2)}
                    </span>
                  </div>

                  <button
                    disabled={!selectedSeat}
                    onClick={handleConfirmPurchase}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-800 disabled:opacity-40 transition-colors"
                  >
                    <span>Confirmar Boleto (Asiento #{selectedSeat || '?'})</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: TICKETS / HISTORY */}
        {activeTab === 'tickets' && (
          <div className="p-4 space-y-3.5">
            <h2 className="text-sm font-bold text-white">Mis Boletos e Historial</h2>
            <p className="text-xs text-slate-400">Presenta el código QR generado para abordar las unidades.</p>

            <div className="space-y-3">
              {bookings.map(ticket => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400">{ticket.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        ticket.status === 'valido' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        ticket.status === 'a_bordo' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </div>

                    <span className="font-mono text-sm font-bold text-emerald-400">
                      Q{ticket.price.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">{ticket.routeName}</h3>
                    <p className="text-[11px] text-slate-400">
                      {ticket.boardingStopName} → {ticket.destinationStopName}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900 p-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Asiento</span>
                      <span className="font-bold text-white text-xs">#{ticket.seatNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Bus / Chofer</span>
                      <span className="text-slate-300 truncate block">{ticket.busUnit} · {ticket.driverName.split(' ')[0]}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveQrTicket(ticket)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>Ver Código QR de Abordaje</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ALERTS & NOTIFICATIONS */}
        {activeTab === 'alerts' && (
          <div className="p-4 space-y-3.5">
            <h2 className="text-sm font-bold text-white">Notificaciones en Tiempo Real</h2>
            <p className="text-xs text-slate-400">Alertas de llegada de buses, tráfico e incidencias.</p>

            <div className="space-y-2.5">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  onClick={() => markAlertAsRead(alert.id)}
                  className={`rounded-2xl border p-3.5 transition-colors cursor-pointer ${
                    alert.type === 'alert'
                      ? 'border-red-900/60 bg-red-950/40 text-red-200'
                      : alert.type === 'warning'
                      ? 'border-amber-900/60 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-950 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xs font-bold text-white">{alert.title}</h3>
                    <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs mt-1 text-slate-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROFILE & DPI */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-bold text-white">Perfil del Pasajero</h2>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 font-bold text-white text-base">
                  {currentPassenger.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{currentPassenger.fullName}</h3>
                  <p className="font-mono text-slate-400 text-[11px]">{currentPassenger.cui}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="text-slate-200">{currentPassenger.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Correo Electrónico:</span>
                  <span className="text-slate-200">{currentPassenger.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Condición:</span>
                  <span className="text-slate-200">
                    {currentPassenger.isMinor ? 'Menor de edad (con tutor)' : 'Mayor de edad'}
                  </span>
                </div>
                {currentPassenger.isMinor && (
                  <div className="rounded-lg bg-slate-900 p-2 text-[11px] space-y-1">
                    <p className="text-slate-400">Tutor responsable: <b className="text-slate-200">{currentPassenger.guardianName}</b></p>
                    <p className="text-slate-400">DPI del tutor: <b className="font-mono text-slate-200">{currentPassenger.guardianCui}</b></p>
                  </div>
                )}
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Estado PNC:</span>
                  <span className={`font-semibold ${
                    currentPassenger.pncStatus === 'clean' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {currentPassenger.pncStatus === 'clean' ? 'Sin Antecedentes (Limpio)' : 'Con Observación Policial'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPncModal(true)}
                className="w-full mt-2 rounded-xl bg-blue-900 py-2.5 text-xs font-semibold text-white hover:bg-blue-800"
              >
                Editar Datos / Re-verificar DPI
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Ergonomic Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-around py-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeTab === 'map' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="h-5 w-5 mb-0.5" />
            <span>Mapa</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeTab === 'routes' || activeTab === 'booking' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="h-5 w-5 mb-0.5" />
            <span>Rutas</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeTab === 'tickets' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="h-5 w-5 mb-0.5" />
            <span>Boletos</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`relative flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeTab === 'alerts' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="h-5 w-5 mb-0.5" />
            <span>Avisos</span>
            {alerts.filter(a => !a.read).length > 0 && (
              <span className="absolute top-1 right-3 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-1 px-3 text-[10px] font-medium transition-colors ${
              activeTab === 'profile' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-5 w-5 mb-0.5" />
            <span>Perfil</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <PncVerificationModal
        isOpen={showPncModal}
        onClose={() => setShowPncModal(false)}
      />

      <QRCodeModal
        ticket={activeQrTicket}
        onClose={() => setActiveQrTicket(null)}
      />
    </div>
  );
};

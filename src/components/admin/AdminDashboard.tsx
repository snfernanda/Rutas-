import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeafletMap } from '../common/LeafletMap';
import { RevenueChart } from './RevenueChart';
import { 
  Bus, 
  Users, 
  DollarSign, 
  Percent, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Settings,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { BusUnit } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    buses, 
    routes, 
    allDrivers, 
    allPassengers, 
    bookings, 
    incidents, 
    resolveIncident,
    selectedBusId,
    setSelectedBusId
  } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'map' | 'fleet' | 'analytics' | 'alerts'>('overview');
  const [fleetSubTab, setFleetSubTab] = useState<'buses' | 'drivers' | 'routes'>('buses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('all');

  // Computed KPIs
  const totalTripsToday = 24;
  const totalRevenue = bookings.reduce((acc, b) => acc + b.price, 0) + 4420;
  const avgOccupancy = Math.round(
    buses.reduce((acc, b) => acc + (b.currentOccupancy / b.capacity) * 100, 0) / buses.length
  );
  const activeBusesCount = buses.filter(b => b.status === 'en_ruta').length;

  // Active alerts list for the admin
  const adminAlerts = [
    {
      id: 'adm-01',
      type: 'detenido',
      severity: 'alta',
      title: 'Bus Detenido por más de 10 min',
      detail: 'Unidad U-06 detenida en Hospital Nacional Amatitlán sin reporte de falla.',
      busUnit: 'U-06',
      time: 'Hace 8 min'
    },
    {
      id: 'adm-02',
      type: 'sobrecupo',
      severity: 'media',
      title: 'Alerta de Sobrecupo (90%)',
      detail: 'Unidad U-02 reporta 36 pasajeros a bordo en aproximación a CENMA.',
      busUnit: 'U-02',
      time: 'Hace 14 min'
    },
    {
      id: 'adm-03',
      type: 'inactivo',
      severity: 'baja',
      title: 'Chofer Próximo a Cambio de Turno',
      detail: 'Carlos Méndez (U-02) completará 7 horas continuas de servicio.',
      busUnit: 'U-02',
      time: 'Hace 25 min'
    }
  ];

  return (
    <div className="flex h-full min-h-screen bg-slate-900 text-slate-100">
      {/* Admin Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800 bg-slate-950 p-4">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 font-black text-white text-base">
            RB
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">RutaBus GT</h1>
            <p className="text-[10px] text-slate-400 font-mono">Consola Central Admin</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 text-xs font-medium">
          <button
            onClick={() => setActiveSection('overview')}
            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
              activeSection === 'overview'
                ? 'bg-blue-900 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Resumen General</span>
          </button>

          <button
            onClick={() => setActiveSection('map')}
            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
              activeSection === 'map'
                ? 'bg-blue-900 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Mapa de Flota en Vivo</span>
          </button>

          <button
            onClick={() => setActiveSection('fleet')}
            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
              activeSection === 'fleet'
                ? 'bg-blue-900 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Bus className="h-4 w-4" />
            <span>Gestión de Flota</span>
          </button>

          <button
            onClick={() => setActiveSection('analytics')}
            className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
              activeSection === 'analytics'
                ? 'bg-blue-900 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Ingresos & Reportes</span>
          </button>

          <button
            onClick={() => setActiveSection('alerts')}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
              activeSection === 'alerts'
                ? 'bg-blue-900 text-white font-bold'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4" />
              <span>Alertas Operativas</span>
            </div>
            {adminAlerts.length > 0 && (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/40">
                {adminAlerts.length}
              </span>
            )}
          </button>
        </nav>

        {/* Municipality Coverage Pill */}
        <div className="mt-auto rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-300 mb-1">Zona de Cobertura:</p>
          <p className="leading-tight">
            Amatitlán · Villa Nueva · San Miguel Petapa · Mixco · Ciudad de Guatemala (Zona 12)
          </p>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="border-b border-slate-800 bg-slate-950 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Panel de Administración</span>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-bold text-white capitalize">
              {activeSection === 'overview' && 'Dashboard Principal'}
              {activeSection === 'map' && 'Monitoreo GPS Global'}
              {activeSection === 'fleet' && 'Buses, Pilotos y Rutas'}
              {activeSection === 'analytics' && 'Métricas de Rentabilidad'}
              {activeSection === 'alerts' && 'Centro de Incidencias'}
            </span>
          </div>

          {/* Quick Date and System Status */}
          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono">
              <Calendar className="h-3.5 w-3.5 text-blue-400" />
              <span>Lunes, 05 de Octubre 2026</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-950 px-2.5 py-1 text-emerald-400 text-[11px] font-semibold border border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Central Operando</span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation bar for small screens */}
        <div className="lg:hidden flex items-center justify-around border-b border-slate-800 bg-slate-950 px-2 py-2 text-xs">
          {(['overview', 'map', 'fleet', 'analytics', 'alerts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${
                activeSection === tab ? 'bg-blue-900 text-white' : 'text-slate-400'
              }`}
            >
              {tab === 'overview' && 'Resumen'}
              {tab === 'map' && 'Mapa'}
              {tab === 'fleet' && 'Flota'}
              {tab === 'analytics' && 'Gráficas'}
              {tab === 'alerts' && 'Alertas'}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Viajes del Día</span>
                    <Bus className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-white">{totalTripsToday}</span>
                    <span className="text-xs font-semibold text-emerald-400">+4 vs ayer</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">4 corredores activos</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Ocupación Promedio</span>
                    <Percent className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-white">{avgOccupancy}%</span>
                    <span className="text-xs font-semibold text-emerald-400">Eficiencia alta</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Capacidad: 40 asientos por bus</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Ingresos Totales Hoy</span>
                    <DollarSign className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-white">Q{totalRevenue.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-emerald-400">Metas cumplidas</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Digital + Efectivo en caja</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Flota Activa</span>
                    <Activity className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-white">{activeBusesCount} / {buses.length}</span>
                    <span className="text-xs font-semibold text-blue-400">100% disponibles</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">1 en terminal · 5 en ruta</p>
                </div>
              </div>

              {/* Grid: Global Map + Quick Live Fleet Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Global Map Preview (2 cols) */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-white">Mapa Satelital Global de Buses</h2>
                      <p className="text-xs text-slate-400">Posicionamiento en tiempo real por telemetría GPS</p>
                    </div>
                    <button
                      onClick={() => setActiveSection('map')}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      Pantalla completa →
                    </button>
                  </div>

                  <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-800">
                    <LeafletMap
                      buses={buses}
                      routes={routes}
                      selectedBusId={selectedBusId}
                      onSelectBus={(id) => setSelectedBusId(id)}
                      height="100%"
                    />
                  </div>
                </div>

                {/* Live Fleet Quick Status list */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">Estado de Unidades</h2>
                    <span className="font-mono text-xs text-slate-400">{buses.length} buses</span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-80 pr-1">
                    {buses.map(bus => (
                      <div
                        key={bus.id}
                        onClick={() => setSelectedBusId(bus.id)}
                        className={`cursor-pointer rounded-xl border p-2.5 transition-colors ${
                          bus.id === selectedBusId
                            ? 'border-blue-500 bg-blue-950/40'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{bus.unitNumber}</span>
                            <span className="text-[10px] text-slate-400">{bus.plate}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            bus.hasIncident ? 'bg-red-950 text-red-400' :
                            bus.status === 'detenido' ? 'bg-amber-950 text-amber-400' :
                            'bg-emerald-950 text-emerald-400'
                          }`}>
                            {bus.hasIncident ? 'INCIDENCIA' : bus.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{bus.driverName.split(' ')[0]} {bus.driverName.split(' ')[1]}</span>
                          <span className="font-mono font-medium text-slate-300">
                            {bus.currentOccupancy}/{bus.capacity} pax ({bus.speedKmH} km/h)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart.js Quick Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">Evolución de Ingresos (Últimos 7 Días)</h2>
                    <span className="text-xs text-slate-400 font-mono">Quetzales (Q)</span>
                  </div>
                  <div className="h-64 w-full">
                    <RevenueChart type="line" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white">Pasajeros Transportados por Ruta</h2>
                    <span className="text-xs text-slate-400">Totales de hoy</span>
                  </div>
                  <div className="h-64 w-full">
                    <RevenueChart type="bar" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: FULL LIVE MAP */}
          {activeSection === 'map' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div>
                  <h2 className="text-sm font-bold text-white">Monitoreo Satelital y Telemática</h2>
                  <p className="text-xs text-slate-400">Filtrar visualización por corredor o unidad</p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRouteFilter}
                    onChange={(e) => setSelectedRouteFilter(e.target.value)}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-blue-900 focus:outline-none"
                  >
                    <option value="all">Todas las Rutas (4 Corredores)</option>
                    {routes.map(r => (
                      <option key={r.id} value={r.id}>{r.code}: {r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-[620px] w-full overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
                <LeafletMap
                  buses={buses}
                  routes={routes}
                  activeRouteId={selectedRouteFilter === 'all' ? null : selectedRouteFilter}
                  selectedBusId={selectedBusId}
                  onSelectBus={(id) => setSelectedBusId(id)}
                  height="100%"
                />
              </div>
            </div>
          )}

          {/* SECTION: FLEET MANAGEMENT */}
          {activeSection === 'fleet' && (
            <div className="space-y-4">
              {/* Sub-tabs: Buses | Drivers | Routes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFleetSubTab('buses')}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                      fleetSubTab === 'buses' ? 'bg-blue-900 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Buses ({buses.length})
                  </button>

                  <button
                    onClick={() => setFleetSubTab('drivers')}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                      fleetSubTab === 'drivers' ? 'bg-blue-900 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Choferes ({allDrivers.length})
                  </button>

                  <button
                    onClick={() => setFleetSubTab('routes')}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                      fleetSubTab === 'routes' ? 'bg-blue-900 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    Rutas ({routes.length})
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar placa, chofer o ruta..."
                    className="rounded-xl border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sub-Tab 1: BUSES TABLE */}
              {fleetSubTab === 'buses' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="p-3.5">Unidad / Placa</th>
                        <th className="p-3.5">Modelo</th>
                        <th className="p-3.5">Chofer Asignado</th>
                        <th className="p-3.5">Ruta</th>
                        <th className="p-3.5">Ocupación</th>
                        <th className="p-3.5">Velocidad</th>
                        <th className="p-3.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {buses.map(bus => (
                        <tr key={bus.id} className="hover:bg-slate-900/40">
                          <td className="p-3.5">
                            <span className="font-bold text-white">{bus.unitNumber}</span>
                            <span className="block text-[11px] font-mono text-slate-400">{bus.plate}</span>
                          </td>
                          <td className="p-3.5 text-slate-300">{bus.model}</td>
                          <td className="p-3.5 font-medium text-white">{bus.driverName}</td>
                          <td className="p-3.5 text-blue-400 font-mono">{bus.routeId.toUpperCase()}</td>
                          <td className="p-3.5 font-mono">
                            {bus.currentOccupancy} / {bus.capacity} pax
                            <span className="text-[10px] text-slate-400 block">
                              ({Math.round((bus.currentOccupancy / bus.capacity) * 100)}%)
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">{bus.speedKmH} km/h</td>
                          <td className="p-3.5">
                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              bus.status === 'en_ruta' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                              'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {bus.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-Tab 2: DRIVERS TABLE */}
              {fleetSubTab === 'drivers' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="p-3.5">Nombre</th>
                        <th className="p-3.5">DPI / CUI</th>
                        <th className="p-3.5">Licencia</th>
                        <th className="p-3.5">Teléfono</th>
                        <th className="p-3.5">Unidad</th>
                        <th className="p-3.5">Calificación</th>
                        <th className="p-3.5">Efectivo Recaudado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {allDrivers.map(drv => (
                        <tr key={drv.id} className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-white">{drv.name}</td>
                          <td className="p-3.5 font-mono text-slate-400">{drv.cui}</td>
                          <td className="p-3.5 text-slate-300">{drv.licenseNumber} ({drv.licenseType.split(' ')[0]})</td>
                          <td className="p-3.5 text-slate-400">{drv.phone}</td>
                          <td className="p-3.5 font-bold text-blue-400">{drv.assignedBusId.toUpperCase()}</td>
                          <td className="p-3.5 font-mono text-amber-400">★ {drv.rating}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">
                            Q{drv.todayEarnings.cashCollected.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-Tab 3: ROUTES TABLE */}
              {fleetSubTab === 'routes' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase font-bold text-slate-400">
                      <tr>
                        <th className="p-3.5">Código</th>
                        <th className="p-3.5">Nombre Corredor</th>
                        <th className="p-3.5">Tarifa</th>
                        <th className="p-3.5">Duración</th>
                        <th className="p-3.5">Paradas</th>
                        <th className="p-3.5">Horario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {routes.map(r => (
                        <tr key={r.id} className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-mono font-bold text-blue-400">{r.code}</td>
                          <td className="p-3.5 font-bold text-white">{r.name}</td>
                          <td className="p-3.5 font-mono font-bold text-emerald-400">Q{r.basePrice.toFixed(2)}</td>
                          <td className="p-3.5 font-mono">{r.durationMin} min</td>
                          <td className="p-3.5">{r.stops.length} estaciones</td>
                          <td className="p-3.5 text-slate-400">{r.schedule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SECTION: ANALYTICS & REPORTS */}
          {activeSection === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">Ingresos Semanales Totales (Chart.js)</h3>
                  <p className="text-xs text-slate-400">Comparativa de cobros digitales y efectivo acumulado.</p>
                  <div className="h-72 w-full pt-2">
                    <RevenueChart type="line" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">Distribución de Métodos de Pago</h3>
                  <p className="text-xs text-slate-400">Porcentaje de transacciones procesadas</p>
                  <div className="h-72 w-full pt-2">
                    <RevenueChart type="doughnut" />
                  </div>
                </div>
              </div>

              {/* Reports: Top routes & frequent passengers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Routes */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">Reporte de Rutas Más Demandadas</h3>
                  <div className="space-y-3">
                    {routes.map(r => (
                      <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-xs">
                        <div>
                          <p className="font-bold text-white">{r.code}: {r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.origin} → {r.destination}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400">
                            Q{(r.basePrice * (r.id === 'route-01' ? 420 : 250)).toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-slate-500">Recaudado hoy</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Frequent Passengers */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white">Pasajeros Recurrentes Registrados</h3>
                  <div className="space-y-3">
                    {allPassengers.map(p => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl bg-slate-900 p-3 text-xs">
                        <div>
                          <p className="font-bold text-white">{p.fullName}</p>
                          <p className="text-[10px] font-mono text-slate-400">DPI: {p.cui}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block rounded-md bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800">
                            PNC Aprobado
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1">Saldo: Q{p.walletBalance.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: ALERTS & INCIDENTS */}
          {activeSection === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-bold text-white">Alertas Operativas y Reportes en Vivo</h2>
                <p className="text-xs text-slate-400">Incidentes reportados por pilotos y anomalías detectadas por el sistema.</p>
              </div>

              {/* Incidents from Drivers */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Incidentes de Pilotos ({incidents.length})
                </h3>

                {incidents.map(inc => (
                  <div
                    key={inc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-amber-900/60 p-2 text-amber-300">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase">{inc.type}: {inc.location}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{inc.busUnit} · {inc.driverName}</span>
                        </div>
                        <p className="text-slate-300 mt-1">{inc.description}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Reportado: {inc.timestamp}</p>
                      </div>
                    </div>

                    <div>
                      {inc.resolved ? (
                        <span className="rounded-lg bg-emerald-950 px-3 py-1.5 font-bold text-emerald-400 border border-emerald-800">
                          Resuelto
                        </span>
                      ) : (
                        <button
                          onClick={() => resolveIncident(inc.id)}
                          className="rounded-xl bg-blue-900 px-3 py-1.5 font-bold text-white hover:bg-blue-800 transition-colors shadow-2xs"
                        >
                          Marcar como Atendido
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* System Automated Warnings */}
              <div className="space-y-3 pt-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Alertas Automatizadas del Sistema
                </h3>

                {adminAlerts.map(alt => (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-xl p-2 ${
                        alt.severity === 'alta' ? 'bg-red-950 text-red-400' :
                        alt.severity === 'media' ? 'bg-amber-950 text-amber-400' :
                        'bg-blue-950 text-blue-400'
                      }`}>
                        <AlertCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{alt.title} ({alt.busUnit})</p>
                        <p className="text-slate-400 text-[11px]">{alt.detail}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-slate-500">{alt.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

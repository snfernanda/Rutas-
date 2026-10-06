import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Bus, 
  User, 
  Shield, 
  Smartphone, 
  Monitor, 
  Info, 
  LogOut,
  X 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    role, 
    setRole, 
    deviceViewMode, 
    setDeviceViewMode, 
    currentDriver, 
    currentPassenger, 
    logout 
  } = useApp();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Active user name display
  const userName = role === 'admin' 
    ? 'Ing. Rodrigo Alvarado' 
    : role === 'driver' 
    ? currentDriver.name 
    : currentPassenger.fullName;

  return (
    <>
      <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-6">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 font-black text-white text-sm">
            RB
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">RutaBus GT</span>
            <span className="hidden sm:inline-block rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              Amatitlán & Sur
            </span>
          </div>
        </div>

        {/* Zone 2: Role Switcher (Pasajero · Chofer · Administrador) */}
        <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setRole('passenger')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition-all ${
              role === 'passenger'
                ? 'bg-blue-900 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Pasajero</span>
          </button>

          <button
            onClick={() => setRole('driver')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition-all ${
              role === 'driver'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bus className="h-3.5 w-3.5" />
            <span>Chofer</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-medium transition-all ${
              role === 'admin'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Administrador</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>

        {/* Zone 3: Device Frame Toggle, User pill & Logout */}
        <div className="flex items-center gap-2">
          {/* Active user tag */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-800">
            <span className={`h-2 w-2 rounded-full ${
              role === 'admin' ? 'bg-indigo-400' : role === 'driver' ? 'bg-emerald-400' : 'bg-blue-400'
            }`} />
            <span className="font-semibold truncate max-w-[120px]">{userName.split(' ')[0]}</span>
          </div>

          {role !== 'admin' && (
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 p-1">
              <button
                onClick={() => setDeviceViewMode('mobile')}
                title="Vista en marco de teléfono"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceViewMode === 'mobile' ? 'bg-blue-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeviceViewMode('desktop')}
                title="Vista adaptada a pantalla completa"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceViewMode === 'desktop' ? 'bg-blue-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Logout / Switch User Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:border-red-800 hover:bg-red-950/60 hover:text-red-200 transition-colors"
            title="Cambiar usuario o registrar otro DPI"
          >
            <LogOut className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline text-[11px] font-medium">Cambiar</span>
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Información del prototipo"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Info / About Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 p-6 text-slate-200 border border-slate-800 shadow-2xl">
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-white font-black text-sm">
                RB
              </div>
              <div>
                <h3 className="text-base font-bold text-white">RutaBus GT · Prototipo UI/UX</h3>
                <p className="text-xs text-slate-400">Sistema Intermunicipal de Transporte Público</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <p>
                Este prototipo interactivo cubre el corredor sur del área metropolitana de Guatemala, conectando:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li><b className="text-slate-200">Amatitlán</b>: Terminal Parque Central, Lago y San Antonio.</li>
                <li><b className="text-slate-200">Villa Nueva</b>: Metrocentro, El Túnel, Castañas, Bárcenas y CENMA.</li>
                <li><b className="text-slate-200">San Miguel Petapa</b>: El Frutal, Pradera Villa Hermosa y Centro.</li>
                <li><b className="text-slate-200">Mixco</b>: Boulevard San Cristóbal y Calzada Roosevelt.</li>
                <li><b className="text-slate-200">Zona 12</b>: Aguilar Batres, Conexión Transmetro CENMA y USAC.</li>
              </ul>

              <div className="rounded-xl border border-blue-900/60 bg-blue-950/40 p-3 space-y-1.5">
                <p className="font-semibold text-white">Funcionalidades Implementadas:</p>
                <p className="text-[11px] text-slate-300">
                  • <b>Pasajero:</b> Registro con DPI (13 dígitos), verificación simulada PNC (limpio/antecedentes), mapa Leaflet en vivo, selección 2+2 de asientos, selección de paradas, métodos de pago (efectivo, tarjeta, banco) y QR de abordaje.
                </p>
                <p className="text-[11px] text-slate-300">
                  • <b>Chofer:</b> Iniciar/Finalizar viaje con GPS activo, manifiesto por parada, cobro de pasaje en efectivo con vuelto automático, reporte de incidencias y balance de ganancias.
                </p>
                <p className="text-[11px] text-slate-300">
                  • <b>Administrador:</b> KPIs, mapa global de flota en tiempo real, gestión de buses/pilotos/rutas, gráficas de Chart.js y alertas operativas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-5 w-full rounded-xl bg-blue-900 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
            >
              Comenzar a Explorar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

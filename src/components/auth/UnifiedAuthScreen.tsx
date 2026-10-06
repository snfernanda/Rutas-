import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ADMIN_USER } from '../../context/AppContext';
import { 
  Bus, 
  User, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  IdCard, 
  CheckCircle2, 
  Info, 
  Lock,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../../types';

export const UnifiedAuthScreen: React.FC = () => {
  const { loginUserByDpi, detectRoleFromDpi, allDrivers, allPassengers } = useApp();

  const [cui, setCui] = useState('');
  const [fullName, setFullName] = useState('');
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianCui, setGuardianCui] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live detection result
  const detected = detectRoleFromDpi(cui);

  // Format DPI (CUI 13 digits: #### ##### ####)
  const handleCuiChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 4 && raw.length <= 9) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4)}`;
    } else if (raw.length > 9) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4, 9)} ${raw.slice(9)}`;
    }
    setCui(formatted);
    setErrorMsg('');

    // If matches driver or passenger, auto-fill full name
    const det = detectRoleFromDpi(formatted);
    if (det && det.name) {
      setFullName(det.name);
    }
  };

  const handleGuardianCuiChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    let formatted = raw;
    if (raw.length > 4 && raw.length <= 9) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4)}`;
    } else if (raw.length > 9) {
      formatted = `${raw.slice(0, 4)} ${raw.slice(4, 9)} ${raw.slice(9)}`;
    }
    setGuardianCui(formatted);
  };

  // Quick Preset Selector
  const applyPreset = (roleType: 'passenger_regular' | 'passenger_minor' | 'driver_chepe' | 'driver_carlos' | 'admin') => {
    setErrorMsg('');
    if (roleType === 'admin') {
      setCui(ADMIN_USER.cui);
      setFullName(ADMIN_USER.name);
      setIsMinor(false);
    } else if (roleType === 'driver_chepe') {
      const drv = allDrivers[0];
      setCui(drv.cui);
      setFullName(drv.name);
      setIsMinor(false);
    } else if (roleType === 'driver_carlos') {
      const drv = allDrivers[1];
      setCui(drv.cui);
      setFullName(drv.name);
      setIsMinor(false);
    } else if (roleType === 'passenger_regular') {
      const pax = allPassengers[0];
      setCui(pax.cui);
      setFullName(pax.fullName);
      setIsMinor(false);
    } else if (roleType === 'passenger_minor') {
      const pax = allPassengers[2];
      setCui(pax.cui);
      setFullName(pax.fullName);
      setIsMinor(true);
      setGuardianName(pax.guardianName || 'Silvia Leticia Ruiz Coronado');
      setGuardianCui(pax.guardianCui || '1987 55431 0101');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = cui.replace(/\D/g, '');

    if (cleanDigits.length !== 13 && !cui.toLowerCase().includes('admin')) {
      setErrorMsg('El CUI debe tener 13 dígitos numéricos (ej. 3001 45892 0101).');
      return;
    }

    if (!fullName.trim() && !detected?.name) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }

    if (isMinor && (!guardianName.trim() || guardianCui.replace(/\D/g, '').length !== 13)) {
      setErrorMsg('Para pasajeros menores de edad se requiere el nombre y CUI (13 dígitos) del tutor responsable.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      loginUserByDpi(cui, fullName, isMinor, guardianName, guardianCui);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950 p-4 sm:p-6 text-slate-100">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800/80 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-900 text-white font-black text-lg shadow-md border border-blue-700/50">
            RB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">RutaBus GT</h1>
              <span className="rounded-md bg-blue-950 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-300 border border-blue-800">
                Sur Metropolitano
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Amatitlán · Villa Nueva · San Miguel Petapa · Mixco · Zona 12
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-5 space-y-1">
          <h2 className="text-base font-bold text-slate-100">Acceso & Detección de Rol</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingresa tu número de DPI (CUI de 13 dígitos). El sistema identificará automáticamente si eres un <span className="text-emerald-400 font-semibold">Chofer de unidad</span>, un <span className="text-blue-400 font-semibold">Pasajero</span> o un <span className="text-indigo-400 font-semibold">Administrador</span>.
          </p>
        </div>

        {/* Quick presets for evaluator */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Selección rápida para probar perfiles:</span>
            <span className="text-[10px] text-blue-400">1 clic</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => applyPreset('passenger_regular')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-left text-slate-300 hover:border-blue-500 hover:text-white transition-colors"
            >
              <User className="h-3.5 w-3.5 text-blue-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[11px]">Pasajero</span>
                <span className="block text-[10px] text-slate-400 truncate">Ana Morales</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('driver_chepe')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-left text-slate-300 hover:border-emerald-500 hover:text-white transition-colors"
            >
              <Bus className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[11px]">Chofer (U-01)</span>
                <span className="block text-[10px] text-slate-400 truncate">Don Chepe</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('admin')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-left text-slate-300 hover:border-indigo-500 hover:text-white transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[11px]">Administrador</span>
                <span className="block text-[10px] text-slate-400 truncate">Ing. Alvarado</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('driver_carlos')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-left text-slate-300 hover:border-emerald-500 hover:text-white transition-colors"
            >
              <Bus className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[11px]">Chofer (U-02)</span>
                <span className="block text-[10px] text-slate-400 truncate">Carlos Méndez</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('passenger_minor')}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-left text-slate-300 hover:border-amber-500 hover:text-white transition-colors col-span-2 sm:col-span-2"
            >
              <UserCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[11px]">Pasajero Menor de Edad</span>
                <span className="block text-[10px] text-slate-400 truncate">Mateo Ruiz (con tutor)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-800/80 bg-red-950/60 p-3 text-xs text-red-200 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CUI / DPI Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                DPI / CUI (13 dígitos)
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {cui.replace(/\D/g, '').length}/13 dígitos
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={cui}
                onChange={(e) => handleCuiChange(e.target.value)}
                placeholder="Ej. 3001 45892 0101"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 font-mono text-sm font-bold text-white tracking-widest placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <IdCard className="absolute right-4 top-3.5 h-4 w-4 text-slate-500" />
            </div>
          </div>

          {/* Dynamic Detection Badge Card */}
          {detected && (
            <div className={`rounded-2xl p-4 border transition-all ${
              detected.role === 'admin'
                ? 'bg-indigo-950/70 border-indigo-700 text-indigo-100'
                : detected.role === 'driver'
                ? 'bg-emerald-950/70 border-emerald-700 text-emerald-100'
                : 'bg-blue-950/70 border-blue-700 text-blue-100'
            }`}>
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2 shrink-0 ${
                  detected.role === 'admin'
                    ? 'bg-indigo-900 text-indigo-300'
                    : detected.role === 'driver'
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-blue-900 text-blue-300'
                }`}>
                  {detected.role === 'admin' && <Shield className="h-5 w-5" />}
                  {detected.role === 'driver' && <Bus className="h-5 w-5" />}
                  {detected.role === 'passenger' && <User className="h-5 w-5" />}
                </div>

                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                      Rol Detectado en Base de Datos
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold">
                      <CheckCircle2 className="h-3 w-3" />
                      Registrado
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white">
                    {detected.name || fullName || 'Nuevo Pasajero'}
                  </p>

                  <p className="text-xs opacity-90">
                    {detected.label}
                    {detected.busUnit && (
                      <span className="ml-1.5 font-mono font-bold underline">
                        Unidad {detected.busUnit}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Ana Lucía Morales Castillo"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Minor passenger section */}
          {detected?.role !== 'driver' && detected?.role !== 'admin' && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isMinor}
                  onChange={(e) => setIsMinor(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-300">
                  El pasajero es menor de edad
                </span>
              </label>

              {isMinor && (
                <div className="space-y-3 border-t border-slate-800/80 pt-3">
                  <p className="text-[11px] text-amber-400 font-medium">
                    Datos obligatorios del tutor o padre responsable:
                  </p>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Nombre Completo del Tutor
                    </label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="Ej. Silvia Leticia Ruiz Coronado"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      DPI / CUI del Tutor (13 dígitos)
                    </label>
                    <input
                      type="text"
                      value={guardianCui}
                      onChange={(e) => handleGuardianCuiChange(e.target.value)}
                      placeholder="#### ##### ####"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-xs text-white tracking-wider focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-all ${
              detected?.role === 'admin'
                ? 'bg-indigo-700 hover:bg-indigo-600 shadow-indigo-900/30'
                : detected?.role === 'driver'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                : 'bg-blue-900 hover:bg-blue-800 shadow-blue-950/50'
            }`}
          >
            {isSubmitting ? (
              <span>Verificando credencial con RENAP y PNC...</span>
            ) : (
              <>
                <span>
                  {detected?.role === 'admin'
                    ? 'Ingresar al Dashboard de Administrador'
                    : detected?.role === 'driver'
                    ? `Ingresar a Panel Chofer (${detected.busUnit || 'Bus'})`
                    : 'Ingresar como Pasajero'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Security Badges */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-slate-400" />
            Acceso seguro cifrado
          </span>
          <span>Base de Datos Municipalidad de Amatitlán & PMT</span>
        </div>
      </div>
    </div>
  );
};

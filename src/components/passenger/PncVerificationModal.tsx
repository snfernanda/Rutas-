import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ShieldAlert, ShieldCheck, UserCheck, AlertTriangle, X, Check, RefreshCw } from 'lucide-react';
import { PncStatus } from '../../types';

interface PncVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PncVerificationModal: React.FC<PncVerificationModalProps> = ({ isOpen, onClose }) => {
  const { currentPassenger, loginPassenger, updatePncStatus } = useApp();

  const [cui, setCui] = useState(currentPassenger.cui || '3001 45892 0101');
  const [fullName, setFullName] = useState(currentPassenger.fullName || 'Ana Lucía Morales Castillo');
  const [isMinor, setIsMinor] = useState(currentPassenger.isMinor || false);
  const [guardianName, setGuardianName] = useState(currentPassenger.guardianName || '');
  const [guardianCui, setGuardianCui] = useState(currentPassenger.guardianCui || '');

  // Verification simulation states
  const [isCheckingPnc, setIsCheckingPnc] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PncStatus | null>(currentPassenger.pncStatus);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

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

  const runPncCheck = (forcedStatus?: PncStatus) => {
    const cleanDigits = cui.replace(/\s+/g, '');
    if (cleanDigits.length !== 13) {
      setErrorMsg('El CUI debe tener exactamente 13 dígitos numéricos según RENAP.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (isMinor && (!guardianName.trim() || guardianCui.replace(/\s+/g, '').length !== 13)) {
      setErrorMsg('Para menores de edad, el nombre y CUI del tutor responsable son obligatorios.');
      return;
    }

    setIsCheckingPnc(true);
    setErrorMsg('');

    // Simulate PNC API latency
    setTimeout(() => {
      setIsCheckingPnc(false);
      const outcome: PncStatus = forcedStatus || (cui.endsWith('9') ? 'criminal_record' : 'clean');
      setVerificationResult(outcome);
      updatePncStatus(outcome);
      loginPassenger(cui, fullName, isMinor, guardianName, guardianCui);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Identificación & Verificación PNC</h3>
            <p className="text-xs text-slate-500">Policía Nacional Civil de Guatemala (Simulador)</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Por seguridad en los buses de la ruta al sur, los pasajeros deben ingresar su CUI (DPI de 13 dígitos) para validar antecedentes.
        </p>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="space-y-3.5">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Ana Lucía Morales Castillo"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-900 focus:outline-none"
            />
          </div>

          {/* CUI */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">DPI / CUI (13 dígitos)</label>
              <span className="text-[11px] font-mono text-slate-400">
                {cui.replace(/\s+/g, '').length}/13
              </span>
            </div>
            <input
              type="text"
              value={cui}
              onChange={(e) => handleCuiChange(e.target.value)}
              placeholder="#### ##### ####"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 tracking-wider focus:border-blue-900 focus:outline-none"
            />
          </div>

          {/* Menor de edad toggle */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMinor}
                onChange={(e) => setIsMinor(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-xs font-semibold text-slate-700">El pasajero es menor de edad</span>
            </label>

            {isMinor && (
              <div className="mt-3 space-y-2.5 border-t border-slate-200 pt-3">
                <p className="text-[11px] text-amber-700 font-medium">
                  Requerido: Datos del tutor o padre responsable
                </p>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Nombre del Tutor</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Ej. Silvia Leticia Ruiz Coronado"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">DPI del Tutor (13 dígitos)</label>
                  <input
                    type="text"
                    value={guardianCui}
                    onChange={(e) => handleGuardianCuiChange(e.target.value)}
                    placeholder="#### ##### ####"
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-900 tracking-wider focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PNC Verification Status Box */}
          {verificationResult && (
            <div className={`rounded-xl p-3.5 border ${
              verificationResult === 'clean' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-red-50 border-red-200 text-red-900'
            }`}>
              <div className="flex items-start gap-2.5">
                {verificationResult === 'clean' ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-bold">
                    {verificationResult === 'clean' 
                      ? 'VERIFICACIÓN PNC: LIMPIO' 
                      : 'VERIFICACIÓN PNC: CON ANTECEDENTES'}
                  </p>
                  <p className="text-[11px] mt-0.5">
                    {verificationResult === 'clean' 
                      ? 'El CUI no registra órdenes de captura ni antecedentes policiales activos. Apto para viajar.'
                      : 'Observación en base policial. Se requerirá inspección adicional en abordaje.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => runPncCheck()}
              disabled={isCheckingPnc}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-900 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:opacity-50 transition-colors"
            >
              {isCheckingPnc ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Consultando base PNC...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Validar DPI con PNC y Guardar</span>
                </>
              )}
            </button>

            {/* Quick Mock Status Toggles for the Evaluator */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
              <span>Probar simulación rápida:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => runPncCheck('clean')}
                  className="rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-800 hover:bg-emerald-200"
                >
                  Forzar Limpio
                </button>
                <button
                  type="button"
                  onClick={() => runPncCheck('criminal_record')}
                  className="rounded-md bg-red-100 px-2 py-1 font-semibold text-red-800 hover:bg-red-200"
                >
                  Forzar Antecedentes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

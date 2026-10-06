import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IncidentReport } from '../../types';
import { AlertTriangle, X, Check, Send } from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ isOpen, onClose }) => {
  const { currentDriver, reportIncident } = useApp();

  const [type, setType] = useState<IncidentReport['type']>('trafico');
  const [location, setLocation] = useState('Km 14.5 CA-9 Sur (Villalobos)');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'baja' | 'media' | 'alta'>('media');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Por favor agrega un breve detalle de la incidencia.');
      return;
    }

    reportIncident(type, location, description, severity);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setDescription('');
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Reportar Incidencia</h3>
            <p className="text-xs text-slate-500">Unidad {currentDriver.assignedBusId.toUpperCase()} · Central RutaBus</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Evento</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IncidentReport['type'])}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-red-600 focus:outline-none"
            >
              <option value="trafico">Tráfico Pesado / Retención</option>
              <option value="mecanico">Falla Mecánica / Avería</option>
              <option value="accidente">Accidente Vial</option>
              <option value="bloqueo">Bloqueo o Manifestación</option>
              <option value="otro">Desvío de Tránsito / Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ubicación / Kilómetro</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Km 14.5 CA-9 Sur Villalobos"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Severidad</label>
            <div className="grid grid-cols-3 gap-2">
              {(['baja', 'media', 'alta'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverity(sev)}
                  className={`rounded-lg py-1.5 text-xs font-bold uppercase transition-colors ${
                    severity === sev
                      ? sev === 'alta' ? 'bg-red-600 text-white' : sev === 'media' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción de la Situación</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo sucedido y el retraso estimado..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-red-600 focus:outline-none"
            />
          </div>

          {submitted ? (
            <div className="rounded-xl bg-emerald-600 py-2.5 text-center text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4" />
              <span>Reporte emitido a la Central de Control</span>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar Reporte Inmediato</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

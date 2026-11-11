import React, { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  MessageSquare,
  MapPin,
  Bell,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [geofenceRadius, setGeofenceRadius] = useState(15);
  const [criticalNotifSound, setCriticalNotifSound] = useState(true);
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [toast, setToast] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Parámetros de configuración guardados correctamente.');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-800" />
          Configuración General de la Plataforma
        </h2>
        <p className="text-xs text-slate-500">
          Ajustes de infraestructura en la nube, pasarelas de alertas y geocercas para Huasao y Saylla
        </p>
      </div>

      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Card 1: Cloud & Firebase Architecture */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Infraestructura Cloud y Almacenamiento (Firebase)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Capa de persistencia Firestore, Firebase Auth y Cloud Storage
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Capa de Servicios Activa
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Firebase Auth</span>
              <p className="text-[11px] text-slate-500 mb-2">
                Sesión y control RBAC: Administrador, Monitor, Ciudadano.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Listo para producción
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Firestore DB</span>
              <p className="text-[11px] text-slate-500 mb-2">
                Colecciones: incidentes, usuarios, alertas, cámaras y fauna.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Esquema sincronizado
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Cloud Storage</span>
              <p className="text-[11px] text-slate-500 mb-2">
                Almacén seguro para fotografías de incidentes y dron.
              </p>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Previsualización activa
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: WhatsApp Gateway Integration */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Canal Ciudadano WhatsApp Business API
                </h3>
                <p className="text-[11px] text-slate-500">
                  Recepción de reportes y geolocalización desde teléfonos comunales
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Integración Pendiente
            </span>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>Estado del Webhook Oficial de WhatsApp:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              La arquitectura del sistema está preparada para recepcionar webhooks de WhatsApp Cloud API. Para vincular un número municipal oficial, se requerirá registrar el Webhook Endpoint de BioVigía en Meta for Developers.
            </p>
          </div>
        </div>

        {/* Card 3: Geocerca y Parámetros GIS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Parámetros Territoriales y Geocerca (Cusco)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Radio de cobertura activa sobre Huasao, Saylla y Río Huatanay
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Radio de Cobertura de Geocerca: {geofenceRadius} km
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(parseInt(e.target.value))}
                className="w-full accent-emerald-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Cubre distritos de Saylla, Huasao, Oropesa y Lucre.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criticalNotifSound}
                  onChange={(e) => setCriticalNotifSound(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Alerta sonora inmediata ante incidentes de prioridad Crítica</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAssignment}
                  onChange={(e) => setAutoAssignment(e.target.checked)}
                  className="rounded text-emerald-700"
                />
                <span>Sugerir monitor ambiental más cercano por sector geográfico</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
          >
            Guardar Cambios de Configuración
          </button>
        </div>
      </form>
    </div>
  );
};

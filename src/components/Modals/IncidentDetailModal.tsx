import React, { useState } from 'react';
import { Incident, IncidentStatus } from '../../types';
import { useIncidents } from '../../contexts/IncidentsContext';
import { useAuth } from '../../contexts/AuthContext';
import { DataService } from '../../services/dataService';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
} from '../../utils/analytics';
import {
  X,
  MapPin,
  Calendar,
  UserCheck,
  Clock,
  CheckCircle,
  AlertOctagon,
  ShieldAlert,
  Send,
  ExternalLink,
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({ incident, onClose }) => {
  const { updateIncident } = useIncidents();
  const { canChangeStatus, canAssignMonitors, currentUser } = useAuth();

  const [newStatus, setNewStatus] = useState<IncidentStatus>(incident?.status || 'pendiente');
  const [selectedMonitor, setSelectedMonitor] = useState(incident?.assignedMonitor || '');
  const [newNote, setNewNote] = useState('');
  const [successToast, setSuccessToast] = useState('');

  if (!incident) return null;

  const monitors = DataService.getUsers().filter((u) => u.role === 'monitor' || u.role === 'admin');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<Incident> = {};

    if (newStatus !== incident.status) {
      updates.status = newStatus;
    }

    if (selectedMonitor !== incident.assignedMonitor) {
      updates.assignedMonitor = selectedMonitor;
    }

    if (newNote.trim()) {
      updates.notes = incident.notes
        ? `${incident.notes}\n[${new Date().toLocaleTimeString()} ${currentUser?.name || ''}]: ${newNote.trim()}`
        : newNote.trim();
    }

    if (Object.keys(updates).length > 0) {
      updateIncident(incident.id, updates);
      setSuccessToast('Incidente actualizado correctamente.');
      setNewNote('');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const typeColor = INCIDENT_TYPE_COLORS[incident.type] || '#15803D';

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-mono font-bold px-2.5 py-1 rounded-md text-white shadow-xs"
              style={{ backgroundColor: typeColor }}
            >
              {incident.id}
            </span>
            <div>
              <h3 className="text-base font-bold text-white line-clamp-1">{incident.title}</h3>
              <p className="text-xs text-slate-300">
                {INCIDENT_TYPE_LABELS[incident.type]} • {incident.sector}, {incident.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Photo & Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Photo */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-56 sm:h-64 shadow-xs">
              <img
                src={incident.imageUrl}
                alt={incident.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as any).src =
                    'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg text-white flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
                </span>
                <span className="font-semibold text-emerald-300 capitalize">{incident.district}</span>
              </div>
            </div>

            {/* Right: Quick facts */}
            <div className="space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Estado actual:</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      incident.status === 'resuelto'
                        ? 'bg-emerald-100 text-emerald-800'
                        : incident.status === 'atencion'
                        ? 'bg-blue-100 text-blue-800'
                        : incident.status === 'verificacion'
                        ? 'bg-purple-100 text-purple-800'
                        : incident.status === 'cerrado'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {STATUS_LABELS[incident.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Prioridad:</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                      incident.priority === 'critica'
                        ? 'bg-red-100 text-red-700'
                        : incident.priority === 'alta'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {PRIORITY_LABELS[incident.priority]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Fecha del reporte:</span>
                  <span className="text-xs font-medium text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {incident.date}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Reportante:</span>
                  <span className="text-xs font-medium text-slate-800">{incident.reporterName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Medio / Canal:</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {incident.reportChannel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Monitor responsable:</span>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {incident.assignedMonitor || 'Sin asignar aún'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">Descripción:</span>
                <p className="text-slate-600 leading-relaxed">{incident.description}</p>
              </div>
            </div>
          </div>

          {/* Action form for Status & Monitor Assignment */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              Gestión Administrativa y Asignación
            </h4>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Status Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actualizar Estado
                  </label>
                  <select
                    disabled={!canChangeStatus}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="verificacion">En verificación</option>
                    <option value="atencion">En atención</option>
                    <option value="resuelto">Resuelto</option>
                    <option value="cerrado">Cerrado</option>
                  </select>
                  {!canChangeStatus && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      * Requiere rol de Administrador o Monitor
                    </span>
                  )}
                </div>

                {/* Monitor Assignment */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asignar Monitor Ambiental
                  </label>
                  <select
                    disabled={!canAssignMonitors}
                    value={selectedMonitor}
                    onChange={(e) => setSelectedMonitor(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">-- Seleccionar monitor --</option>
                    {monitors.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.assignedZone || 'General'})
                      </option>
                    ))}
                  </select>
                  {!canAssignMonitors && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      * Requiere rol de Administrador
                    </span>
                  )}
                </div>
              </div>

              {/* Add Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agregar Nota u Observación de Campo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escriba un reporte o instrucción de seguimiento..."
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Audit History Timeline */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Historial de Acciones y Auditoría
            </h4>
            <div className="space-y-2 border-l-2 border-emerald-200 ml-2 pl-4">
              {incident.history && incident.history.length > 0 ? (
                incident.history.map((h, i) => (
                  <div key={i} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                    <div className="flex items-center justify-between text-slate-500 text-[11px] mb-0.5">
                      <span className="font-semibold text-slate-800">{h.author}</span>
                      <span>{h.date}</span>
                    </div>
                    <p className="text-slate-600">{h.action}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No hay registros previos de historial.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            BioVigía 2.0 • Humedales de Huasao y Saylla, Cusco
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

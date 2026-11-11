import React, { useState } from 'react';
import { useIncidents } from '../contexts/IncidentsContext';
import { useAuth } from '../contexts/AuthContext';
import { Incident, IncidentStatus } from '../types';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from '../utils/analytics';
import { DataService } from '../services/dataService';
import {
  BellRing,
  CheckCircle,
  Clock,
  UserCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const CitizenAlertsPage: React.FC = () => {
  const { incidents, updateIncident, setSelectedIncident } = useIncidents();
  const { canChangeStatus, canAssignMonitors, role } = useAuth();

  // Filter alerts (typically reports created by citizens or mobile/whatsapp channels)
  const [selectedAlert, setSelectedAlert] = useState<Incident>(incidents[0] || null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionFeedback, setActionFeedback] = useState('');

  const citizenAlerts = incidents.filter((i) => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    return true;
  });

  const monitors = DataService.getUsers().filter((u) => u.role === 'monitor' || u.role === 'admin');

  const handleUpdateStatus = (status: IncidentStatus) => {
    if (!selectedAlert) return;
    updateIncident(selectedAlert.id, { status });
    setSelectedAlert({ ...selectedAlert, status });
    setActionFeedback(`Alerta actualizada a "${STATUS_LABELS[status]}".`);
    setTimeout(() => setActionFeedback(''), 3000);
  };

  const handleAssignMonitor = (monitorName: string) => {
    if (!selectedAlert) return;
    updateIncident(selectedAlert.id, {
      assignedMonitor: monitorName,
      status: selectedAlert.status === 'pendiente' ? 'verificacion' : selectedAlert.status,
    });
    setSelectedAlert({
      ...selectedAlert,
      assignedMonitor: monitorName,
      status: selectedAlert.status === 'pendiente' ? 'verificacion' : selectedAlert.status,
    });
    setActionFeedback(`Monitor asignado: ${monitorName}`);
    setTimeout(() => setActionFeedback(''), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-emerald-800" />
            Alertas Ciudadanas y Reportes Comunitarios
          </h2>
          <p className="text-xs text-slate-500">
            Mesa de control y triaje de denuncias ambientales en Huasao y Saylla
          </p>
        </div>

        {/* WhatsApp Integration Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs">
          <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-emerald-950">Canal WhatsApp Oficial:</span>{' '}
            <span className="text-emerald-700 font-medium">Vinculación pendiente de API oficial</span>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Split Layout: Table on Left + Inspection Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Alerts Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Table Header Filter */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-800">
              Bandeja de Entrada ({citizenAlerts.length})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filtrar:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="verificacion">En verificación</option>
                <option value="atencion">En atención</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-3">Tipo Incidente</th>
                  <th className="py-3 px-3">Ubicación</th>
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Prioridad</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {citizenAlerts.map((alert) => {
                  const isSelected = selectedAlert?.id === alert.id;
                  const typeColor = INCIDENT_TYPE_COLORS[alert.type];

                  return (
                    <tr
                      key={alert.id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/90 font-medium' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {alert.id}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: typeColor }}
                        >
                          {INCIDENT_TYPE_LABELS[alert.type]}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[130px]">
                        {alert.sector}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {alert.date.split(' ')[0]}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            alert.priority === 'critica'
                              ? 'bg-red-100 text-red-700'
                              : alert.priority === 'alta'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {PRIORITY_LABELS[alert.priority]}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            alert.status === 'resuelto'
                              ? 'bg-emerald-100 text-emerald-800'
                              : alert.status === 'atencion'
                              ? 'bg-blue-100 text-blue-800'
                              : alert.status === 'verificacion'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {STATUS_LABELS[alert.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlert(alert);
                          }}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
                        >
                          Examinar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Detailed Inspection Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          {selectedAlert ? (
            <div className="space-y-4">
              {/* Header of alert */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-0.5 rounded">
                      {selectedAlert.id}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: INCIDENT_TYPE_COLORS[selectedAlert.type] }}
                    >
                      {INCIDENT_TYPE_LABELS[selectedAlert.type]}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {selectedAlert.title}
                  </h3>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    selectedAlert.status === 'resuelto'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedAlert.status === 'atencion'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {STATUS_LABELS[selectedAlert.status]}
                </span>
              </div>

              {/* Photo preview */}
              <div className="relative rounded-xl overflow-hidden h-44 border border-slate-200 bg-slate-100">
                <img
                  src={selectedAlert.imageUrl}
                  alt={selectedAlert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-mono">
                  {selectedAlert.lat.toFixed(4)}, {selectedAlert.lng.toFixed(4)}
                </div>
              </div>

              {/* Description & Location Facts */}
              <div className="text-xs space-y-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-700 block mb-0.5">Descripción reportada:</span>
                  <p className="text-slate-600 leading-relaxed">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block">Ubicación y Sector:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.sector} ({selectedAlert.district})</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block">Reportante:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.reporterName}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block">Fecha y Canal:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.date} ({selectedAlert.reportChannel})</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 block">Monitor Asignado:</span>
                    <span className="font-bold text-emerald-800">{selectedAlert.assignedMonitor || 'Sin asignar'}</span>
                  </div>
                </div>

                {selectedAlert.notes && (
                  <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl text-[11px]">
                    <span className="font-bold text-amber-900 block mb-0.5">Notas internas:</span>
                    <p className="text-amber-800 whitespace-pre-line">{selectedAlert.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons as Required by Prompt */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Acciones Rápidas de Triaje
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={!canChangeStatus}
                    onClick={() => handleUpdateStatus('verificacion')}
                    className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-700" />
                    <span>Validar alerta</span>
                  </button>

                  <button
                    disabled={!canChangeStatus}
                    onClick={() => handleUpdateStatus('resuelto')}
                    className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Marcar atendida</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Assign Monitor Dropdown */}
                  <select
                    disabled={!canAssignMonitors}
                    value={selectedAlert.assignedMonitor || ''}
                    onChange={(e) => handleAssignMonitor(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-xl p-2 bg-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100"
                  >
                    <option value="">-- Asignar monitor --</option>
                    {monitors.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>

                  <button
                    disabled={!canChangeStatus}
                    onClick={() => handleUpdateStatus('cerrado')}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cerrar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>Selecciona una alerta de la tabla para inspeccionarla.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

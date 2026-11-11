import React, { useState, useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentsContext';
import { useAuth } from '../contexts/AuthContext';
import { Incident, IncidentStatus, IncidentPriority } from '../types';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  filterIncidents,
} from '../utils/analytics';
import { DataService } from '../services/dataService';
import {
  ClipboardList,
  Search,
  Filter,
  PlusCircle,
  Eye,
  Edit3,
  UserCheck,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const IncidentManagementPage: React.FC = () => {
  const { incidents, setSelectedIncident, openNewIncidentModal, updateIncident } = useIncidents();
  const { canChangeStatus, canAssignMonitors, role } = useAuth();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [feedback, setFeedback] = useState('');

  // Monitors for quick assignment
  const monitors = useMemo(
    () => DataService.getUsers().filter((u) => u.role === 'monitor' || u.role === 'admin'),
    []
  );

  // Filter and sort
  const filteredList = useMemo(() => {
    let result = filterIncidents(incidents, {
      search,
      type: typeFilter,
      status: statusFilter,
      priority: priorityFilter,
    });

    result = result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [incidents, search, typeFilter, statusFilter, priorityFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleQuickStatusChange = (incident: Incident, newStatus: IncidentStatus) => {
    updateIncident(incident.id, { status: newStatus });
    setFeedback(`Incidente ${incident.id} actualizado a "${STATUS_LABELS[newStatus]}".`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleQuickAssign = (incident: Incident, monitorName: string) => {
    updateIncident(incident.id, {
      assignedMonitor: monitorName,
      status: incident.status === 'pendiente' ? 'verificacion' : incident.status,
    });
    setFeedback(`Monitor ${monitorName} asignado al incidente ${incident.id}.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-emerald-800" />
            Gestión Administrativa de Incidentes
          </h2>
          <p className="text-xs text-slate-500">
            Seguimiento técnico, asignación de brigadas y ciclo de vida de denuncias ecológicas
          </p>
        </div>

        <button
          onClick={() => openNewIncidentModal()}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all active:scale-98"
        >
          <PlusCircle className="w-4 h-4 text-lime-300" />
          <span>+ Registrar Nuevo Incidente</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por código, título, reportante, sector..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Category filter */}
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white outline-none"
        >
          <option value="all">Todas las Categorías</option>
          <option value="residuos">Residuos Sólidos</option>
          <option value="incendio">Incendios</option>
          <option value="agua">Contaminación de Agua</option>
          <option value="fauna">Fauna Afectada</option>
          <option value="vegetacion">Tala / Vegetación</option>
          <option value="otros">Otros</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white outline-none"
        >
          <option value="all">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="verificacion">En verificación</option>
          <option value="atencion">En atención</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white outline-none"
        >
          <option value="all">Todas las Prioridades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        {/* Sort order */}
        <button
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="text-xs border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700" />
          <span>{sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Código / Imagen</th>
                <th className="py-3 px-3">Título & Sector</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Fecha Reporte</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3">Monitor Asignado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron incidentes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedList.map((inc) => {
                  const typeColor = INCIDENT_TYPE_COLORS[inc.type];

                  return (
                    <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={inc.imageUrl}
                            alt={inc.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as any).src =
                                'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">{inc.id}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{inc.reportChannel}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-800 line-clamp-1 max-w-[220px]">{inc.title}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[190px]">{inc.sector}</span>
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: typeColor }}
                        >
                          {INCIDENT_TYPE_LABELS[inc.type]}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                        {inc.date}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            inc.priority === 'critica'
                              ? 'bg-red-100 text-red-700'
                              : inc.priority === 'alta'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {PRIORITY_LABELS[inc.priority]}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {canChangeStatus ? (
                          <select
                            value={inc.status}
                            onChange={(e) => handleQuickStatusChange(inc, e.target.value as IncidentStatus)}
                            className={`text-[10px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                              inc.status === 'resuelto'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : inc.status === 'atencion'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : inc.status === 'verificacion'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="verificacion">En verificación</option>
                            <option value="atencion">En atención</option>
                            <option value="resuelto">Resuelto</option>
                            <option value="cerrado">Cerrado</option>
                          </select>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              inc.status === 'resuelto'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {STATUS_LABELS[inc.status]}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {canAssignMonitors ? (
                          <select
                            value={inc.assignedMonitor || ''}
                            onChange={(e) => handleQuickAssign(inc, e.target.value)}
                            className="text-[11px] border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none max-w-[140px] truncate"
                          >
                            <option value="">-- Sin asignar --</option>
                            {monitors.map((m) => (
                              <option key={m.id} value={m.name}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-700">
                            {inc.assignedMonitor || 'Sin asignar'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedIncident(inc)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors"
                            title="Ver detalles completos"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {canChangeStatus && inc.status !== 'cerrado' && (
                            <button
                              onClick={() => handleQuickStatusChange(inc, 'resuelto')}
                              className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              title="Marcar como resuelto"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Mostrando <strong>{paginatedList.length}</strong> de <strong>{filteredList.length}</strong> incidentes
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentsContext';
import { IncidentMap } from '../components/Map/IncidentMap';
import { Incident, IncidentType, IncidentStatus, IncidentPriority } from '../types';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  filterIncidents,
} from '../utils/analytics';
import {
  Search,
  Filter,
  MapPin,
  PlusCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Flame,
  Trash2,
  Droplet,
  HeartCrack,
  Camera,
  Calendar,
} from 'lucide-react';

export const IncidentMapPage: React.FC = () => {
  const {
    incidents,
    monitoringPoints,
    selectedIncident,
    setSelectedIncident,
    openNewIncidentModal,
  } = useIncidents();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filteredIncidents = useMemo(() => {
    return filterIncidents(incidents, {
      search,
      type: typeFilter,
      status: statusFilter,
      priority: priorityFilter,
      district: districtFilter,
    });
  }, [incidents, search, typeFilter, statusFilter, priorityFilter, districtFilter]);

  const handleSelectIncidentFromList = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mapa Georreferenciado de Incidentes
          </h2>
          <p className="text-xs text-slate-500">
            Humedales de Huasao y Saylla, Río Huatanay • Cusco, Perú
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewIncidentModal()}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4 text-lime-300" />
            <span>+ Registrar Incidente</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, título, reportante..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Todas las Categorías</option>
          <option value="residuos">🗑️ Residuos Sólidos</option>
          <option value="incendio">🔥 Incendios</option>
          <option value="agua">💧 Calidad del Agua</option>
          <option value="fauna">🐾 Fauna Silvestre</option>
          <option value="vegetacion">🌿 Tala / Vegetación</option>
          <option value="otros">Otros</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="verificacion">En verificación</option>
          <option value="atencion">En atención</option>
          <option value="resuelto">Resuelto</option>
          <option value="cerrado">Cerrado</option>
        </select>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Todas las Prioridades</option>
          <option value="critica">🔴 Crítica</option>
          <option value="alta">🟠 Alta</option>
          <option value="media">🟡 Media</option>
          <option value="baja">🟢 Baja</option>
        </select>

        {/* District Filter */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="all">Todos los Distritos</option>
          <option value="Saylla">Saylla</option>
          <option value="Huasao">Huasao</option>
          <option value="Oropesa">Oropesa</option>
        </select>

        {(search || typeFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || districtFilter !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setStatusFilter('all');
              setPriorityFilter('all');
              setDistrictFilter('all');
            }}
            className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Main Map + Synchronized Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Leaflet Map Interactive Canvas */}
        <div className="lg:col-span-8 order-2 lg:order-1">
          <IncidentMap
            incidents={filteredIncidents}
            monitoringPoints={monitoringPoints}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            height="620px"
            showFilters={true}
          />
        </div>

        {/* Synchronized Side List of Incidents */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col h-[620px] bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header of list */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Registros Sincronizados ({filteredIncidents.length})
            </span>
            <span className="text-[10px] text-slate-500">Haz clic para centrar en el mapa</span>
          </div>

          {/* Incidents Scrollable Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400 text-xs">
                <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">No se encontraron incidentes</p>
                <p className="text-[11px] mt-1">Prueba cambiando o limpiando los filtros de búsqueda.</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const isSelected = selectedIncident?.id === incident.id;
                const pinColor = INCIDENT_TYPE_COLORS[incident.type];

                return (
                  <div
                    key={incident.id}
                    onClick={() => handleSelectIncidentFromList(incident)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: pinColor }}
                      >
                        {incident.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          incident.status === 'resuelto'
                            ? 'bg-emerald-100 text-emerald-800'
                            : incident.status === 'atencion'
                            ? 'bg-blue-100 text-blue-800'
                            : incident.status === 'verificacion'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {STATUS_LABELS[incident.status]}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 leading-snug mb-1 line-clamp-1">
                      {incident.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {incident.description}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 truncate max-w-[170px]">
                        <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{incident.sector}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <span>Ver</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

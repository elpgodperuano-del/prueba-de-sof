import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncidents } from '../contexts/IncidentsContext';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from '../utils/analytics';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
  Shield,
  Activity,
  PlusCircle,
  Eye,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { stats, incidents, setSelectedIncident, openNewIncidentModal } = useIncidents();
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'dia' | 'semana' | 'mes'>('semana');

  // Bar chart data according to timeframe
  const barChartData = useMemo(() => {
    if (timeframe === 'dia') {
      return [
        { name: '06:00', incidentes: 1, resueltos: 0 },
        { name: '09:00', incidentes: 3, resueltos: 1 },
        { name: '12:00', incidentes: 2, resueltos: 2 },
        { name: '15:00', incidentes: 4, resueltos: 2 },
        { name: '18:00', incidentes: 1, resueltos: 1 },
        { name: '21:00', incidentes: 0, resueltos: 0 },
      ];
    } else if (timeframe === 'semana') {
      return [
        { name: 'Lun', incidentes: 2, resueltos: 1 },
        { name: 'Mar', incidentes: 3, resueltos: 2 },
        { name: 'Mié', incidentes: 5, resueltos: 3 },
        { name: 'Jue', incidentes: 2, resueltos: 2 },
        { name: 'Vie', incidentes: 4, resueltos: 4 },
        { name: 'Sáb', incidentes: 3, resueltos: 1 },
        { name: 'Dom', incidentes: 1, resueltos: 1 },
      ];
    } else {
      return [
        { name: 'Semana 1', incidentes: 8, resueltos: 6 },
        { name: 'Semana 2', incidentes: 11, resueltos: 9 },
        { name: 'Semana 3', incidentes: 7, resueltos: 5 },
        { name: 'Semana 4', incidentes: 10, resueltos: 8 },
      ];
    }
  }, [timeframe]);

  // Donut chart category data
  const pieCategoryData = useMemo(() => {
    return [
      { name: 'Residuos Sólidos', value: stats.porTipo.residuos || 1, color: '#F97316' },
      { name: 'Incendios', value: stats.porTipo.incendio || 1, color: '#EF4444' },
      { name: 'Contam. Agua', value: stats.porTipo.agua || 1, color: '#0284C7' },
      { name: 'Fauna Afectada', value: stats.porTipo.fauna || 1, color: '#8B5CF6' },
      { name: 'Tala / Daño Veg.', value: stats.porTipo.vegetacion || 1, color: '#10B981' },
      { name: 'Otros', value: stats.porTipo.otros || 0, color: '#EAB308' },
    ];
  }, [stats]);

  // Line chart evolution over time
  const lineTrendData = [
    { mes: 'Jun', reportes: 4, atenciones: 3 },
    { mes: 'Jul', reportes: 7, atenciones: 6 },
    { mes: 'Ago', reportes: 12, atenciones: 9 },
    { mes: 'Set', reportes: 9, atenciones: 8 },
    { mes: 'Oct', reportes: 15, atenciones: 13 },
    { mes: 'Nov', reportes: incidents.length, atenciones: stats.resueltos },
  ];

  const recentIncidents = incidents.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Greeting */}
      <div className="bg-gradient-to-r from-[#064E3B] to-[#15803D] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-lime-400 text-emerald-950 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            BioVigía 2.0 • Sistema Activo
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
            Panel de Monitoreo Ambiental Huasao & Saylla
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Gestión en tiempo real de incidentes ecológicos, calidad de agua y protección de fauna silvestre en Cusco.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/mapa')}
            className="px-4 py-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold border border-emerald-400/30 flex items-center gap-2 transition-all"
          >
            <MapPin className="w-4 h-4 text-lime-300" />
            <span>Ver Mapa General</span>
          </button>
          <button
            onClick={() => openNewIncidentModal()}
            className="px-4 py-2 bg-lime-400 hover:bg-lime-300 text-emerald-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Registrar Incidente</span>
          </button>
        </div>

        {/* Decorative circle glow */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Statistical Cards (Calculated Dynamically from Available Records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registrados */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Incidentes
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 100% activo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Registrados en la plataforma</p>
        </div>

        {/* Incidentes Pendientes */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pendientes
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900">{stats.pendientes}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
              Por verificar
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requieren atención de brigada</p>
        </div>

        {/* Incidentes en Verificación / Atención */}
        <div className="bg-white rounded-2xl p-5 border border-blue-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              En Verificación
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-900">{stats.enVerificacion}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
              Monitores asignados
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Con toma de datos en campo</p>
        </div>

        {/* Incidentes Resueltos */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Resueltos
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-950">{stats.resueltos}</span>
            <span className="text-xs font-bold text-emerald-700">
              {stats.tasaResolucion}% tasa
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Atendidos favorablemente</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Incidentes por día, semana, mes */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                Frecuencia de Incidentes
              </h3>
              <p className="text-[11px] text-slate-500">Reportados vs. Atendidos</p>
            </div>

            {/* Timeframe selector: Día, Semana, Mes */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setTimeframe('dia')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  timeframe === 'dia' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Día
              </button>
              <button
                onClick={() => setTimeframe('semana')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  timeframe === 'semana' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTimeframe('mes')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  timeframe === 'mes' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mes
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="incidentes" name="Reportados" fill="#15803D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resueltos" name="Resueltos" fill="#65A30D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular / Donut Chart: Distribución por Categorías */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="mb-2 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Distribución por Categorías</h3>
            <p className="text-[11px] text-slate-500">Clasificación temática ambiental</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {pieCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} incidentes`, 'Cantidad']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 text-[11px]">
            {pieCategoryData.map((cat, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 truncate">{cat.name}:</span>
                <strong className="text-slate-900 font-bold ml-auto">{cat.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Line Chart + Humedal de Huasao Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Evolución temporal */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Evolución de Incidentes en el Tiempo</h3>
              <p className="text-[11px] text-slate-500">Tendencia mensual de alertas y efectividad</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold">
              Últimos 6 meses
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    borderRadius: '8px',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="reportes"
                  name="Alertas Registradas"
                  stroke="#15803D"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#15803D' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="atenciones"
                  name="Incidentes Resueltos"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#0284C7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjeta Informativa: Humedal de Huasao */}
        <div className="bg-gradient-to-br from-[#064E3B] to-[#042f24] rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-lime-400 text-emerald-950 px-2 py-0.5 rounded">
                Área de Conservación
              </span>
              <span className="text-xs text-emerald-200">Saylla, Cusco</span>
            </div>

            <h3 className="text-base font-black text-white mb-2 leading-tight">
              Humedal Ecológico de Huasao
            </h3>

            <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
              Ecosistema clave del Valle Sur del Cusco con más de 20 especies de aves andinas residentes y migratorias, bosques de queñuales y esculturas ecológicas.
            </p>

            <div className="space-y-2 text-xs bg-emerald-950/60 p-3 rounded-xl border border-emerald-800">
              <div className="flex justify-between">
                <span className="text-emerald-300">Superficie protegida:</span>
                <strong className="text-white">~45 Hectáreas</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">Calidad hídrica global:</span>
                <strong className="text-lime-300">74 / 100 (Buena)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300">Fauna prioritaria:</span>
                <strong className="text-white">Huallatas & Garzas</strong>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-800/80 flex items-center justify-between">
            <span className="text-[11px] text-emerald-300">Convenio SERNANP - Saylla</span>
            <button
              onClick={() => navigate('/monitoreo')}
              className="text-xs font-bold text-lime-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Ver monitoreo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Alertas e Incidentes Recientes en Saylla y Huasao
            </h3>
            <p className="text-[11px] text-slate-500">Últimos reportes recibidos en la plataforma</p>
          </div>
          <button
            onClick={() => navigate('/alertas')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            <span>Ver todas las alertas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentIncidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className="group cursor-pointer rounded-xl border border-slate-200 hover:border-emerald-600 p-3 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: INCIDENT_TYPE_COLORS[incident.type] }}
                  >
                    {incident.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      incident.status === 'resuelto'
                        ? 'bg-emerald-100 text-emerald-800'
                        : incident.status === 'atencion'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {STATUS_LABELS[incident.status]}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-800 line-clamp-1 mb-1 transition-colors">
                  {incident.title}
                </h4>

                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-snug">
                  {incident.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {incident.sector}
                </span>
                <span>{incident.date.split(' ')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

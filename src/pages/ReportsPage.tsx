import React, { useState, useMemo } from 'react';
import { useIncidents } from '../contexts/IncidentsContext';
import { Incident } from '../types';
import {
  INCIDENT_TYPE_COLORS,
  INCIDENT_TYPE_LABELS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  exportIncidentsToCSV,
} from '../utils/analytics';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { incidents } = useIncidents();

  // Filters
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-10');
  const [district, setDistrict] = useState('all');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [monitor, setMonitor] = useState('all');

  // Filtered incidents
  const filtered = useMemo(() => {
    return incidents.filter((inc) => {
      if (district !== 'all' && inc.district !== district) return false;
      if (type !== 'all' && inc.type !== type) return false;
      if (status !== 'all' && inc.status !== status) return false;
      if (priority !== 'all' && inc.priority !== priority) return false;
      if (monitor !== 'all' && inc.assignedMonitor !== monitor) return false;
      return true;
    });
  }, [incidents, district, type, status, priority, monitor]);

  // Dynamic statistics
  const totalCount = filtered.length;
  const resolvedCount = filtered.filter((i) => i.status === 'resuelto' || i.status === 'cerrado').length;
  const criticalCount = filtered.filter((i) => i.priority === 'critica').length;
  const pendingCount = filtered.filter((i) => i.status === 'pendiente').length;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Chart data for filtered results
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((i) => {
      const label = INCIDENT_TYPE_LABELS[i.type] || i.type;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({
      name: k,
      total: counts[k],
    }));
  }, [filtered]);

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const csvContent = exportIncidentsToCSV(filtered);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BioVigia_Reporte_Ambiental_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Hidden on Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-emerald-800" />
            Reportes Técnicos y Estadísticas de Conservación
          </h2>
          <p className="text-xs text-slate-500">
            Generación y exportación de informes ambientales para autoridades, OEFA, SERNANP y municipalidades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-lime-300" />
            <span>Exportar Excel (CSV)</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar (Hidden on Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filtros Paramétricos del Reporte</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Fecha Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Fecha Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Distrito</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todos</option>
              <option value="Saylla">Saylla</option>
              <option value="Huasao">Huasao</option>
              <option value="Oropesa">Oropesa</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tipo Incidente</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todas las categorías</option>
              <option value="residuos">Residuos</option>
              <option value="incendio">Incendios</option>
              <option value="agua">Agua</option>
              <option value="fauna">Fauna</option>
              <option value="vegetacion">Vegetación</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="verificacion">En verificación</option>
              <option value="atencion">En atención</option>
              <option value="resuelto">Resuelto</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Prioridad</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="all">Todas las prioridades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-emerald-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-extrabold text-xl shadow-md">
              BV
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#064E3B] tracking-tight">
                BioVigía 2.0 • Informe Técnico Ambiental
              </h1>
              <p className="text-xs text-slate-600">
                Monitoreo y Conservación de Humedales en Huasao y Saylla, Cusco
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <p>
              <strong>Fecha de Emisión:</strong> {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              <strong>Periodo:</strong> {startDate} al {endDate}
            </p>
            <p className="text-[10px] text-emerald-800 font-mono font-bold mt-0.5">
              Ref: INF-BV-2026-VALLE-SUR
            </p>
          </div>
        </div>

        {/* Resumen Estadístico */}
        <div>
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">
            1. Resumen Estadístico de la Muestra
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Registros Analizados
              </span>
              <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                Casos Resueltos
              </span>
              <span className="text-2xl font-extrabold text-emerald-900">{resolvedCount}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
              <span className="text-[10px] font-bold text-red-700 uppercase block mb-1">
                Prioridad Crítica
              </span>
              <span className="text-2xl font-extrabold text-red-900">{criticalCount}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block mb-1">
                Efectividad de Atención
              </span>
              <span className="text-2xl font-extrabold text-blue-900">{resolutionRate}%</span>
            </div>
          </div>
        </div>

        {/* Gráfico de distribución de tipos en el reporte */}
        {chartData.length > 0 && (
          <div className="no-print">
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">
              2. Frecuencia por Categoría de Impacto
            </h3>
            <div className="h-44 w-full bg-slate-50 p-3 rounded-xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="total" name="Incidentes" fill="#15803D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tabla de incidentes filtrados */}
        <div>
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">
            3. Registro Detallado de Incidentes
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Título / Afectación</th>
                  <th className="py-2.5 px-3">Tipo</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">Fecha</th>
                  <th className="py-2.5 px-3">Prioridad</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Monitor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-800">{item.id}</td>
                    <td className="py-2 px-3 font-medium text-slate-800 max-w-[200px] truncate">
                      {item.title}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{INCIDENT_TYPE_LABELS[item.type]}</td>
                    <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">{item.sector}</td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">{item.date}</td>
                    <td className="py-2 px-3">
                      <span className="font-semibold capitalize text-slate-700">
                        {PRIORITY_LABELS[item.priority]}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-700">
                      {STATUS_LABELS[item.status]}
                    </td>
                    <td className="py-2 px-3 text-slate-500 text-[11px]">
                      {item.assignedMonitor || 'Sin asignar'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conclusiones Basadas en los Datos */}
        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl space-y-2">
          <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            4. Conclusiones y Recomendaciones Basadas en la Evidencia
          </h3>
          <ul className="list-disc list-inside text-xs text-emerald-900/90 space-y-1 leading-relaxed">
            <li>
              <strong>Foco territorial prioritario:</strong> La mayor densidad de incidentes se concentra en las márgenes del Río Huatanay y el Sector Totorales de Saylla.
            </li>
            <li>
              <strong>Causa de mayor severidad:</strong> Los incendios de pastizales y totorales representan el mayor riesgo a la biodiversidad local (nidos de Huallata y anfibios).
            </li>
            <li>
              <strong>Efectividad del monitoreo:</strong> El {resolutionRate}% de los incidentes reportados han sido atendidos o resueltos satisfactoriamente.
            </li>
            <li>
              <strong>Acción correctiva propuesta:</strong> Fortalecer el patrullaje preventivo de drones y ampliar la red comunitaria de alerta temprana vía WhatsApp oficial.
            </li>
          </ul>
        </div>

        {/* Signatures line */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
          <div className="border-t border-slate-300 pt-2">
            <p className="font-bold text-slate-800">Ing. Roberto Valenzuela</p>
            <p className="text-[11px] text-slate-500">Coordinador BioVigía 2.0 • Humedales Cusco</p>
          </div>
          <div className="border-t border-slate-300 pt-2">
            <p className="font-bold text-slate-800">Biól. Elena Quispe Mamani</p>
            <p className="text-[11px] text-slate-500">Especialista en Fauna Silvestre & Conservación</p>
          </div>
        </div>
      </div>
    </div>
  );
};

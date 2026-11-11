import { Incident, IncidentPriority, IncidentStatus, IncidentType } from '../types';

export interface DashboardStats {
  total: number;
  pendientes: number;
  enVerificacion: number;
  resueltos: number;
  criticos: number;
  porTipo: Record<IncidentType, number>;
  tasaResolucion: number; // porcentaje 0-100
}

export function calculateDashboardStats(incidents: Incident[]): DashboardStats {
  const initialTipos: Record<IncidentType, number> = {
    residuos: 0,
    incendio: 0,
    agua: 0,
    fauna: 0,
    vegetacion: 0,
    otros: 0,
  };

  const stats = incidents.reduce(
    (acc, inc) => {
      acc.total += 1;
      if (inc.status === 'pendiente') acc.pendientes += 1;
      if (inc.status === 'verificacion') acc.enVerificacion += 1;
      if (inc.status === 'resuelto' || inc.status === 'cerrado') acc.resueltos += 1;
      if (inc.priority === 'critica' && inc.status !== 'resuelto' && inc.status !== 'cerrado') {
        acc.criticos += 1;
      }
      acc.porTipo[inc.type] = (acc.porTipo[inc.type] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      pendientes: 0,
      enVerificacion: 0,
      resueltos: 0,
      criticos: 0,
      porTipo: initialTipos,
      tasaResolucion: 0,
    }
  );

  stats.tasaResolucion = stats.total > 0 ? Math.round((stats.resueltos / stats.total) * 100) : 0;
  return stats;
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  residuos: 'Residuos Sólidos',
  incendio: 'Incendio Forestal',
  agua: 'Contaminación de Agua',
  fauna: 'Fauna Afectada',
  vegetacion: 'Tala / Daño Vegetal',
  otros: 'Otros Incidentes',
};

export const INCIDENT_TYPE_COLORS: Record<IncidentType, string> = {
  residuos: '#F97316', // Naranja
  incendio: '#EF4444', // Rojo
  agua: '#0284C7',     // Azul
  fauna: '#8B5CF6',    // Morado
  vegetacion: '#10B981', // Verde esmeralda
  otros: '#EAB308',    // Amarillo
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  pendiente: 'Pendiente',
  verificacion: 'En verificación',
  atencion: 'En atención',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

export const PRIORITY_LABELS: Record<IncidentPriority, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
};

export function getIncidentMarkerColor(incident: Incident): string {
  if (incident.status === 'pendiente') return '#EAB308'; // Amarillo para pendientes de revisión
  return INCIDENT_TYPE_COLORS[incident.type] || '#64748B';
}

export function filterIncidents(
  incidents: Incident[],
  filters: {
    search?: string;
    type?: string;
    status?: string;
    priority?: string;
    district?: string;
  }
): Incident[] {
  return incidents.filter((inc) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchText =
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.sector.toLowerCase().includes(q) ||
        inc.reporterName.toLowerCase().includes(q);
      if (!matchText) return false;
    }
    if (filters.type && filters.type !== 'all' && inc.type !== filters.type) {
      return false;
    }
    if (filters.status && filters.status !== 'all' && inc.status !== filters.status) {
      return false;
    }
    if (filters.priority && filters.priority !== 'all' && inc.priority !== filters.priority) {
      return false;
    }
    if (filters.district && filters.district !== 'all' && inc.district !== filters.district) {
      return false;
    }
    return true;
  });
}

export function exportIncidentsToCSV(incidents: Incident[]): string {
  const headers = [
    'Código',
    'Título',
    'Tipo',
    'Prioridad',
    'Estado',
    'Fecha',
    'Distrito',
    'Sector',
    'Latitud',
    'Longitud',
    'Reportante',
    'Canal',
    'Monitor Asignado',
  ];

  const rows = incidents.map((inc) => [
    `"${inc.id}"`,
    `"${inc.title.replace(/"/g, '""')}"`,
    `"${INCIDENT_TYPE_LABELS[inc.type] || inc.type}"`,
    `"${PRIORITY_LABELS[inc.priority] || inc.priority}"`,
    `"${STATUS_LABELS[inc.status] || inc.status}"`,
    `"${inc.date}"`,
    `"${inc.district}"`,
    `"${inc.sector.replace(/"/g, '""')}"`,
    inc.lat,
    inc.lng,
    `"${inc.reporterName.replace(/"/g, '""')}"`,
    `"${inc.reportChannel}"`,
    `"${inc.assignedMonitor || 'Sin asignar'}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

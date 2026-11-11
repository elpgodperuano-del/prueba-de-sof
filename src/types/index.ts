export type IncidentType = 'residuos' | 'incendio' | 'agua' | 'fauna' | 'vegetacion' | 'otros';

export type IncidentPriority = 'baja' | 'media' | 'alta' | 'critica';

export type IncidentStatus = 'pendiente' | 'verificacion' | 'atencion' | 'resuelto' | 'cerrado';

export type ReportChannel = 'web' | 'movil' | 'whatsapp' | 'patrullaje' | 'camara';

export type UserRole = 'admin' | 'monitor' | 'citizen';

export interface IncidentHistoryEntry {
  id: string;
  date: string;
  action: string;
  author: string;
  notes?: string;
}

export interface Incident {
  id: string; // e.g. BIO-2026-001
  title: string;
  type: IncidentType;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  date: string;
  department: string;
  province: string;
  district: string;
  sector: string;
  lat: number;
  lng: number;
  imageUrl: string;
  reporterName: string;
  reporterPhone?: string;
  reportChannel: ReportChannel;
  assignedMonitor?: string;
  notes?: string;
  history: IncidentHistoryEntry[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  active: boolean;
  assignedZone?: string;
  phone?: string;
  createdAt: string;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  type: 'camera_trap' | 'observation_point' | 'water_sensor' | 'drone_station';
  lat: number;
  lng: number;
  status: 'operativo' | 'alerta' | 'mantenimiento';
  battery?: number;
  lastReading?: string;
  details: string;
  lastPhoto?: string;
}

export interface FaunaRecord {
  id: string;
  species: string;
  scientificName: string;
  category: 'ave' | 'mamifero' | 'anfibio' | 'flora';
  conservationStatus: 'preocupacion_menor' | 'vulnerable' | 'en_peligro';
  location: string;
  date: string;
  photo: string;
  observedCount: number;
  notes: string;
  observerName: string;
}

export interface InspectionRecord {
  id: string;
  title: string;
  inspector: string;
  date: string;
  wetland: string;
  findings: string;
  status: 'favorable' | 'observaciones' | 'critico';
  waterQualityIndex?: number; // e.g. 78/100
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'incident' | 'alert' | 'assignment' | 'system';
  linkIncidentId?: string;
}

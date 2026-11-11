import {
  Incident,
  User,
  MonitoringPoint,
  FaunaRecord,
  InspectionRecord,
  AppNotification,
} from '../types';

const INCIDENTS_STORAGE_KEY = 'biovigia_incidents_v2';
const USERS_STORAGE_KEY = 'biovigia_users_v2';
const NOTIFICATIONS_STORAGE_KEY = 'biovigia_notifications_v2';
const FAUNA_STORAGE_KEY = 'biovigia_fauna_v2';
const MONITORING_STORAGE_KEY = 'biovigia_monitoring_v2';
const INSPECTIONS_STORAGE_KEY = 'biovigia_inspections_v2';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Ing. Roberto Valenzuela',
    email: 'admin@biovigia.gob.pe',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    active: true,
    assignedZone: 'Humedales Huasao - Saylla Completo',
    phone: '+51 984 123 456',
    createdAt: '2026-01-15',
  },
  {
    id: 'USR-002',
    name: 'Biól. Elena Quispe Mamani',
    email: 'monitor@biovigia.gob.pe',
    role: 'monitor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    active: true,
    assignedZone: 'Sector Laguna Huasao y Río Huatanay',
    phone: '+51 984 654 321',
    createdAt: '2026-02-10',
  },
  {
    id: 'USR-003',
    name: 'Mateo Huamán Ccoyo',
    email: 'ciudadano@biovigia.gob.pe',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    active: true,
    assignedZone: 'Comunidad de Saylla',
    phone: '+51 984 789 012',
    createdAt: '2026-03-01',
  },
  {
    id: 'USR-004',
    name: 'Biól. David Cárdenas',
    email: 'david.cardenas@biovigia.gob.pe',
    role: 'monitor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    active: true,
    assignedZone: 'Sector Totorales y Bosque Ribereño',
    phone: '+51 984 333 444',
    createdAt: '2026-03-20',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'BIO-2026-001',
    title: 'Acumulación de residuos plásticos en orilla oeste',
    type: 'residuos',
    description: 'Se detectaron desechos de envases y botellas de plástico arrastrados por la corriente cerca de la zona de anidación de garzas en el humedal de Huasao.',
    priority: 'media',
    status: 'pendiente',
    date: '2026-11-10 09:30',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Humedal de Huasao - Ribera Oeste',
    lat: -13.5702,
    lng: -71.8260,
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Mateo Huamán (Comité Vecinal Saylla)',
    reporterPhone: '+51 984 789 012',
    reportChannel: 'whatsapp',
    assignedMonitor: 'Biól. Elena Quispe Mamani',
    notes: 'Reporte ingresado con fotos adjuntas; pendiente brigada de limpieza municipal.',
    history: [
      {
        id: 'h1',
        date: '2026-11-10 09:30',
        action: 'Reporte ciudadano recibido',
        author: 'Mateo Huamán',
      },
    ],
  },
  {
    id: 'BIO-2026-002',
    title: 'Foco de quema de totorales en borde agrícola',
    type: 'incendio',
    description: 'Humo denso y fuego activo que amenaza el hábitat de aves migratorias en el límite entre campos de cultivo y la laguna ecológica.',
    priority: 'critica',
    status: 'atencion',
    date: '2026-11-10 08:15',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Sector Totorales Sur - Huasao',
    lat: -13.5735,
    lng: -71.8240,
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Patrulla Dron Guardaparques',
    reporterPhone: '+51 984 123 456',
    reportChannel: 'patrullaje',
    assignedMonitor: 'Biól. Elena Quispe Mamani',
    notes: 'Compañía de Bomberos y Serenazgo de Saylla en camino. Perímetro de 150m evacuado.',
    history: [
      {
        id: 'h2-1',
        date: '2026-11-10 08:15',
        action: 'Alerta generada por dron de vigilancia',
        author: 'Sistema BioVigía',
      },
      {
        id: 'h2-2',
        date: '2026-11-10 08:30',
        action: 'Estado cambiado a En Atención y movilización de brigada',
        author: 'Ing. Roberto Valenzuela',
      },
    ],
  },
  {
    id: 'BIO-2026-003',
    title: 'Descarga de aguas turbias con olor fétido en canal Saylla',
    type: 'agua',
    description: 'Afluente secundario hacia el Río Huatanay presenta coloración negruzca y alta espuma, afectando el pH del espejo de agua principal.',
    priority: 'alta',
    status: 'verificacion',
    date: '2026-11-09 16:40',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Canal Conector Saylla - Río Huatanay',
    lat: -13.5645,
    lng: -71.8185,
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Carlos Choque (Vigilante Ambiental)',
    reporterPhone: '+51 984 555 777',
    reportChannel: 'movil',
    assignedMonitor: 'Biól. David Cárdenas',
    notes: 'Muestra tomada para laboratorio ambiental. Se coordina con OEFA y ANA.',
    history: [
      {
        id: 'h3-1',
        date: '2026-11-09 16:40',
        action: 'Reporte ingresado desde app móvil',
        author: 'Carlos Choque',
      },
      {
        id: 'h3-2',
        date: '2026-11-09 17:10',
        action: 'Asignado a Biól. David Cárdenas para muestreo físico-químico',
        author: 'Ing. Roberto Valenzuela',
      },
    ],
  },
  {
    id: 'BIO-2026-004',
    title: 'Ejemplar de Huallata herida cerca a sendero turístico',
    type: 'fauna',
    description: 'Ave andina (Chloephaga melanoptera) encontrada con ala atrapada en alambre de púa en sendero perimetral de Huasao.',
    priority: 'alta',
    status: 'resuelto',
    date: '2026-11-08 11:20',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Huasao',
    sector: 'Sendero Interpretativo Las Garzas',
    lat: -13.5689,
    lng: -71.8275,
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Rosa Valdivia (Guía Turística)',
    reporterPhone: '+51 984 888 999',
    reportChannel: 'web',
    assignedMonitor: 'Biól. Elena Quispe Mamani',
    notes: 'Atendida con éxito por veterinario de SERFOR Cusco. Trasladada a centro de rescate.',
    history: [
      {
        id: 'h4-1',
        date: '2026-11-08 11:20',
        action: 'Alerta recibida',
        author: 'Rosa Valdivia',
      },
      {
        id: 'h4-2',
        date: '2026-11-08 13:00',
        action: 'Rescate completado y estado cambiado a Resuelto',
        author: 'Biól. Elena Quispe Mamani',
      },
    ],
  },
  {
    id: 'BIO-2026-005',
    title: 'Tala no autorizada de queñuales y eucaliptos jóvenes',
    type: 'vegetacion',
    description: 'Corte clandestino de árboles en la franja de amortiguamiento del humedal para cercado ilegal.',
    priority: 'media',
    status: 'verificacion',
    date: '2026-11-07 14:50',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Huasao',
    sector: 'Bosque de Protección Este',
    lat: -13.5720,
    lng: -71.8295,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Guardaparque Pedro Ttito',
    reporterPhone: '+51 984 666 111',
    reportChannel: 'patrullaje',
    assignedMonitor: 'Ing. Roberto Valenzuela',
    notes: 'Acta de intervención levantada con Policía Ecológica PNP.',
    history: [
      {
        id: 'h5-1',
        date: '2026-11-07 14:50',
        action: 'Incidente registrado en patrullaje presencial',
        author: 'Pedro Ttito',
      },
    ],
  },
  {
    id: 'BIO-2026-006',
    title: 'Cámara trampa CT-03 registra presencia de perros asilvestrados',
    type: 'fauna',
    description: 'Manada de 3 perros sin dueño persiguiendo anátidas y destruyendo nidos de gallinetas en la orilla sur.',
    priority: 'alta',
    status: 'pendiente',
    date: '2026-11-06 06:10',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Sector Pantano de Tipón - Huasao',
    lat: -13.5750,
    lng: -71.8215,
    imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
    reporterName: 'Cámara Trampa CT-03 (Automático)',
    reporterPhone: '',
    reportChannel: 'camara',
    assignedMonitor: 'Biól. David Cárdenas',
    notes: 'Se programa plan de captura humanitaria con el centro de zoonosis.',
    history: [
      {
        id: 'h6-1',
        date: '2026-11-06 06:10',
        action: 'Captura fotográfica automática procesada por BioVigía',
        author: 'Sensor CT-03',
      },
    ],
  },
];

export const INITIAL_MONITORING_POINTS: MonitoringPoint[] = [
  {
    id: 'CT-01',
    name: 'Cámara Trampa Huasao Norte',
    type: 'camera_trap',
    lat: -13.5680,
    lng: -71.8245,
    status: 'operativo',
    battery: 92,
    lastReading: '2026-11-10 06:45',
    details: 'Sensor infrarrojo con visión nocturna 4K. Orientado a bebedero de aves andinas.',
    lastPhoto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'CT-02',
    name: 'Cámara Trampa Totorales',
    type: 'camera_trap',
    lat: -13.5725,
    lng: -71.8235,
    status: 'operativo',
    battery: 84,
    lastReading: '2026-11-09 23:12',
    details: 'Monitoreo de anfibios y zorro andino en sector de densa totora.',
    lastPhoto: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'SQ-01',
    name: 'Sonda Calidad de Agua Laguna Huasao',
    type: 'water_sensor',
    lat: -13.5695,
    lng: -71.8265,
    status: 'operativo',
    battery: 97,
    lastReading: '2026-11-10 10:00 (pH 7.4, OD 6.8 mg/L, Turbidez 12 NTU)',
    details: 'Sonda multiparamétrica telemétrica IoT en boya flotante central.',
  },
  {
    id: 'SQ-02',
    name: 'Sensor Afluente Saylla - Huatanay',
    type: 'water_sensor',
    lat: -13.5640,
    lng: -71.8190,
    status: 'alerta',
    battery: 76,
    lastReading: '2026-11-10 09:45 (pH 6.1, OD 3.2 mg/L, Turbidez 48 NTU)',
    details: 'Registra picos anormales de conductividad y baja oxigenación.',
  },
  {
    id: 'PO-01',
    name: 'Mirador de Aves Saylla',
    type: 'observation_point',
    lat: -13.5665,
    lng: -71.8220,
    status: 'operativo',
    details: 'Punto elevado de avistamiento con telescopio terrestre y libreta de campo digital.',
  },
  {
    id: 'DR-01',
    name: 'Estación de Drones Saylla SkyGuard',
    type: 'drone_station',
    lat: -13.5655,
    lng: -71.8205,
    status: 'operativo',
    battery: 100,
    lastReading: 'Patrullaje matutino completado a las 08:30 (Área cubierta: 45 ha)',
    details: 'Dron térmico con cámara RGB y multiespectral para detección de incendios y tala.',
  },
];

export const INITIAL_FAUNA: FaunaRecord[] = [
  {
    id: 'FAU-01',
    species: 'Huallata / Guayata',
    scientificName: 'Chloephaga melanoptera',
    category: 'ave',
    conservationStatus: 'preocupacion_menor',
    location: 'Laguna de Huasao - Sector Oeste',
    date: '2026-11-09',
    photo: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=500&q=80',
    observedCount: 6,
    notes: 'Pareja adulta con cuatro crías alimentándose de vegetación acuática.',
    observerName: 'Biól. Elena Quispe',
  },
  {
    id: 'FAU-02',
    species: 'Garza Blanca Grande',
    scientificName: 'Ardea alba',
    category: 'ave',
    conservationStatus: 'preocupacion_menor',
    location: 'Riberas del Río Huatanay, Saylla',
    date: '2026-11-08',
    photo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=500&q=80',
    observedCount: 12,
    notes: 'Colonia en descanso sobre árboles nativos al amanecer.',
    observerName: 'Guardaparque Pedro Ttito',
  },
  {
    id: 'FAU-03',
    species: 'Zorro Andino (Atoq)',
    scientificName: 'Lycalopex culpaeus',
    category: 'mamifero',
    conservationStatus: 'preocupacion_menor',
    location: 'Ladera rocosa sobre Huasao',
    date: '2026-11-07',
    photo: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=500&q=80',
    observedCount: 1,
    notes: 'Captado por cámara trampa CT-02 en horario crepuscular.',
    observerName: 'Cámara Trampa CT-02',
  },
  {
    id: 'FAU-04',
    species: 'Rana Acuática Andina',
    scientificName: 'Telmatobius sp.',
    category: 'anfibio',
    conservationStatus: 'vulnerable',
    location: 'Ojos de agua manantial Huasao',
    date: '2026-11-05',
    photo: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=500&q=80',
    observedCount: 4,
    notes: 'Indicador biológico clave de pureza de agua en manantiales no contaminados.',
    observerName: 'Biól. David Cárdenas',
  },
];

export const INITIAL_INSPECTIONS: InspectionRecord[] = [
  {
    id: 'INS-01',
    title: 'Monitoreo Trimestral de Calidad de Aguas y Sedimentos',
    inspector: 'Biól. Elena Quispe & Equipo SERNANP',
    date: '2026-11-04',
    wetland: 'Humedal de Huasao y Río Huatanay',
    findings: 'Índice de calidad general en 74/100. Zona norte con excelente oxigenación; zona este requiere retiro de escombros agrícolas.',
    status: 'favorable',
    waterQualityIndex: 74,
  },
  {
    id: 'INS-02',
    title: 'Verificación de Impacto por Quema en Límites de Saylla',
    inspector: 'Ing. Roberto Valenzuela',
    date: '2026-11-01',
    wetland: 'Totorales Saylla',
    findings: 'Se identificaron 0.8 hectáreas con rebrote en proceso. Se notificó a comuneros sobre la prohibición estricta de quema de rastrojos.',
    status: 'observaciones',
    waterQualityIndex: 65,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Incidente Crítico Reportado',
    message: 'Foco de quema de totorales en borde de Saylla requiere atención inmediata.',
    date: 'Hace 2 horas',
    read: false,
    type: 'alert',
    linkIncidentId: 'BIO-2026-002',
  },
  {
    id: 'notif-2',
    title: 'Nueva Alerta Ciudadana',
    message: 'Mateo Huamán reportó acumulación de plásticos en la ribera oeste.',
    date: 'Hace 3 horas',
    read: false,
    type: 'incident',
    linkIncidentId: 'BIO-2026-001',
  },
  {
    id: 'notif-3',
    title: 'Monitor Asignado con Éxito',
    message: 'Biól. David Cárdenas fue asignado a la verificación de aguas en el canal Saylla.',
    date: 'Ayer',
    read: true,
    type: 'assignment',
    linkIncidentId: 'BIO-2026-003',
  },
  {
    id: 'notif-4',
    title: 'Fauna Rescatada',
    message: 'El ejemplar de Huallata herida fue estabilizado y trasladado a SERFOR.',
    date: 'Hace 2 días',
    read: true,
    type: 'system',
    linkIncidentId: 'BIO-2026-004',
  },
];

// Helper to safely access LocalStorage with fallback
export class DataService {
  static getIncidents(): Incident[] {
    try {
      const stored = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    this.saveIncidents(INITIAL_INCIDENTS);
    return INITIAL_INCIDENTS;
  }

  static saveIncidents(incidents: Incident[]): void {
    try {
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(incidents));
    } catch (e) {
      console.error('Error saving incidents to storage', e);
    }
  }

  static addIncident(incidentData: Omit<Incident, 'id' | 'history'>): Incident {
    const list = this.getIncidents();
    const count = list.length + 1;
    const newId = `BIO-2026-${String(count).padStart(3, '0')}`;
    const newIncident: Incident = {
      ...incidentData,
      id: newId,
      history: [
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          action: 'Incidente registrado en el sistema',
          author: incidentData.reporterName || 'Usuario BioVigía',
        },
      ],
    };
    const updated = [newIncident, ...list];
    this.saveIncidents(updated);

    // Also trigger notification
    this.addNotification({
      title: incidentData.priority === 'critica' ? 'Incidente Crítico Registrado' : 'Nuevo Incidente Registrado',
      message: `${newIncident.id}: ${newIncident.title} en ${newIncident.sector}`,
      read: false,
      type: incidentData.priority === 'critica' ? 'alert' : 'incident',
      linkIncidentId: newId,
    });

    return newIncident;
  }

  static updateIncident(id: string, updates: Partial<Incident>, author = 'Administrador'): Incident | null {
    const list = this.getIncidents();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = list[index];
    const newHistory = [...current.history];

    if (updates.status && updates.status !== current.status) {
      newHistory.unshift({
        id: `h-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: `Estado actualizado a "${updates.status.toUpperCase()}"`,
        author,
      });
    }

    if (updates.assignedMonitor && updates.assignedMonitor !== current.assignedMonitor) {
      newHistory.unshift({
        id: `h-mon-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        action: `Monitor asignado: ${updates.assignedMonitor}`,
        author,
      });
    }

    const updatedIncident: Incident = {
      ...current,
      ...updates,
      history: newHistory,
    };

    list[index] = updatedIncident;
    this.saveIncidents(list);
    return updatedIncident;
  }

  static getUsers(): User[] {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveUsers(INITIAL_USERS);
    return INITIAL_USERS;
  }

  static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }

  static addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...users, newUser];
    this.saveUsers(updated);
    return newUser;
  }

  static toggleUserStatus(id: string): User | null {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx].active = !users[idx].active;
    this.saveUsers(users);
    return users[idx];
  }

  static getMonitoringPoints(): MonitoringPoint[] {
    try {
      const stored = localStorage.getItem(MONITORING_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_MONITORING_POINTS;
  }

  static getFauna(): FaunaRecord[] {
    try {
      const stored = localStorage.getItem(FAUNA_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_FAUNA;
  }

  static addFauna(record: Omit<FaunaRecord, 'id'>): FaunaRecord {
    const list = this.getFauna();
    const newRecord: FaunaRecord = {
      ...record,
      id: `FAU-${String(list.length + 1).padStart(2, '0')}`,
    };
    const updated = [newRecord, ...list];
    try {
      localStorage.setItem(FAUNA_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newRecord;
  }

  static getInspections(): InspectionRecord[] {
    try {
      const stored = localStorage.getItem(INSPECTIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_INSPECTIONS;
  }

  static addInspection(record: Omit<InspectionRecord, 'id'>): InspectionRecord {
    const list = this.getInspections();
    const newRecord: InspectionRecord = {
      ...record,
      id: `INS-${String(list.length + 1).padStart(2, '0')}`,
    };
    const updated = [newRecord, ...list];
    try {
      localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newRecord;
  }

  static getNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  }

  static addNotification(notif: Omit<AppNotification, 'id' | 'date'>): AppNotification {
    const list = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      date: 'Ahora',
    };
    const updated = [newNotif, ...list];
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newNotif;
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications().map((n) => ({ ...n, read: true }));
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  }
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDashboardStats, filterIncidents, getIncidentMarkerColor, exportIncidentsToCSV } from './analytics';
import { Incident } from '../types';

const sampleIncidents: Incident[] = [
  {
    id: 'BIO-2026-001',
    title: 'Acumulación de plástico',
    type: 'residuos',
    description: 'Bolsas plásticas en la orilla del humedal',
    priority: 'media',
    status: 'pendiente',
    date: '2026-11-09 10:30',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Sector Orilla Norte',
    lat: -13.5678,
    lng: -71.8210,
    imageUrl: '',
    reporterName: 'Carlos Quispe',
    reportChannel: 'web',
    history: [],
  },
  {
    id: 'BIO-2026-002',
    title: 'Quema de totorales',
    type: 'incendio',
    description: 'Foco de fuego activo cerca a nidos de aves',
    priority: 'critica',
    status: 'verificacion',
    date: '2026-11-09 14:00',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Huasao',
    sector: 'Humedal Huasao Sur',
    lat: -13.5710,
    lng: -71.8250,
    imageUrl: '',
    reporterName: 'Lucía Mendoza',
    reportChannel: 'whatsapp',
    history: [],
  },
  {
    id: 'BIO-2026-003',
    title: 'Derrame de aguas servidas',
    type: 'agua',
    description: 'Descarga anómala en canal de drenaje',
    priority: 'alta',
    status: 'resuelto',
    date: '2026-11-08 09:15',
    department: 'Cusco',
    province: 'Cusco',
    district: 'Saylla',
    sector: 'Río Huatanay',
    lat: -13.5650,
    lng: -71.8190,
    imageUrl: '',
    reporterName: 'Guardaparque Pedro',
    reportChannel: 'patrullaje',
    history: [],
  },
];

test('calculateDashboardStats calculates correct counts', () => {
  const stats = calculateDashboardStats(sampleIncidents);
  assert.equal(stats.total, 3);
  assert.equal(stats.pendientes, 1);
  assert.equal(stats.enVerificacion, 1);
  assert.equal(stats.resueltos, 1);
  assert.equal(stats.criticos, 1);
  assert.equal(stats.porTipo.residuos, 1);
  assert.equal(stats.porTipo.incendio, 1);
  assert.equal(stats.porTipo.agua, 1);
  assert.equal(stats.tasaResolucion, 33);
});

test('getIncidentMarkerColor returns yellow for pendiente', () => {
  const color = getIncidentMarkerColor(sampleIncidents[0]);
  assert.equal(color, '#EAB308');
});

test('filterIncidents filters by status and text search', () => {
  const filtered = filterIncidents(sampleIncidents, { status: 'pendiente' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'BIO-2026-001');

  const searchFiltered = filterIncidents(sampleIncidents, { search: 'huasao' });
  assert.equal(searchFiltered.length, 1);
  assert.equal(searchFiltered[0].id, 'BIO-2026-002');
});

test('exportIncidentsToCSV produces valid CSV header and rows', () => {
  const csv = exportIncidentsToCSV(sampleIncidents);
  assert.ok(csv.includes('Código,Título,Tipo'));
  assert.ok(csv.includes('BIO-2026-001'));
  assert.ok(csv.includes('Saylla'));
});

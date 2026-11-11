import React, { useState } from 'react';
import { useIncidents } from '../contexts/IncidentsContext';
import { useAuth } from '../contexts/AuthContext';
import { FaunaRecord, InspectionRecord, MonitoringPoint } from '../types';
import {
  Eye,
  Camera,
  Activity,
  Droplets,
  Bird,
  ShieldCheck,
  PlusCircle,
  BatteryCharging,
  Wifi,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';

export const EnvironmentalMonitoringPage: React.FC = () => {
  const {
    monitoringPoints,
    faunaRecords,
    addFaunaRecord,
    inspections,
    addInspectionRecord,
  } = useIncidents();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'fauna' | 'sensores' | 'inspecciones'>('fauna');
  const [faunaModalOpen, setFaunaModalOpen] = useState(false);
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);

  // New Fauna Form state
  const [species, setSpecies] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [category, setCategory] = useState<'ave' | 'mamifero' | 'anfibio' | 'flora'>('ave');
  const [location, setLocation] = useState('Humedal de Huasao - Laguna Principal');
  const [observedCount, setObservedCount] = useState(1);
  const [faunaPhoto, setFaunaPhoto] = useState(
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80'
  );
  const [faunaNotes, setFaunaNotes] = useState('');

  // New Inspection Form state
  const [inspTitle, setInspTitle] = useState('');
  const [inspWetland, setInspWetland] = useState('Humedal de Huasao');
  const [inspFindings, setInspFindings] = useState('');
  const [inspStatus, setInspStatus] = useState<'favorable' | 'observaciones' | 'critico'>('favorable');
  const [inspQuality, setInspQuality] = useState(75);

  const handleCreateFauna = (e: React.FormEvent) => {
    e.preventDefault();
    if (!species.trim()) return;

    addFaunaRecord({
      species: species.trim(),
      scientificName: scientificName.trim() || 'No especificado',
      category,
      conservationStatus: 'preocupacion_menor',
      location: location.trim(),
      date: new Date().toISOString().split('T')[0],
      photo: faunaPhoto,
      observedCount: Number(observedCount) || 1,
      notes: faunaNotes.trim(),
      observerName: currentUser?.name || 'Monitor BioVigía',
    });

    setSpecies('');
    setScientificName('');
    setFaunaNotes('');
    setFaunaModalOpen(false);
  };

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspTitle.trim()) return;

    addInspectionRecord({
      title: inspTitle.trim(),
      inspector: currentUser?.name || 'Ing. Inspector Ambiental',
      date: new Date().toISOString().split('T')[0],
      wetland: inspWetland,
      findings: inspFindings.trim(),
      status: inspStatus,
      waterQualityIndex: Number(inspQuality),
    });

    setInspTitle('');
    setInspFindings('');
    setInspectionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Eye className="w-6 h-6 text-emerald-800" />
            Monitoreo Ambiental y Conservación de Biodiversidad
          </h2>
          <p className="text-xs text-slate-500">
            Red telemétrica IoT, cámaras trampa y censo biológico en Huasao y Saylla, Cusco
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFaunaModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Bird className="w-4 h-4 text-lime-300" />
            <span>+ Registrar Fauna</span>
          </button>
          <button
            onClick={() => setInspectionModalOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span>+ Registrar Inspección</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('fauna')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'fauna'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bird className="w-4 h-4" />
          <span>Avistamientos de Fauna ({faunaRecords.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sensores')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'sensores'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Cámaras Trampa y Sensores IoT ({monitoringPoints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspecciones')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'inspecciones'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Inspecciones Técnicas ({inspections.length})</span>
        </button>
      </div>

      {/* TAB 1: FAUNA RECORDS */}
      {activeTab === 'fauna' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {faunaRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={record.photo}
                    alt={record.species}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src =
                        'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {record.id}
                  </span>
                  <span className="absolute top-2.5 right-2.5 bg-emerald-800 text-lime-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {record.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {record.species}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700">
                      {record.observedCount} indiv.
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 italic font-serif">
                    {record.scientificName}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {record.notes}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[130px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {record.location}
                </span>
                <span>{record.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CAMERAS & WATER SENSORS */}
      {activeTab === 'sensores' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {monitoringPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      {point.type === 'camera_trap' ? (
                        <Camera className="w-5 h-5" />
                      ) : point.type === 'water_sensor' ? (
                        <Droplets className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {point.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {point.name}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      point.status === 'operativo'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {point.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{point.details}</p>

                {point.lastPhoto && (
                  <div className="rounded-xl overflow-hidden h-32 mb-3 border border-slate-200">
                    <img
                      src={point.lastPhoto}
                      alt={point.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {point.lastReading && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                      Última telemetría:
                    </span>
                    <span className="font-semibold text-slate-800">{point.lastReading}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Enlace satelital 4G</span>
                </span>
                {point.battery && (
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    <span>{point.battery}%</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: TECHNICAL INSPECTIONS */}
      {activeTab === 'inspecciones' && (
        <div className="space-y-4">
          {inspections.map((insp) => (
            <div
              key={insp.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-emerald-900 text-white px-2 py-0.5 rounded">
                    {insp.id}
                  </span>
                  <span className="text-xs text-slate-500">{insp.wetland}</span>
                  <span className="text-xs text-slate-400">• {insp.date}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{insp.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{insp.findings}</p>
                <p className="text-[11px] text-emerald-800 font-medium">Inspector: {insp.inspector}</p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                {insp.waterQualityIndex && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">Índice Calidad Agua</span>
                    <span className="text-2xl font-black text-emerald-700">
                      {insp.waterQualityIndex}/100
                    </span>
                  </div>
                )}
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    insp.status === 'favorable'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Dictamen: {insp.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL REGISTRAR FAUNA */}
      {faunaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bird className="w-5 h-5 text-emerald-700" />
                Registrar Avistamiento de Fauna
              </h3>
              <button
                onClick={() => setFaunaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFauna} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Especie / Nombre Común *</label>
                <input
                  type="text"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="Ej. Huallata, Zorro Andino, Gallineta..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Científico</label>
                <input
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  placeholder="Ej. Chloephaga melanoptera"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ave">Ave</option>
                    <option value="mamifero">Mamífero</option>
                    <option value="anfibio">Anfibio</option>
                    <option value="flora">Flora Silvestre</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cantidad Observada</label>
                  <input
                    type="number"
                    min="1"
                    value={observedCount}
                    onChange={(e) => setObservedCount(parseInt(e.target.value) || 1)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ubicación / Sector</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas u Observaciones</label>
                <textarea
                  rows={2}
                  value={faunaNotes}
                  onChange={(e) => setFaunaNotes(e.target.value)}
                  placeholder="Comportamiento, condición física, crías observadas..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFaunaModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Guardar Observación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REGISTRAR INSPECCIÓN */}
      {inspectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                Registrar Inspección Ambiental
              </h3>
              <button
                onClick={() => setInspectionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título de la Inspección *</label>
                <input
                  type="text"
                  value={inspTitle}
                  onChange={(e) => setInspTitle(e.target.value)}
                  placeholder="Ej. Fiscalización hídrica en afluente Saylla"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Humedal / Sector</label>
                  <select
                    value={inspWetland}
                    onChange={(e) => setInspWetland(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Humedal de Huasao">Humedal de Huasao</option>
                    <option value="Saylla Ribera Huatanay">Saylla Ribera Huatanay</option>
                    <option value="Totorales de Oropesa">Totorales de Oropesa</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dictamen</label>
                  <select
                    value={inspStatus}
                    onChange={(e) => setInspStatus(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="favorable">Favorable</option>
                    <option value="observaciones">Con Observaciones</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Índice de Calidad de Agua Estimado ({inspQuality}/100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={inspQuality}
                  onChange={(e) => setInspQuality(parseInt(e.target.value))}
                  className="w-full accent-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hallazgos Técnicos *</label>
                <textarea
                  rows={3}
                  value={inspFindings}
                  onChange={(e) => setInspFindings(e.target.value)}
                  placeholder="Detalles sobre sedimentos, presencia de contaminantes, medidas tomadas..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Guardar Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useIncidents } from '../../contexts/IncidentsContext';
import { useAuth } from '../../contexts/AuthContext';
import { IncidentPriority, IncidentType, ReportChannel } from '../../types';
import { IncidentMap } from '../Map/IncidentMap';
import {
  X,
  MapPin,
  Upload,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  Image as ImageIcon,
  Flame,
  Trash2,
  Droplet,
  HeartCrack,
  TreeDeciduous,
  FileQuestion,
} from 'lucide-react';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoords?: { lat: number; lng: number } | null;
}

const PRESET_PHOTOS = [
  { label: 'Humedal Huasao', url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Residuos Plásticos', url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Contaminación Agua', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fauna Silvestre', url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80' },
];

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  initialCoords,
}) => {
  const { addIncident, incidents } = useIncidents();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncidentType>('residuos');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IncidentPriority>('media');
  const [dateTime, setDateTime] = useState('');
  
  // Location
  const [department, setDepartment] = useState('Cusco');
  const [province, setProvince] = useState('Cusco');
  const [district, setDistrict] = useState('Saylla');
  const [sector, setSector] = useState('Humedal de Huasao - Sector Central');
  const [lat, setLat] = useState<number>(-13.5702);
  const [lng, setLng] = useState<number>(-71.8260);

  // Evidence
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [imagePreview, setImagePreview] = useState<string | null>(PRESET_PHOTOS[0].url);
  const [notes, setNotes] = useState('');

  // Reporter
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [reportChannel, setReportChannel] = useState<ReportChannel>('web');

  // UI state
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successCode, setSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
      setDateTime(formatted);

      if (initialCoords) {
        setLat(initialCoords.lat);
        setLng(initialCoords.lng);
      }

      if (currentUser) {
        setReporterName(currentUser.name);
        setReporterPhone(currentUser.phone || '');
      }

      setSuccessCode(null);
      setErrorMessage('');
    }
  }, [isOpen, initialCoords, currentUser]);

  if (!isOpen) return null;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('La geolocalización no es compatible con su navegador.');
      return;
    }
    setGeoLoading(true);
    setErrorMessage('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(5)));
        setLng(Number(pos.coords.longitude.toFixed(5)));
        setGeoLoading(false);
      },
      () => {
        // Fallback to Huasao standard coordinates if permission denied
        setLat(-13.5705);
        setLng(-71.8252);
        setGeoLoading(false);
        setErrorMessage('No se pudo acceder a la ubicación exacta. Se asignaron las coordenadas de Huasao.');
      },
      { timeout: 7000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageUrl(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!title.trim()) {
      setErrorMessage('El título del incidente es obligatorio.');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMessage('Por favor ingrese una descripción detallada (mínimo 10 caracteres).');
      return;
    }
    if (!sector.trim()) {
      setErrorMessage('El sector o zona es obligatorio.');
      return;
    }
    if (isNaN(lat) || isNaN(lng)) {
      setErrorMessage('Las coordenadas de latitud y longitud son obligatorias.');
      return;
    }

    try {
      const formattedDate = dateTime.replace('T', ' ');
      const newInc = addIncident({
        title: title.trim(),
        type,
        description: description.trim(),
        priority,
        status: 'pendiente', // initial status as specified
        date: formattedDate,
        department,
        province,
        district,
        sector: sector.trim(),
        lat: Number(lat),
        lng: Number(lng),
        imageUrl: imageUrl || PRESET_PHOTOS[0].url,
        reporterName: reporterName.trim() || 'Ciudadano Vigilante',
        reporterPhone: reporterPhone.trim(),
        reportChannel,
        notes: notes.trim(),
      });

      setSuccessCode(newInc.id);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err: any) {
      setErrorMessage('Ocurrió un error al registrar el incidente: ' + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/60 flex items-center justify-center border border-emerald-500/30">
              <AlertTriangle className="w-5 h-5 text-lime-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Registrar Nuevo Incidente</h3>
              <p className="text-xs text-emerald-200">
                Monitoreo y conservación de humedales en Huasao y Saylla, Cusco
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Overlay Banner */}
        {successCode && (
          <div className="p-8 text-center bg-emerald-50 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-emerald-950">¡Incidente Registrado con Éxito!</h4>
            <p className="text-sm text-emerald-700">
              Código generado: <strong className="font-mono text-base bg-emerald-200/80 px-2 py-0.5 rounded">{successCode}</strong>
            </p>
            <p className="text-xs text-slate-500">
              El incidente ya aparece en el mapa interactivo, tabla de gestión y contadores del dashboard.
            </p>
          </div>
        )}

        {/* Form Body */}
        {!successCode && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                1. Información General del Incidente
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de incidente */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tipo de Incidente *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'residuos', label: 'Residuos', icon: Trash2, color: 'text-orange-600' },
                      { id: 'incendio', label: 'Incendio', icon: Flame, color: 'text-red-600' },
                      { id: 'agua', label: 'Agua', icon: Droplet, color: 'text-sky-600' },
                      { id: 'fauna', label: 'Fauna', icon: HeartCrack, color: 'text-purple-600' },
                      { id: 'vegetacion', label: 'Vegetación', icon: TreeDeciduous, color: 'text-emerald-600' },
                      { id: 'otros', label: 'Otros', icon: FileQuestion, color: 'text-amber-600' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = type === item.id;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setType(item.id as IncidentType)}
                          className={`p-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${item.color}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prioridad y Fecha */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nivel de Prioridad *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'baja', label: 'Baja', color: 'peer-checked:bg-emerald-600' },
                        { id: 'media', label: 'Media', color: 'peer-checked:bg-blue-600' },
                        { id: 'alta', label: 'Alta', color: 'peer-checked:bg-orange-500' },
                        { id: 'critica', label: 'Crítica', color: 'peer-checked:bg-red-600' },
                      ].map((p) => (
                        <label
                          key={p.id}
                          className={`cursor-pointer border border-slate-200 rounded-xl p-2 text-center text-xs font-semibold transition-all ${
                            priority === p.id
                              ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="priority"
                            className="hidden"
                            checked={priority === p.id}
                            onChange={() => setPriority(p.id as IncidentPriority)}
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fecha y Hora del Suceso *
                    </label>
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Título */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título del Incidente *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. Quema de pastizales cerca al sendero de aves en Huasao"
                    className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                {/* Descripción detallada */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Descripción Detallada *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalla el problema ecológico, especies afectadas, extensión estimada, personas o causas observadas..."
                    className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: UBICACIÓN */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. Ubicación Georreferenciada (Cusco)
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={geoLoading}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <LocateFixed className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{geoLoading ? 'Obteniendo...' : 'Usar mi ubicación'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(!showMapPicker)}
                    className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{showMapPicker ? 'Ocultar mapa selector' : 'Seleccionar en mapa'}</span>
                  </button>
                </div>
              </div>

              {/* Map Coordinate Picker View */}
              {showMapPicker && (
                <div className="mb-4">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Haz clic en el punto exacto de los humedales de Huasao o Saylla para capturar las coordenadas:
                  </p>
                  <IncidentMap
                    incidents={incidents}
                    height="280px"
                    selectionMode={true}
                    selectedCoordinates={{ lat, lng }}
                    onMapClickCoordinates={(newLat, newLng) => {
                      setLat(newLat);
                      setLng(newLng);
                    }}
                    showFilters={false}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Departamento</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 font-medium"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Provincia</label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 bg-slate-50 font-medium"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Distrito *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Saylla">Saylla</option>
                    <option value="Huasao">Huasao</option>
                    <option value="Oropesa">Oropesa</option>
                    <option value="Lucre">Lucre</option>
                    <option value="San Jerónimo">San Jerónimo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sector o Zona *</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    placeholder="Ej. Ribera Este Huasao"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitud (GPS) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitud (GPS) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value))}
                    className="w-full text-xs font-mono border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: EVIDENCIA FOTOGRÁFICA */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                3. Evidencia Fotográfica y Observaciones
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                    <label className="cursor-pointer block">
                      <Upload className="w-6 h-6 mx-auto text-emerald-700 mb-1" />
                      <span className="text-xs font-semibold text-slate-700 block">Subir fotografía</span>
                      <span className="text-[10px] text-slate-400 block">PNG, JPG hasta 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-400 mt-2 text-center">O seleccionar foto demostrativa:</p>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {PRESET_PHOTOS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setImageUrl(p.url);
                          setImagePreview(p.url);
                        }}
                        className={`text-[10px] p-1 rounded-lg border text-left truncate transition-colors ${
                          imageUrl === p.url ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Vista previa evidencia"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                        <ImageIcon className="w-6 h-6" />
                        <span>Sin vista previa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observaciones adicionales
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. El fuego se encuentra a 50 metros del mirador principal..."
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* SECCIÓN 4: INFORMACIÓN DEL REPORTE */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                4. Datos del Reportante y Canal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre del Reportante</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="Ej. Mateo Huamán"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="+51 984 000 000"
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Medio de Reporte</label>
                  <select
                    value={reportChannel}
                    onChange={(e) => setReportChannel(e.target.value as ReportChannel)}
                    className="w-full text-xs border border-slate-300 rounded-xl px-2.5 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="web">Plataforma Web</option>
                    <option value="movil">App Móvil BioVigía</option>
                    <option value="whatsapp">Canal Alerta Ciudadana WhatsApp</option>
                    <option value="patrullaje">Patrullaje Guardaparques</option>
                    <option value="camara">Detección Automática (Cámaras)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4 text-lime-300" />
                <span>Guardar y Publicar Incidente</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

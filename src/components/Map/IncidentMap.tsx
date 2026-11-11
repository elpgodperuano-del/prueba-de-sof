import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Incident, MonitoringPoint } from '../../types';
import { INCIDENT_TYPE_COLORS, INCIDENT_TYPE_LABELS, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/analytics';
import { Layers, Locate, MapPin, Eye, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface IncidentMapProps {
  incidents: Incident[];
  monitoringPoints?: MonitoringPoint[];
  selectedIncident?: Incident | null;
  onSelectIncident?: (incident: Incident) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  selectionMode?: boolean;
  selectedCoordinates?: { lat: number; lng: number } | null;
  height?: string;
  showFilters?: boolean;
}

const DEFAULT_CENTER: [number, number] = [-13.5700, -71.8250]; // Huasao - Saylla, Cusco
const DEFAULT_ZOOM = 14;

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  monitoringPoints = [],
  selectedIncident,
  onSelectIncident,
  onMapClickCoordinates,
  selectionMode = false,
  selectedCoordinates,
  height = '600px',
  showFilters = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  const [activeLayer, setActiveLayer] = useState<'osm' | 'satellite'>('osm');
  const [filterType, setFilterType] = useState<string>('all');
  const [showLegend, setShowLegend] = useState(true);
  const [showMonitoring, setShowMonitoring] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Default OSM tile layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    });

    osmLayer.addTo(map);
    (map as any)._osmLayer = osmLayer;

    // Esri Satellite tile layer
    const satLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }
    );
    (map as any)._satLayer = satLayer;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const osm = (map as any)._osmLayer;
    const sat = (map as any)._satLayer;

    if (activeLayer === 'satellite') {
      if (map.hasLayer(osm)) map.removeLayer(osm);
      if (!map.hasLayer(sat)) sat.addTo(map);
    } else {
      if (map.hasLayer(sat)) map.removeLayer(sat);
      if (!map.hasLayer(osm)) osm.addTo(map);
    }
  }, [activeLayer]);

  // Handle map click for coordinate selection
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const clickHandler = (e: L.LeafletMouseEvent) => {
      if (onMapClickCoordinates) {
        onMapClickCoordinates(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
      }
    };

    map.on('click', clickHandler);
    return () => {
      map.off('click', clickHandler);
    };
  }, [onMapClickCoordinates]);

  // Update selected coordinates marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedCoordinates) {
      if (selectionMarkerRef.current) {
        selectionMarkerRef.current.setLatLng([selectedCoordinates.lat, selectedCoordinates.lng]);
      } else {
        const pinHtml = `
          <div style="background-color: #2563EB; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); animation: pulse 1.5s infinite;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `;
        const icon = L.divIcon({
          className: 'custom-selection-pin',
          html: pinHtml,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });
        selectionMarkerRef.current = L.marker([selectedCoordinates.lat, selectedCoordinates.lng], { icon }).addTo(map);
      }
      map.panTo([selectedCoordinates.lat, selectedCoordinates.lng]);
    } else if (selectionMarkerRef.current) {
      map.removeLayer(selectionMarkerRef.current);
      selectionMarkerRef.current = null;
    }
  }, [selectedCoordinates]);

  // Render markers whenever incidents, filters, or monitoring points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Filter incidents
    const filtered = incidents.filter((inc) => {
      if (filterType === 'all') return true;
      if (filterType === 'pendientes') return inc.status === 'pendiente';
      return inc.type === filterType;
    });

    // Add Incident Markers
    filtered.forEach((incident) => {
      let pinColor = INCIDENT_TYPE_COLORS[incident.type] || '#15803D';
      if (incident.status === 'pendiente') {
        pinColor = '#EAB308'; // Amarillo para pendientes de revisión
      }

      const iconHtml = `
        <div class="marker-pin-custom" style="background-color: ${pinColor}; width: 32px; height: 32px; border: 2.5px solid #ffffff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 13px; color: #ffffff; font-weight: bold;">
            ${incident.type === 'incendio' ? '🔥' : incident.type === 'residuos' ? '🗑️' : incident.type === 'agua' ? '💧' : incident.type === 'fauna' ? '🐾' : '🌿'}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'incident-marker-container',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([incident.lat, incident.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 260px; padding: 4px;">
          <div style="position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 8px; height: 110px; background-color: #f1f5f9;">
            <img src="${incident.imageUrl || 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=400&q=80'}" 
                 style="width: 100%; height: 100%; object-fit: cover;" 
                 alt="${incident.title}" 
                 onerror="this.src='https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80'"/>
            <span style="position: absolute; top: 6px; left: 6px; background-color: rgba(6, 78, 59, 0.9); color: white; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;">
              ${incident.id}
            </span>
            <span style="position: absolute; top: 6px; right: 6px; background-color: ${pinColor}; color: white; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px;">
              ${STATUS_LABELS[incident.status]}
            </span>
          </div>

          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">
            ${incident.title}
          </h4>
          
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${incident.description}
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px; font-size: 11px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">📍 Ubicación:</span>
              <strong style="color: #1e293b;">${incident.sector}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #64748b;">📅 Fecha:</span>
              <span style="color: #1e293b;">${incident.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #64748b;">⚡ Prioridad:</span>
              <span style="font-weight: 700; color: ${incident.priority === 'critica' ? '#DC2626' : incident.priority === 'alta' ? '#EA580C' : '#16A34A'};">
                ${PRIORITY_LABELS[incident.priority]}
              </span>
            </div>
          </div>

          <button id="btn-detail-${incident.id}" 
                  style="width: 100%; background: #064E3B; color: white; border: none; padding: 7px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s;">
            Ver detalles completos
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-detail-${incident.id}`);
        if (btn && onSelectIncident) {
          btn.onclick = () => onSelectIncident(incident);
        }
      });

      marker.on('click', () => {
        if (onSelectIncident) {
          onSelectIncident(incident);
        }
      });

      markersGroup.addLayer(marker);
    });

    // Add Monitoring Points (Trap cameras, water sensors)
    if (showMonitoring) {
      monitoringPoints.forEach((point) => {
        const isCamera = point.type === 'camera_trap';
        const isWater = point.type === 'water_sensor';
        const isDrone = point.type === 'drone_station';

        const iconHtml = `
          <div class="marker-pin-custom" style="background-color: #15803D; width: 30px; height: 30px; border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 13px; color: white;">
              ${isCamera ? '📷' : isWater ? '🧪' : isDrone ? '🛸' : '🔭'}
            </span>
          </div>
        `;

        const pointIcon = L.divIcon({
          className: 'monitoring-marker-container',
          html: iconHtml,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        const pointMarker = L.marker([point.lat, point.lng], { icon: pointIcon });

        const pointPopupHtml = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 240px; padding: 2px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="background-color: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">
                ${point.id}
              </span>
              <span style="background-color: #064E3B; color: white; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px;">
                ${point.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h4 style="font-size: 13px; font-weight: 700; color: #064E3B; margin: 0 0 4px 0;">
              ${point.name}
            </h4>
            <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
              ${point.details}
            </p>
            ${
              point.lastReading
                ? `<div style="background: #F0FDF4; border: 1px solid #BBF7D0; padding: 5px; border-radius: 6px; font-size: 10px; color: #166534; margin-bottom: 6px;">
                    <strong>Última lectura:</strong> ${point.lastReading}
                   </div>`
                : ''
            }
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748B;">
              <span>Estado: <strong style="color: #15803D;">${point.status.toUpperCase()}</strong></span>
              ${point.battery ? `<span>Batería: 🔋${point.battery}%</span>` : ''}
            </div>
          </div>
        `;

        pointMarker.bindPopup(pointPopupHtml);
        markersGroup.addLayer(pointMarker);
      });
    }
  }, [incidents, monitoringPoints, filterType, showMonitoring, onSelectIncident]);

  // Center on selected incident
  useEffect(() => {
    if (selectedIncident && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedIncident.lat, selectedIncident.lng], 16, {
        duration: 1.2,
      });
    }
  }, [selectedIncident]);

  const handleCenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100" style={{ height }}>
      {/* Map Target Div */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Header Controls */}
      <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-2 max-w-[calc(100%-80px)]">
        {/* Layer Selector */}
        <div className="bg-white/95 backdrop-blur-md px-1.5 py-1.5 rounded-xl shadow-md border border-slate-200/80 flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveLayer('osm')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeLayer === 'osm'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mapa Base</span>
          </button>
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeLayer === 'satellite'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Satelital</span>
          </button>
        </div>

        {/* Quick Filter Pill Buttons */}
        {showFilters && (
          <div className="hidden md:flex bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200/80 items-center gap-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todos ({incidents.length})
            </button>
            <button
              onClick={() => setFilterType('pendientes')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'pendientes' ? 'bg-amber-500 text-white' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Pendientes
            </button>
            <button
              onClick={() => setFilterType('incendio')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'incendio' ? 'bg-red-600 text-white' : 'text-red-700 hover:bg-red-50'
              }`}
            >
              🔥 Incendios
            </button>
            <button
              onClick={() => setFilterType('residuos')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'residuos' ? 'bg-orange-500 text-white' : 'text-orange-700 hover:bg-orange-50'
              }`}
            >
              🗑️ Residuos
            </button>
            <button
              onClick={() => setFilterType('agua')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                filterType === 'agua' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-50'
              }`}
            >
              💧 Agua
            </button>
            <button
              onClick={() => setShowMonitoring(!showMonitoring)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
                showMonitoring ? 'bg-emerald-700 text-white' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Cámaras/Sensores
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button - Center Map */}
      <div className="absolute bottom-4 left-4 z-[500] flex items-center gap-2">
        <button
          onClick={handleCenterMap}
          className="bg-white hover:bg-slate-50 text-slate-700 p-2.5 rounded-xl shadow-md border border-slate-200 transition-all flex items-center gap-2 text-xs font-semibold hover:shadow-lg active:scale-95"
          title="Centrar en Humedal de Huasao y Saylla"
        >
          <Locate className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Centrar Humedales</span>
        </button>

        {selectionMode && (
          <div className="bg-blue-600 text-white px-3 py-2 rounded-xl shadow-md text-xs font-medium flex items-center gap-2 animate-pulse">
            <MapPin className="w-4 h-4" />
            <span>Haz clic en el mapa para marcar coordenadas</span>
          </div>
        )}
      </div>

      {/* Floating Collapsible Color Legend */}
      <div className="absolute bottom-4 right-4 z-[500]">
        {showLegend ? (
          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200/80 text-xs w-60">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                Leyenda de Marcadores
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 shrink-0 shadow-xs" />
                <span className="text-slate-700">Naranja: Acumulación de residuos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 shrink-0 shadow-xs" />
                <span className="text-slate-700">Rojo: Incendios forestales</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-600 shrink-0 shadow-xs" />
                <span className="text-slate-700">Azul: Contaminación del agua</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500 shrink-0 shadow-xs" />
                <span className="text-slate-700">Morado: Fauna afectada</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-700 shrink-0 shadow-xs" />
                <span className="text-slate-700">Verde: Cámaras trampa / Sensores</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shrink-0 shadow-xs" />
                <span className="text-slate-700">Amarillo: Incidentes pendientes</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="bg-white/95 backdrop-blur-md text-slate-700 px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-700" />
            <span>Ver leyenda</span>
          </button>
        )}
      </div>
    </div>
  );
};

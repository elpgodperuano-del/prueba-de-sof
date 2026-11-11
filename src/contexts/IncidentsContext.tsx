import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Incident,
  MonitoringPoint,
  FaunaRecord,
  InspectionRecord,
  AppNotification,
} from '../types';
import { DataService } from '../services/dataService';
import { calculateDashboardStats, DashboardStats } from '../utils/analytics';
import { useAuth } from './AuthContext';

interface IncidentsContextType {
  incidents: Incident[];
  stats: DashboardStats;
  addIncident: (data: Omit<Incident, 'id' | 'history'>) => Incident;
  updateIncident: (id: string, updates: Partial<Incident>) => Incident | null;
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  isNewIncidentModalOpen: boolean;
  openNewIncidentModal: (coords?: { lat: number; lng: number }) => void;
  closeNewIncidentModal: () => void;
  initialModalCoords: { lat: number; lng: number } | null;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationsRead: () => void;
  monitoringPoints: MonitoringPoint[];
  faunaRecords: FaunaRecord[];
  addFaunaRecord: (data: Omit<FaunaRecord, 'id'>) => FaunaRecord;
  inspections: InspectionRecord[];
  addInspectionRecord: (data: Omit<InspectionRecord, 'id'>) => InspectionRecord;
}

const IncidentsContext = createContext<IncidentsContextType | undefined>(undefined);

export const IncidentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>(() => DataService.getIncidents());
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isNewIncidentModalOpen, setIsNewIncidentModalOpen] = useState(false);
  const [initialModalCoords, setInitialModalCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => DataService.getNotifications());
  const [monitoringPoints] = useState<MonitoringPoint[]>(() => DataService.getMonitoringPoints());
  const [faunaRecords, setFaunaRecords] = useState<FaunaRecord[]>(() => DataService.getFauna());
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => DataService.getInspections());

  const stats = useMemo(() => calculateDashboardStats(incidents), [incidents]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addIncident = (data: Omit<Incident, 'id' | 'history'>) => {
    const created = DataService.addIncident(data);
    setIncidents(DataService.getIncidents());
    setNotifications(DataService.getNotifications());
    return created;
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    const authorName = currentUser?.name || 'Administrador';
    const updated = DataService.updateIncident(id, updates, authorName);
    if (updated) {
      setIncidents(DataService.getIncidents());
      if (selectedIncident && selectedIncident.id === id) {
        setSelectedIncident(updated);
      }
    }
    return updated;
  };

  const openNewIncidentModal = (coords?: { lat: number; lng: number }) => {
    if (coords) {
      setInitialModalCoords(coords);
    } else {
      setInitialModalCoords(null);
    }
    setIsNewIncidentModalOpen(true);
  };

  const closeNewIncidentModal = () => {
    setIsNewIncidentModalOpen(false);
    setInitialModalCoords(null);
  };

  const markNotificationsRead = () => {
    DataService.markAllNotificationsRead();
    setNotifications(DataService.getNotifications());
  };

  const addFaunaRecord = (data: Omit<FaunaRecord, 'id'>) => {
    const created = DataService.addFauna(data);
    setFaunaRecords(DataService.getFauna());
    return created;
  };

  const addInspectionRecord = (data: Omit<InspectionRecord, 'id'>) => {
    const created = DataService.addInspection(data);
    setInspections(DataService.getInspections());
    return created;
  };

  return (
    <IncidentsContext.Provider
      value={{
        incidents,
        stats,
        addIncident,
        updateIncident,
        selectedIncident,
        setSelectedIncident,
        isNewIncidentModalOpen,
        openNewIncidentModal,
        closeNewIncidentModal,
        initialModalCoords,
        notifications,
        unreadNotificationsCount,
        markNotificationsRead,
        monitoringPoints,
        faunaRecords,
        addFaunaRecord,
        inspections,
        addInspectionRecord,
      }}
    >
      {children}
    </IncidentsContext.Provider>
  );
};

export const useIncidents = () => {
  const context = useContext(IncidentsContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentsProvider');
  }
  return context;
};

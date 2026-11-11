import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IncidentsProvider } from './contexts/IncidentsContext';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { IncidentMapPage } from './pages/IncidentMapPage';
import { IncidentManagementPage } from './pages/IncidentManagementPage';
import { CitizenAlertsPage } from './pages/CitizenAlertsPage';
import { EnvironmentalMonitoringPage } from './pages/EnvironmentalMonitoringPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <IncidentsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mapa"
              element={
                <ProtectedRoute>
                  <IncidentMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incidentes"
              element={
                <ProtectedRoute>
                  <IncidentManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alertas"
              element={
                <ProtectedRoute>
                  <CitizenAlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoreo"
              element={
                <ProtectedRoute>
                  <EnvironmentalMonitoringPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reportes"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IncidentsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

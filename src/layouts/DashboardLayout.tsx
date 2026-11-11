import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIncidents } from '../contexts/IncidentsContext';
import { UserRole } from '../types';
import { NewIncidentModal } from '../components/Modals/NewIncidentModal';
import { IncidentDetailModal } from '../components/Modals/IncidentDetailModal';
import {
  LayoutDashboard,
  Map,
  BellRing,
  PlusCircle,
  Eye,
  FileBarChart2,
  Users,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ChevronDown,
  Shield,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle,
  ClipboardList,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser, role, logout, loginAsDemo } = useAuth();
  const {
    unreadNotificationsCount,
    notifications,
    markNotificationsRead,
    isNewIncidentModalOpen,
    openNewIncidentModal,
    closeNewIncidentModal,
    initialModalCoords,
    selectedIncident,
    setSelectedIncident,
  } = useIncidents();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Resumen / Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Mapa de incidentes', path: '/mapa', icon: Map },
    { name: 'Gestión de incidentes', path: '/incidentes', icon: ClipboardList },
    { name: 'Alertas ciudadanas', path: '/alertas', icon: BellRing },
    { name: 'Monitoreo ambiental', path: '/monitoreo', icon: Eye },
    { name: 'Reportes y Estadísticas', path: '/reportes', icon: FileBarChart2 },
    { name: 'Administración Usuarios', path: '/usuarios', icon: Users, adminOnly: true },
    { name: 'Configuración', path: '/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Mobile Bar */}
      <div className="lg:hidden bg-[#064E3B] text-white px-4 py-3 flex items-center justify-between border-b border-emerald-950 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-lime-400 text-[#064E3B] font-extrabold flex items-center justify-center text-sm shadow-xs">
              BV
            </span>
            <span className="font-extrabold text-base tracking-tight text-white">BioVigía 2.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openNewIncidentModal()}
            className="bg-lime-500 hover:bg-lime-400 text-emerald-950 font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reportar</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop and Mobile Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#064E3B] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Logo Brand Header */}
          <div>
            <div className="p-5 border-b border-emerald-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-[#064E3B] font-extrabold text-lg shadow-md">
                  BV
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                    BioVigía <span className="text-lime-400 font-bold text-xs bg-emerald-900 px-1.5 py-0.5 rounded">2.0</span>
                  </h1>
                  <p className="text-[10px] text-emerald-300 font-bold tracking-wider">HUASAO</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-emerald-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Register Incident Button in Sidebar */}
            <div className="px-4 pt-4 pb-2">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  openNewIncidentModal();
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/40 transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4 text-lime-200" />
                <span>+ Registrar Incidente</span>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="p-3 space-y-1">
              <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-emerald-400/80 mb-1 block">
                Menú Principal
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#15803D] text-white shadow-xs font-bold'
                        : 'text-emerald-100/90 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-lime-300' : 'text-emerald-300'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.path === '/alertas' && unreadNotificationsCount > 0 && (
                      <span className="bg-red-500 text-white font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar User Info & Logout */}
          <div className="p-4 border-t border-emerald-900/60 bg-emerald-950/40">
            {/* Demo Role Switcher Bar */}
            <div className="mb-3 bg-emerald-900/80 rounded-xl p-2 border border-emerald-800">
              <div className="flex items-center justify-between text-[10px] text-emerald-300 font-semibold mb-1.5">
                <span>Rol Actual ({role}):</span>
                <button
                  onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                  className="text-lime-300 hover:underline flex items-center gap-0.5"
                >
                  <span>Cambiar</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {roleSwitcherOpen && (
                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-emerald-800">
                  <button
                    onClick={() => {
                      loginAsDemo('admin');
                      setRoleSwitcherOpen(false);
                    }}
                    className={`text-[9px] py-1 rounded text-center font-bold ${
                      role === 'admin' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/60 text-emerald-200'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('monitor');
                      setRoleSwitcherOpen(false);
                    }}
                    className={`text-[9px] py-1 rounded text-center font-bold ${
                      role === 'monitor' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/60 text-emerald-200'
                    }`}
                  >
                    Monitor
                  </button>
                  <button
                    onClick={() => {
                      loginAsDemo('citizen');
                      setRoleSwitcherOpen(false);
                    }}
                    className={`text-[9px] py-1 rounded text-center font-bold ${
                      role === 'citizen' ? 'bg-emerald-600 text-white' : 'bg-emerald-950/60 text-emerald-200'
                    }`}
                  >
                    Ciudadano
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-lime-400 shadow-xs"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate max-w-[110px]">
                    {currentUser?.name || 'Usuario'}
                  </p>
                  <p className="text-[10px] text-emerald-300 capitalize">{role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="p-2 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
            {/* Global Search Input */}
            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar incidentes por código, zona, reportante (ej. Huasao, Saylla)..."
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 border border-transparent focus:border-emerald-600 focus:bg-white rounded-xl outline-none transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/mapa?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                    }
                  }}
                />
              </div>
            </div>

            {/* Right Header Status & Tools */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Last Update Badge */}
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Actualizado: 10 Nov 2026, 22:30</span>
              </div>

              {/* Header Action: Add Incident Button */}
              <button
                onClick={() => openNewIncidentModal()}
                className="hidden sm:flex bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs items-center gap-1.5 shadow-sm transition-all active:scale-98"
              >
                <PlusCircle className="w-4 h-4 text-lime-300" />
                <span>+ Registrar incidente</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Notificaciones"
                >
                  <BellRing className="w-5 h-5 text-emerald-900" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Notificaciones ({notifications.length})
                      </span>
                      <button
                        onClick={markNotificationsRead}
                        className="text-[11px] text-emerald-700 hover:underline font-semibold"
                      >
                        Marcar leídas
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-xl text-xs transition-colors ${
                            !n.read ? 'bg-emerald-50/70 border border-emerald-100' : 'bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-tight">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-700 capitalize font-medium">{role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                    <div className="p-2 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-800">{currentUser?.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold capitalize">
                        Rol: {role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/configuracion');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Configuración del sistema</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 flex items-center gap-2 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Body View */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Global Modals for New Incident & Details */}
      <NewIncidentModal
        isOpen={isNewIncidentModalOpen}
        onClose={closeNewIncidentModal}
        initialCoords={initialModalCoords}
      />

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
};

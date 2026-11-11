import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Plane,
  MapPin,
  AlertCircle,
  Leaf,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Login: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@biovigia.gob.pe');
  const [password, setPassword] = useState('admin1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor complete todos los campos obligatorios.');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales inválidas o cuenta inactiva.');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'monitor' | 'citizen') => {
    loginAsDemo(role);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Columna Izquierda: Formulario de Login */}
      <div className="w-full md:w-1/2 lg:w-5/12 p-6 sm:p-12 lg:p-16 flex flex-col justify-between bg-white shadow-xl z-10">
        <div>
          {/* Logo y Encabezado */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center shadow-lg shadow-emerald-950/20">
              <Leaf className="w-6 h-6 text-lime-400" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-[#064E3B] tracking-tight">
                BioVigía <span className="text-lime-600">2.0</span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Humedales de Huasao y Saylla, Cusco
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Plataforma de monitoreo ambiental y conservación de la biodiversidad.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@biovigia.gob.pe"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#15803D] focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-[#15803D] focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-emerald-800 font-semibold hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#064E3B] text-white font-bold text-sm shadow-lg shadow-emerald-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-lime-300" />
              <span>Iniciar Sesión</span>
            </button>
          </form>

          {/* Acceso Rápido por Roles Demo */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5 text-center">
              Acceso Rápido de Demostración
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-[#064E3B] text-xs font-bold transition-all text-center flex flex-col items-center"
              >
                <span>Administrador</span>
                <span className="text-[10px] text-emerald-700 font-normal">Control total</span>
              </button>
              <button
                onClick={() => handleDemoLogin('monitor')}
                className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-900 text-xs font-bold transition-all text-center flex flex-col items-center"
              >
                <span>Monitor</span>
                <span className="text-[10px] text-sky-700 font-normal">Verificación</span>
              </button>
              <button
                onClick={() => handleDemoLogin('citizen')}
                className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all text-center flex flex-col items-center"
              >
                <span>Ciudadano</span>
                <span className="text-[10px] text-amber-700 font-normal">Alertas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>© 2026 BioVigía 2.0 • Sistema de Gestión Ambiental Cusco</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Humedal de Huasao & Río Huatanay, Saylla</p>
        </div>
      </div>

      {/* Columna Derecha: Imagen de Impacto, Dron y Paisaje Andino */}
      <div className="w-full md:w-1/2 lg:w-7/12 relative min-h-[420px] md:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-8 sm:p-12 text-white">
        {/* Background Image: Wetland with Andes Mountains */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85"
            alt="Humedal de Huasao y Montañas Andinas Cusco"
            className="w-full h-full object-cover opacity-75 scale-105 filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B] via-[#064E3B]/60 to-transparent mix-blend-multiply" />
        </div>

        {/* Top Tag & Drone Badge */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 text-xs font-medium text-white shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-lime-400" />
            <span>Huasao – Saylla, Cusco • 3,150 msnm</span>
          </div>

          <div className="bg-emerald-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-400/30 flex items-center gap-2 text-xs font-semibold text-lime-300 shadow-sm">
            <Plane className="w-3.5 h-3.5 animate-pulse" />
            <span>Dron SkyGuard Activo</span>
          </div>
        </div>

        {/* Bottom Hero Text Card */}
        <div className="relative z-10 max-w-lg mt-auto pt-16">
          <div className="inline-flex items-center gap-2 bg-lime-400 text-[#064E3B] px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            Tecnología & Participación Ciudadana
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
            Vigilancia inteligente para la protección de nuestros humedales.
          </h3>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6 font-normal">
            Monitoreo en tiempo real con cámaras trampa, teledetección de incendios y alertas comunitarias para preservar la fauna y recursos hídricos en el Valle Sur del Cusco.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 text-center">
            <div>
              <p className="text-2xl font-extrabold text-lime-400">100%</p>
              <p className="text-[11px] text-emerald-200">Georreferenciado</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">45 ha</p>
              <p className="text-[11px] text-emerald-200">Área Protegida</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-lime-400">IoT + Drones</p>
              <p className="text-[11px] text-emerald-200">Alerta Temprana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Olvidé mi Contraseña */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Restablecer Contraseña</h4>
            <p className="text-xs text-slate-600 mb-4">
              En el entorno de demostración de BioVigía 2.0, puedes acceder directamente con cualquiera de los botones de rol de prueba en la pantalla principal.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

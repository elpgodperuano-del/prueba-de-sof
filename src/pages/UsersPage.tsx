import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DataService } from '../services/dataService';
import { User, UserRole } from '../types';
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Lock,
  Mail,
  Phone,
  MapPin,
  X,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { canManageUsers, role, currentUser } = useAuth();
  const [userList, setUserList] = useState<User[]>(() => DataService.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('monitor');
  const [zone, setZone] = useState('Sector Humedales de Huasao');
  const [phone, setPhone] = useState('+51 984 ');
  const [feedback, setFeedback] = useState('');

  if (!canManageUsers) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-12 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Acceso Restringido para Administradores</h3>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Tu rol actual es <strong>{role.toUpperCase()}</strong>. Para administrar el personal y asignar credenciales en BioVigía 2.0, utiliza el conmutador de roles en la parte inferior del menú lateral y selecciona <strong>Admin</strong>.
        </p>
      </div>
    );
  }

  const filteredUsers = userList.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.assignedZone && u.assignedZone.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleToggleStatus = (id: string) => {
    const updated = DataService.toggleUserStatus(id);
    if (updated) {
      setUserList(DataService.getUsers());
      setFeedback(`Estado del usuario ${updated.name} actualizado.`);
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser = DataService.addUser({
      name: name.trim(),
      email: email.trim(),
      role: userRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + userList.length}?auto=format&fit=crop&w=300&q=80`,
      active: true,
      assignedZone: zone.trim(),
      phone: phone.trim(),
    });

    setUserList(DataService.getUsers());
    setName('');
    setEmail('');
    setIsModalOpen(false);
    setFeedback(`Usuario ${newUser.name} registrado con éxito.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-800" />
            Administración de Usuarios y Monitores Ambientales
          </h2>
          <p className="text-xs text-slate-500">
            Control de accesos basados en roles (RBAC) y asignación territorial en Saylla y Huasao
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4 text-lime-300" />
          <span>+ Registrar Usuario</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario por nombre, email o zona..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs border border-slate-200 bg-slate-50 rounded-xl px-3 py-2 text-slate-700 font-medium focus:bg-white outline-none"
        >
          <option value="all">Todos los Roles</option>
          <option value="admin">Administradores</option>
          <option value="monitor">Monitores Ambientales</option>
          <option value="citizen">Ciudadanos / Vigilantes</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-3">Rol</th>
                <th className="py-3 px-3">Zona Asignada</th>
                <th className="py-3 px-3">Contacto</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        onError={(e) => {
                          (e.target as any).src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div>
                        <p className="font-bold text-slate-800 leading-tight">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'monitor'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {user.role === 'admin'
                        ? 'Administrador'
                        : user.role === 'monitor'
                        ? 'Monitor Ambiental'
                        : 'Ciudadano'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {user.assignedZone || 'No asignada'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">
                    {user.phone || 'No registrado'}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        user.active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                        user.active
                          ? 'border-red-200 text-red-700 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {user.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Usuario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                Registrar Usuario en BioVigía 2.0
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Ing. Marisol Quispe"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Institucional *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@biovigia.gob.pe"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rol Asignado</label>
                  <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value as UserRole)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="admin">Administrador</option>
                    <option value="monitor">Monitor Ambiental</option>
                    <option value="citizen">Ciudadano</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-2.5 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Zona Territorial Asignada</label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Crear Cuenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

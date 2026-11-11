import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DataService, INITIAL_USERS } from '../services/dataService';

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  canManageUsers: boolean;
  canAssignMonitors: boolean;
  canChangeStatus: boolean;
  canCreateIncidents: boolean;
  canDeleteIncidents: boolean;
}

const AUTH_STORAGE_KEY = 'biovigia_current_user_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default to admin for immediate exploration, but login page is also fully navigable
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (email: string): boolean => {
    const users = DataService.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (!found.active) {
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    // If not found in seed, create simulated session for testing
    const demoUser: User = {
      id: `USR-${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'citizen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      active: true,
      assignedZone: 'Comunidad Saylla',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentUser(demoUser);
    return true;
  };

  const loginAsDemo = (role: UserRole) => {
    const users = DataService.getUsers();
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const role: UserRole = currentUser?.role || 'citizen';

  const canManageUsers = role === 'admin';
  const canAssignMonitors = role === 'admin' || role === 'monitor';
  const canChangeStatus = role === 'admin' || role === 'monitor';
  const canCreateIncidents = true; // All authenticated users can report
  const canDeleteIncidents = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        login,
        loginAsDemo,
        logout,
        canManageUsers,
        canAssignMonitors,
        canChangeStatus,
        canCreateIncidents,
        canDeleteIncidents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

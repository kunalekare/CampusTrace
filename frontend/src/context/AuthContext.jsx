import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('campustrace_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campustrace_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          localStorage.setItem('campustrace_user', JSON.stringify(profile));
        } catch {
          setUser(null);
          setToken(null);
          localStorage.removeItem('campustrace_token');
          localStorage.removeItem('campustrace_user');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('campustrace_token', res.data.token);
    localStorage.setItem('campustrace_user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('campustrace_token', res.data.token);
    localStorage.setItem('campustrace_user', JSON.stringify(res.data.user));
    return res.data.user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}
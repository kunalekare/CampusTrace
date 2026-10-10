import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('campustrace_token');
      localStorage.removeItem('campustrace_user');
    }
  },
  async getProfile() {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
  async updateProfile(updates) {
    const res = await api.patch('/auth/profile', updates);
    return res.data.data;
  }
};
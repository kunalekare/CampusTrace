import api from './api';

export const analyticsService = {
  async getSummary() {
    const res = await api.get('/analytics/summary');
    return res.data.data;
  },
  async getCategories() {
    const res = await api.get('/analytics/categories');
    return res.data.data;
  },
  async getLocations() {
    const res = await api.get('/analytics/locations');
    return res.data.data;
  },
  async getMonthlyTrends() {
    const res = await api.get('/analytics/monthly-trends');
    return res.data.data;
  }
};
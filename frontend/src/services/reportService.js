import api from './api';

export const reportService = {
  async getReports(params = {}) {
    const res = await api.get('/reports', { params });
    return res.data.data;
  },
  async getReportById(id) {
    const res = await api.get(`/reports/${id}`);
    return res.data.data;
  },
  async createReport(data) {
    const res = await api.post('/reports', data);
    return res.data.data;
  },
  async getMyReports() {
    const res = await api.get('/reports/my-reports');
    return res.data.data;
  },
  async updateStatus(id, status) {
    const res = await api.patch(`/reports/${id}/status`, { status });
    return res.data.data;
  },
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/uploads/item-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  }
};
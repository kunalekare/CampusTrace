import api from './api';

export const matchService = {
  async getMyMatches() {
    const res = await api.get('/matches/my-matches');
    return res.data.data;
  },
  async getMatchById(id) {
    const res = await api.get(`/matches/${id}`);
    return res.data.data;
  },
  async dismissMatch(id) {
    const res = await api.post(`/matches/${id}/dismiss`);
    return res.data;
  }
};
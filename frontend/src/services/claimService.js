import api from './api';

export const claimService = {
  async submitClaim(data) {
    const res = await api.post('/claims', data);
    return res.data.data;
  },
  async getMyClaims() {
    const res = await api.get('/claims/my-claims');
    return res.data.data;
  },
  async reviewClaim(id, verificationStatus, adminNotes) {
    const res = await api.patch(`/claims/${id}/review`, { verificationStatus, adminNotes });
    return res.data.data;
  },
  async confirmHandover(id) {
    const res = await api.patch(`/claims/${id}/handover`);
    return res.data.data;
  }
};
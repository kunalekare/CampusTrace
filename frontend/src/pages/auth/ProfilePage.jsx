import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { CheckCircle2, User, Mail, Shield, Building } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', department: '', phoneNumber: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await authService.getProfile();
        setProfile(data);
        setFormData({
          fullName: data.fullName || '',
          department: data.department || '',
          phoneNumber: data.phoneNumber || ''
        });
      } catch (err) {
        setError('Failed to load profile');
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const updated = await authService.updateProfile(formData);
      setProfile(updated);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
        <h2 className="text-xl font-bold text-slate-900">User Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Manage your campus contact details</p>

        {success && (
          <div className="flex items-center gap-2 p-3 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus Email (Read Only)</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(p => ({ ...p, phoneNumber: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
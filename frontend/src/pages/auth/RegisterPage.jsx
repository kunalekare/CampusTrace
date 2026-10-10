import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader2 } from 'lucide-react';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science',
    studentId: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">Create Campus Account</h2>
        <p className="text-xs text-slate-500 mt-1">Join the campus lost and found recovery network</p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Alex Mercer"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Campus Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@campus.edu"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student / ID #</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="STU-10492"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Register
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
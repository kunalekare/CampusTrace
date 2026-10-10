import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { Loader2 } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-slate-900">Sign in to CampusTrace</h2>
        <p className="text-xs text-slate-500 mt-1">Access your campus lost & found dashboard</p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Campus Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@campus.edu"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Demo Accounts Available:</p>
        <p>â€¢ Student: <span className="font-mono text-blue-600">student@campus.edu</span> / <span className="font-mono">Password@123</span></p>
        <p>â€¢ Admin: <span className="font-mono text-blue-600">admin@campustrace.edu</span> / <span className="font-mono">Password@123</span></p>
      </div>

      <div className="text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-blue-600 hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}
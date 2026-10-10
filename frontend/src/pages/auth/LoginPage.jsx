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
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Sign in to CampusTrace
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access your campus lost & found dashboard
        </p>
      </div>

      <ErrorMessage message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Campus Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@campus.edu"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      {/* Demo Accounts Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
        <p className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
          Demo Accounts Available:
        </p>
        <p className="text-[11px]">
          • Student: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">student@campus.edu</span> / <span className="font-mono text-slate-700 dark:text-slate-300">Password@123</span>
        </p>
        <p className="text-[11px]">
          • Admin: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">admin@campustrace.edu</span> / <span className="font-mono text-slate-700 dark:text-slate-300">Password@123</span>
        </p>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}
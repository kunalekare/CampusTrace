import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { Loader } from '../../components/common/Loader';
import { ShieldCheck, FileText, Users, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, l] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getCategories(),
          analyticsService.getLocations()
        ]);
        setStats(s);
        setCategories(c);
        setLocations(l);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading security metrics..." />;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="px-2.5 py-1 rounded bg-blue-600 text-xs font-bold uppercase tracking-wider">
            Admin Console
          </span>
          <h1 className="text-2xl font-black mt-2">Campus Security & Lost Property Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Review pending claims, verify handovers, and monitor recovery metrics.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/claims"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
          >
            Review Claims ({stats?.pendingClaims ?? 0})
          </Link>
        </div>
      </div>

      {/* Metrics Row (Section 4.I) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-2xl font-black text-slate-900">{stats?.totalReports ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Total Reports Logged</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-2xl font-black text-emerald-600">{stats?.recoveredItems ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Recovered Believed Items</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-2xl font-black text-blue-600">{stats?.recoveryRate ?? 0}%</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Overall Recovery Rate</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <p className="text-2xl font-black text-amber-600">{stats?.pendingClaims ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">Pending Claims for Review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Item Breakdown by Category</h3>
          <div className="space-y-2">
            {categories.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-600">{c.name}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{c.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Frequently Reported Locations</h3>
          <div className="space-y-2">
            {locations.map((l, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-50">
                <span className="text-slate-600">{l.name}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{l.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
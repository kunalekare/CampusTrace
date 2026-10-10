import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { Loader } from '../../components/common/Loader';

export function AnalyticsPage() {
  const [trends, setTrends] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [t, s] = await Promise.all([
          analyticsService.getMonthlyTrends(),
          analyticsService.getSummary()
        ]);
        setTrends(t || []);
        setSummary(s);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading analytics..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Campus Recovery Analytics</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time metrics on report volumes and successful recoveries</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-sm transition-colors">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Monthly Report & Recovery Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 uppercase font-bold text-slate-700 dark:text-slate-300 text-[11px]">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Lost Reports</th>
                <th className="p-3">Found Reports</th>
                <th className="p-3">Recovered Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trends.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{row.month}</td>
                  <td className="p-3 text-amber-700 dark:text-amber-400 font-semibold">{row.lost}</td>
                  <td className="p-3 text-blue-700 dark:text-blue-400 font-semibold">{row.found}</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">{row.recovered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
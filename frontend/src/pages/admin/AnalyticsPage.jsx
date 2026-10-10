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
        <h1 className="text-2xl font-black text-slate-900">Campus Recovery Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time metrics on report volumes and successful recoveries</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Monthly Report & Recovery Distribution</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-700">
              <tr>
                <th className="p-3">Month</th>
                <th className="p-3">Lost Reports</th>
                <th className="p-3">Found Reports</th>
                <th className="p-3">Recovered Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trends.map((row, i) => (
                <tr key={i}>
                  <td className="p-3 font-bold text-slate-900">{row.month}</td>
                  <td className="p-3 text-amber-700">{row.lost}</td>
                  <td className="p-3 text-blue-700">{row.found}</td>
                  <td className="p-3 font-bold text-emerald-700">{row.recovered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
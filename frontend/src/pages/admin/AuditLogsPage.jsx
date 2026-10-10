import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/dateUtils';

export function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/audit-logs');
        setLogs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading audit logs..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Trail</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Immutable security ledger for administrative actions and claim verification</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-x-auto shadow-sm transition-colors">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px]">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Entity ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map(log => (
              <tr key={log.auditLogId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                <td className="p-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">{formatDate(log.timestamp)}</td>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">User #{log.actorUserId || 'System'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold border border-blue-200/60 dark:border-blue-800/60">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300">{log.entityType}</td>
                <td className="p-4 font-mono text-slate-600 dark:text-slate-400">#{log.entityId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
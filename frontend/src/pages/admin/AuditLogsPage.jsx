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
        <h1 className="text-2xl font-black text-slate-900">System Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">Immutable security ledger for administrative actions and claim verification</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Entity ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.auditLogId} className="hover:bg-slate-50/50">
                <td className="p-4 font-mono text-[11px] text-slate-500">{formatDate(log.timestamp)}</td>
                <td className="p-4 font-semibold text-slate-900">User #{log.actorUserId || 'System'}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[11px] font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="p-4">{log.entityType}</td>
                <td className="p-4 font-mono">#{log.entityId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
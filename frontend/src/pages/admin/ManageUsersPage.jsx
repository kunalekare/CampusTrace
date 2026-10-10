import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';

export function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
    loadUsers();
  };

  if (loading) return <Loader label="Loading users..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Campus User Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Review student accounts and access statuses</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-x-auto shadow-sm transition-colors">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(u => (
              <tr key={u.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{u.fullName}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                <td className="p-4 uppercase font-semibold text-blue-600 dark:text-blue-400">{u.role}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{u.department || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    u.accountStatus === 'ACTIVE' 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}>
                    {u.accountStatus}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(u.userId, u.accountStatus)}
                    className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition"
                  >
                    {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
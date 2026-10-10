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
        <h1 className="text-2xl font-black text-slate-900">Campus User Management</h1>
        <p className="text-xs text-slate-500 mt-1">Review student accounts and access statuses</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-bold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => (
              <tr key={u.userId} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 uppercase font-semibold text-blue-600">{u.role}</td>
                <td className="p-4">{u.department || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.accountStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {u.accountStatus}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleStatus(u.userId, u.accountStatus)}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-600 hover:underline"
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
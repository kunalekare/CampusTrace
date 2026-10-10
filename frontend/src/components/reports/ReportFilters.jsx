import React from 'react';
import { CATEGORIES, LOCATIONS } from '../../utils/constants';
import { Search } from 'lucide-react';

export function ReportFilters({ filters, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 mb-6">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleInputChange}
          placeholder="Search by keywords, title, or brand..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Types (Lost & Found)</option>
          <option value="LOST">Lost Items</option>
          <option value="FOUND">Found Items</option>
        </select>

        <select
          name="category"
          value={filters.category || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          name="location"
          value={filters.location || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Campus Locations</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select
          name="status"
          value={filters.status || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="MATCHED">Matched</option>
          <option value="CLAIMED">Claimed</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>
    </div>
  );
}
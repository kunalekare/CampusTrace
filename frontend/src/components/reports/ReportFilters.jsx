import React from 'react';
import { CATEGORIES, LOCATIONS } from '../../utils/constants';
import { Search } from 'lucide-react';

export function ReportFilters({ filters, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 mb-6 transition-colors shadow-sm">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          name="search"
          value={filters.search || ''}
          onChange={handleInputChange}
          placeholder="Search by keywords, title, or brand..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Types (Lost & Found)</option>
          <option value="LOST">Lost Items</option>
          <option value="FOUND">Found Items</option>
        </select>

        <select
          name="category"
          value={filters.category || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          name="location"
          value={filters.location || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Campus Locations</option>
          {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <select
          name="status"
          value={filters.status || ''}
          onChange={handleInputChange}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
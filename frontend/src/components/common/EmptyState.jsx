import React from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ title = 'No records found', description, action }) {
  return (
    <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3">
        <PackageOpen className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
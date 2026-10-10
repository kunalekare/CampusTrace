import React from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ title = 'No records found', description, action }) {
  return (
    <div className="text-center py-12 px-4 bg-white border border-slate-200/80 rounded-2xl">
      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
        <PackageOpen className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
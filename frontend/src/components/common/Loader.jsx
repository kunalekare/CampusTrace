import React from 'react';

export function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
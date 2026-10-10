import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm rounded-xl mb-4 transition-colors">
      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
      <span>{message}</span>
    </div>
  );
}
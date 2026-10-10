import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl mb-4">
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
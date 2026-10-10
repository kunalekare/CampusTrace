import React from 'react';

export function MatchScore({ score }) {
  let color = 'bg-amber-500';
  let badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';

  if (score >= 80) {
    color = 'bg-emerald-500';
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (score < 60) {
    color = 'bg-blue-500';
    badgeColor = 'text-blue-700 bg-blue-50 border-blue-200';
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
        {score}% Match
      </span>
    </div>
  );
}
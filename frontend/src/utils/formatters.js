export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'MATCHED':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'CLAIMED':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'RESOLVED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'EXPIRED':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
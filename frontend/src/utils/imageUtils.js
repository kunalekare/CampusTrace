/**
 * Resolves the display URL for an uploaded item image.
 * Prefers direct Azure Blob Storage HTTPS URL, with fallback to backend streaming proxy.
 */
export function getItemImageUrl(blobName) {
  if (!blobName) return null;
  const trimmed = String(blobName).trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://campustracestorage.blob.core.windows.net/campustrace-images/${trimmed}`;
}

export function getItemFallbackProxyUrl(blobName) {
  if (!blobName) return null;
  const trimmed = String(blobName).trim();
  const fileName = trimmed.includes('/') ? trimmed.split('/').pop() : trimmed;
  return `/api/uploads/files/${fileName}`;
}

/**
 * Returns a cohesive gradient and icon color based on item category
 */
export function getCategoryTheme(category) {
  switch (category?.toLowerCase()) {
    case 'electronics':
      return {
        gradient: 'from-blue-600 via-indigo-600 to-violet-700',
        lightBg: 'bg-blue-50 text-blue-700 border-blue-200',
        badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-200/60'
      };
    case 'keys':
      return {
        gradient: 'from-amber-500 via-orange-500 to-amber-700',
        lightBg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-500/10 text-amber-700 border-amber-200/60'
      };
    case 'id cards & wallets':
    case 'wallets':
      return {
        gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
        lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/60'
      };
    case 'bags & backpacks':
      return {
        gradient: 'from-purple-600 via-fuchsia-600 to-pink-700',
        lightBg: 'bg-purple-50 text-purple-700 border-purple-200',
        badge: 'bg-purple-500/10 text-purple-700 border-purple-200/60'
      };
    case 'clothing & accessories':
      return {
        gradient: 'from-rose-500 via-pink-600 to-rose-700',
        lightBg: 'bg-rose-50 text-rose-700 border-rose-200',
        badge: 'bg-rose-500/10 text-rose-700 border-rose-200/60'
      };
    default:
      return {
        gradient: 'from-slate-700 via-slate-800 to-slate-900',
        lightBg: 'bg-slate-50 text-slate-700 border-slate-200',
        badge: 'bg-slate-500/10 text-slate-700 border-slate-200/60'
      };
  }
}

import React, { useState } from 'react';
import { Package, Laptop, Key, CreditCard, Backpack, Shirt, Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { getItemImageUrl, getItemFallbackProxyUrl, getCategoryTheme } from '../../utils/imageUtils';

export function ItemImage({ blobName, category, alt = 'Campus item', className = 'h-48 w-full', showBadge = true, onClick }) {
  const [useProxy, setUseProxy] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const primaryUrl = getItemImageUrl(blobName);
  const proxyUrl = getItemFallbackProxyUrl(blobName);
  const currentSrc = useProxy ? proxyUrl : primaryUrl;

  const theme = getCategoryTheme(category);

  const getCategoryIcon = () => {
    const iconClass = 'w-10 h-10 text-white/90 drop-shadow';
    switch (category?.toLowerCase()) {
      case 'electronics':
        return <Laptop className={iconClass} />;
      case 'keys':
        return <Key className={iconClass} />;
      case 'id cards & wallets':
      case 'wallets':
        return <CreditCard className={iconClass} />;
      case 'bags & backpacks':
        return <Backpack className={iconClass} />;
      case 'clothing & accessories':
        return <Shirt className={iconClass} />;
      default:
        return <Package className={iconClass} />;
    }
  };

  const handleImageError = () => {
    if (!useProxy && proxyUrl) {
      // Try fallback backend streaming endpoint
      setUseProxy(true);
    } else {
      setHasError(true);
    }
  };

  if (!blobName || hasError) {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center text-center p-4 ${className} ${
          onClick ? 'cursor-pointer hover:opacity-95' : ''
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/30 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-2 shadow-inner">
            {getCategoryIcon()}
          </div>
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-widest drop-shadow-sm">
            {category || 'Campus Item'}
          </span>
          <span className="text-[10px] text-white/60 mt-0.5">No photograph provided</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-100 group ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <Package className="w-8 h-8 text-slate-300 animate-bounce" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Azure Storage Badge */}
      {showBadge && loaded && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight bg-slate-900/75 backdrop-blur-md text-sky-300 border border-sky-400/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Azure Blob
          </span>
        </div>
      )}

      {/* Hover view overlay */}
      {onClick && (
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-[2px]">
          <Eye className="w-4 h-4" />
          <span>View Full Photo</span>
        </div>
      )}
    </div>
  );
}

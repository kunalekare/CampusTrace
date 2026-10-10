import React, { useState } from 'react';
import { MatchScore } from './MatchScore';
import { Check, X, ShieldAlert, Sparkles, MapPin, Calendar, Eye, ArrowRight } from 'lucide-react';
import { ItemImage } from '../common/ItemImage';
import { formatDate } from '../../utils/dateUtils';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';

export function MatchCard({ match, onDismiss, onClaim }) {
  const { lostReport, foundReport, score, matchReasons = [] } = match;
  const [lightboxImage, setLightboxImage] = useState(null);

  const lostBlob = lostReport?.imageBlobName || lostReport?.ImageBlobName;
  const foundBlob = foundReport?.imageBlobName || foundReport?.ImageBlobName;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 p-5 space-y-4 flex flex-col justify-between">
      {/* Header with Match Score */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/70 border border-purple-200/70 px-2.5 py-1 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Automated AI Pair
            </span>
            <MatchScore score={score} />
          </div>
          <button
            onClick={() => onDismiss(match.matchId)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
            title="Dismiss non-matching item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side-by-Side Visual Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {/* Lost Item Column */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/30 overflow-hidden flex flex-col">
            <div className="relative">
              <ItemImage
                blobName={lostBlob}
                category={lostReport?.category}
                alt={lostReport?.title}
                className="h-36 w-full"
                showBadge={false}
                onClick={() => {
                  const url = getItemImageUrl(lostBlob) || getItemFallbackProxyUrl(lostBlob);
                  if (url) setLightboxImage(url);
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
                Your Lost Item
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{lostReport?.title}</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{lostReport?.location}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {formatDate(lostReport?.eventDate)}
              </p>
            </div>
          </div>

          {/* Found Item Column */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/30 overflow-hidden flex flex-col">
            <div className="relative">
              <ItemImage
                blobName={foundBlob}
                category={foundReport?.category}
                alt={foundReport?.title}
                className="h-36 w-full"
                showBadge={false}
                onClick={() => {
                  const url = getItemImageUrl(foundBlob) || getItemFallbackProxyUrl(foundBlob);
                  if (url) setLightboxImage(url);
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                Found Candidate
              </span>
            </div>

            <div className="p-3 space-y-1">
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{foundReport?.title}</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{foundReport?.location}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                {formatDate(foundReport?.eventDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Match Breakdown */}
        {matchReasons.length > 0 && (
          <div className="mt-3 bg-purple-50/40 border border-purple-100 rounded-xl p-3">
            <p className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1">
              Matching Criteria:
            </p>
            <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
              {matchReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>Verification required before custody release</span>
        </div>
        <button
          onClick={() => onClaim(foundReport?.reportId || foundReport?.ReportId, match.matchId)}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
        >
          <span>Claim Found Item</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Lightbox Image Preview */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[100] cursor-zoom-out animate-fadeIn"
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white flex items-center gap-1 text-sm font-semibold"
            >
              <X className="w-6 h-6" />
              <span>Close</span>
            </button>
            <img
              src={lightboxImage}
              alt="Item photo inspection"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import { VerificationStatus } from '../../components/claims/VerificationStatus';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { ItemImage } from '../../components/common/ItemImage';
import { formatDate } from '../../utils/dateUtils';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';
import { ShieldCheck, MapPin, Calendar, Eye, X, FileText } from 'lucide-react';

export function MyClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await claimService.getMyClaims();
        setClaims(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading claims..." />;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Ownership Claims
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review status of your submitted claims, item photographs, and campus security handover confirmations.
        </p>
      </div>

      {claims.length === 0 ? (
        <EmptyState
          title="No claims submitted"
          description="When you identify an item belonging to you, submit an ownership claim with identifying proof."
        />
      ) : (
        <div className="space-y-4">
          {claims.map(claim => {
            const report = claim.report || {};
            const blobName = report.imageBlobName || report.ImageBlobName;

            return (
              <div 
                key={claim.claimId} 
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      <ItemImage
                        blobName={blobName}
                        category={report.category}
                        alt={report.title}
                        className="w-full h-full"
                        showBadge={false}
                        onClick={() => {
                          const url = getItemImageUrl(blobName) || getItemFallbackProxyUrl(blobName);
                          if (url) setLightboxImage(url);
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md">
                          {report.category || 'Item'}
                        </span>
                        {report.location && (
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {report.location}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                        {report.title || `Item #${claim.reportId}`}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Claim filed on {formatDate(claim.createdAt)}</p>
                    </div>
                  </div>

                  <VerificationStatus
                    status={claim.verificationStatus}
                    handoverStatus={claim.handoverStatus}
                  />
                </div>

                <div className="text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-1.5">
                  <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Submitted Verification Evidence:
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{claim.verificationEvidence}</p>
                </div>

                {claim.adminNotes && (
                  <div className="text-xs bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 p-4 rounded-2xl">
                    <p className="font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                      Security Desk Evaluation Notes:
                    </p>
                    <p className="text-blue-800 dark:text-blue-300 leading-relaxed">{claim.adminNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
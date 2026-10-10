import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { claimService } from '../../services/claimService';
import { Loader } from '../../components/common/Loader';
import { VerificationStatus } from '../../components/claims/VerificationStatus';
import { ItemImage } from '../../components/common/ItemImage';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';
import { Check, X, HandHeart, MapPin, Eye } from 'lucide-react';

export function ManageClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const loadClaims = async () => {
    try {
      const res = await api.get('/admin/claims');
      setClaims(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClaims();
  }, []);

  const handleReview = async (claimId, status) => {
    const notes = prompt(`Enter administrative note for claim ${status.toLowerCase()}:`);
    await claimService.reviewClaim(claimId, status, notes || 'Verified by campus officer');
    loadClaims();
  };

  const handleHandover = async (claimId) => {
    if (confirm('Confirm physical item handover to student? This marks the report as RESOLVED.')) {
      await claimService.confirmHandover(claimId);
      loadClaims();
    }
  };

  if (loading) return <Loader label="Loading claims..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ownership Claim Verification & Handover</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review secret identifying answers, inspect item photos, approve claims, and confirm custody handovers
        </p>
      </div>

      <div className="space-y-4">
        {claims.map(c => {
          const report = c.report || {};
          const blobName = report.imageBlobName || report.ImageBlobName;

          return (
            <div key={c.claimId} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer">
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
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Claim for: {report.title || `Item #${c.reportId}`}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Claimant: <span className="font-semibold text-slate-800 dark:text-slate-200">{c.claimant?.fullName}</span> ({c.claimant?.email})
                    </p>
                  </div>
                </div>
                <VerificationStatus status={c.verificationStatus} handoverStatus={c.handoverStatus} />
              </div>

              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/60 text-xs">
                <p className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-1">Protected Verification Proof Submitted:</p>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{c.verificationEvidence}</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {c.verificationStatus === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleReview(c.claimId, 'REJECTED')}
                      className="px-4 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Claim
                    </button>
                    <button
                      onClick={() => handleReview(c.claimId, 'APPROVED')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Claim
                    </button>
                  </>
                )}

                {c.verificationStatus === 'APPROVED' && c.handoverStatus !== 'CONFIRMED' && (
                  <button
                    onClick={() => handleHandover(c.claimId)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <HandHeart className="w-4 h-4" /> Confirm Physical Handover
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
              alt="High resolution item photograph"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
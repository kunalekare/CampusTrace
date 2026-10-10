import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MapPin, Calendar, Tag, ShieldCheck, X, Eye, 
  ExternalLink, Sparkles, Building2, Palette, Clock, CheckCircle2, ChevronRight
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { ReportFilters } from '../../components/reports/ReportFilters';
import { ReportList } from '../../components/reports/ReportList';
import { Loader } from '../../components/common/Loader';
import { ClaimForm } from '../../components/claims/ClaimForm';
import { ItemImage } from '../../components/common/ItemImage';
import { formatDate } from '../../utils/dateUtils';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';

export function BrowseReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedReportId = searchParams.get('selected');

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    location: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const data = await reportService.getReports(filters);
        setReports(data.reports || []);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [filters]);

  useEffect(() => {
    if (selectedReportId) {
      reportService.getReportById(selectedReportId)
        .then(setSelectedReport)
        .catch(err => {
          console.error('Failed to load selected report:', err);
        });
    }
  }, [selectedReportId]);

  const closeModal = () => {
    setSelectedReport(null);
    setSearchParams(prev => {
      prev.delete('selected');
      return prev;
    });
  };

  const isLost = selectedReport?.reportType === 'LOST';
  const blobName = selectedReport?.imageBlobName || selectedReport?.ImageBlobName;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Live Campus Directory â€¢ Azure SQL Synced
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Lost & Found Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, search, and recover belongings with automated AI matching and Azure Blob image verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active</span>
            <span className="text-lg font-black text-slate-900">{reports.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ReportFilters filters={filters} onChange={setFilters} />

      {/* Results List */}
      {loading ? (
        <Loader label="Querying Azure SQL Database & Storage..." />
      ) : (
        <ReportList reports={reports} onSelect={(report) => setSelectedReport(report)} />
      )}

      {/* Selected Item Full Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            
            {/* Modal Header Media (Azure Blob Photograph) */}
            <div className="relative bg-slate-900 w-full h-72 sm:h-80 flex-shrink-0 group">
              <ItemImage
                blobName={blobName}
                category={selectedReport.category}
                alt={selectedReport.title}
                className="w-full h-full"
                showBadge={true}
                onClick={() => {
                  const url = getItemImageUrl(blobName) || getItemFallbackProxyUrl(blobName);
                  if (url) setLightboxImage(url);
                }}
              />

              {/* Badges Floating on Top of Image */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                <span
                  className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur-md shadow-md ${
                    isLost
                      ? 'bg-amber-500/95 text-white border border-amber-400/40'
                      : 'bg-blue-600/95 text-white border border-blue-400/40'
                  }`}
                >
                  {isLost ? 'Lost Item Report' : 'Found Item Report'}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-md">
                  {selectedReport.status}
                </span>
              </div>

              {/* View high-res photo badge at bottom right */}
              {blobName && (
                <button
                  type="button"
                  onClick={() => {
                    const url = getItemImageUrl(blobName) || getItemFallbackProxyUrl(blobName);
                    if (url) setLightboxImage(url);
                  }}
                  className="absolute bottom-3 right-3 z-10 bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5 transition transform hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>Click to Expand Photo</span>
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition shadow-lg border border-white/20"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>{selectedReport.category}</span>
                  {selectedReport.brand && <span>â€¢ {selectedReport.brand}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedReport.title}
                </h2>
              </div>

              {/* Description Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Item Description
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </p>
              </div>

              {/* Key Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Location
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{selectedReport.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Date Recorded
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span>{formatDate(selectedReport.eventDate)}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Color
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Palette className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{selectedReport.color || 'Unspecified'}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Reporter
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate">{selectedReport.reporterName || 'Campus Student'}</span>
                  </div>
                </div>
              </div>

              {/* Distinctive Characteristics */}
              {selectedReport.distinctiveCharacteristics && (
                <div className="bg-indigo-50/60 border border-indigo-200/70 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Distinctive Marks & Characteristics
                  </h4>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {selectedReport.distinctiveCharacteristics}
                  </p>
                </div>
              )}

              {/* Storage & Handover (Found Items) */}
              {selectedReport.reportType === 'FOUND' && (selectedReport.storageLocation || selectedReport.handoverNotes) && (
                <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Custody & Physical Storage Location
                  </h4>
                  {selectedReport.storageLocation && (
                    <p className="text-xs text-blue-900 font-semibold">
                      Current Holding Office: {selectedReport.storageLocation}
                    </p>
                  )}
                  {selectedReport.handoverNotes && (
                    <p className="text-xs text-blue-700">
                      Handover Instructions: {selectedReport.handoverNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Claim Action for Found Items */}
              {selectedReport.reportType === 'FOUND' && (
                <div className="pt-2">
                  <button
                    onClick={() => setShowClaimModal(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5 text-white/90" />
                    <span>This Is My Item â€” Initiate Ownership Claim</span>
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    Claims require private verification details reviewed securely by campus administrators.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Image Lightbox Modal */}
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
              alt="High resolution view"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}

      {/* Claim Form Modal */}
      {showClaimModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <ClaimForm
              reportId={selectedReport.reportId}
              onSuccess={() => {
                setShowClaimModal(false);
                closeModal();
                alert('Claim submitted successfully! Campus security has been notified.');
              }}
              onCancel={() => setShowClaimModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
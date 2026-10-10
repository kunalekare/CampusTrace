import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, Sparkles, MapPin, Calendar, Tag, ShieldCheck, 
  X, Eye, CheckCircle2, AlertCircle, Clock, Trash2, ArrowRight, ExternalLink
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { ItemImage } from '../../components/common/ItemImage';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../utils/dateUtils';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';

export function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await reportService.getMyReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load my reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    setActionLoading(true);
    try {
      await reportService.updateStatus(reportId, newStatus);
      await fetchReports();
      if (selectedReport && (selectedReport.reportId === reportId || selectedReport.ReportId === reportId)) {
        setSelectedReport(prev => ({ ...prev, status: newStatus, Status: newStatus }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader label="Loading your personal campus reports..." />;

  const filteredReports = reports.filter(r => {
    if (filterType === 'ALL') return true;
    return r.reportType === filterType || r.ReportType === filterType;
  });

  const totalLost = reports.filter(r => (r.reportType || r.ReportType) === 'LOST').length;
  const totalFound = reports.filter(r => (r.reportType || r.ReportType) === 'FOUND').length;
  const totalResolved = reports.filter(r => (r.status || r.Status) === 'RESOLVED').length;

  const blobName = selectedReport?.imageBlobName || selectedReport?.ImageBlobName;
  const isLost = (selectedReport?.reportType || selectedReport?.ReportType) === 'LOST';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Personal Dashboard • Azure SQL Persistent
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your reported items, inspect uploaded photographs, and update recovery statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Filed</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{reports.length}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Lost Items</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalLost}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">Found Items</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalFound}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4">
          <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalResolved}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        {[
          { key: 'ALL', label: `All Reports (${reports.length})` },
          { key: 'LOST', label: `Lost Belongs (${totalLost})` },
          { key: 'FOUND', label: `Found Items (${totalFound})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key)}
            className={`px-3 py-1.5 rounded-xl transition ${
              filterType === tab.key
                ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Cards Grid */}
      {filteredReports.length === 0 ? (
        <EmptyState
          title="No reports in this category"
          description="Have you lost or found something on campus? Register a report with a photo to start tracking."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map(report => {
            const isItemLost = (report.reportType || report.ReportType) === 'LOST';
            const itemBlob = report.imageBlobName || report.ImageBlobName;
            const repId = report.reportId || report.ReportId;
            const status = report.status || report.Status;

            return (
              <div
                key={repId}
                onClick={() => setSelectedReport(report)}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative">
                    <ItemImage
                      blobName={itemBlob}
                      category={report.category}
                      alt={report.title}
                      className="h-44 w-full"
                      showBadge={true}
                    />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span
                        className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg backdrop-blur-md shadow-sm ${
                          isItemLost
                            ? 'bg-amber-500/90 text-white border border-amber-400/40'
                            : 'bg-blue-600/90 text-white border border-blue-400/40'
                        }`}
                      >
                        {isItemLost ? 'Lost Item' : 'Found Item'}
                      </span>
                      <span
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md shadow-sm ${
                          status === 'OPEN'
                            ? 'bg-emerald-500/90 text-white border border-emerald-400/40'
                            : 'bg-slate-800/80 text-white border border-slate-700'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {report.category}
                      </span>
                      {report.brand && (
                        <span className="text-slate-400 dark:text-slate-500 font-medium">• {report.brand}</span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {report.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{formatDate(report.eventDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 mt-1">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Click to inspect</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition">
                    <span>Manage Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Image Header */}
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

              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                <span
                  className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-xl backdrop-blur-md shadow-md ${
                    isLost
                      ? 'bg-amber-500/95 text-white border border-amber-400/40'
                      : 'bg-blue-600/95 text-white border border-blue-400/40'
                  }`}
                >
                  {isLost ? 'Your Lost Report' : 'Your Found Report'}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-white/20 shadow-md">
                  {selectedReport.status || selectedReport.Status}
                </span>
              </div>

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
                  <span>Expand High-Res Photo</span>
                </button>
              )}

              <button
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition shadow-lg border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  <span>{selectedReport.category}</span>
                  {selectedReport.brand && <span>• {selectedReport.brand}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedReport.title}
                </h2>
              </div>

              {/* Description */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Item Description
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </p>
              </div>

              {/* Private Ownership Verification (Visible to Owner!) */}
              {selectedReport.privateVerificationDetails && (
                <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Private Ownership Verification (Owner Eyes Only)
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {selectedReport.privateVerificationDetails}
                  </p>
                </div>
              )}

              {/* Storage & Handover info */}
              {(selectedReport.storageLocation || selectedReport.handoverNotes) && (
                <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 rounded-2xl p-4 space-y-1.5">
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                    Holding / Handover Notes
                  </h4>
                  {selectedReport.storageLocation && (
                    <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold">Location: {selectedReport.storageLocation}</p>
                  )}
                  {selectedReport.handoverNotes && (
                    <p className="text-xs text-blue-800 dark:text-blue-300">Notes: {selectedReport.handoverNotes}</p>
                  )}
                </div>
              )}

              {/* Status Action Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2.5">
                {(selectedReport.status || selectedReport.Status) !== 'RESOLVED' ? (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(selectedReport.reportId || selectedReport.ReportId, 'RESOLVED')}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Recovered / Resolved</span>
                  </button>
                ) : (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(selectedReport.reportId || selectedReport.ReportId, 'OPEN')}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reopen Report Status</span>
                  </button>
                )}
                <Link
                  to="/my-matches"
                  className="px-4 py-3 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check Algorithm Matches</span>
                </Link>
              </div>
            </div>
          </div>
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
              alt="High resolution item photograph"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}
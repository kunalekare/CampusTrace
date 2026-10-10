import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService } from '../../services/analyticsService';
import { reportService } from '../../services/reportService';
import { matchService } from '../../services/matchService';
import { ReportCard } from '../../components/reports/ReportCard';
import { Loader } from '../../components/common/Loader';
import { ItemImage } from '../../components/common/ItemImage';
import { formatDate } from '../../utils/dateUtils';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';
import {
  FileQuestion,
  PackageCheck,
  Sparkles,
  CheckCircle,
  PlusCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  X,
  Eye,
  MapPin,
  Calendar,
  Tag,
  Palette
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, repData, matchData] = await Promise.all([
          analyticsService.getSummary(),
          reportService.getReports({ limit: 4 }),
          matchService.getMyMatches()
        ]);
        setStats(sumData);
        setRecentReports(repData.reports || []);
        setMatchesCount((matchData || []).length);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loader label="Loading Campus Dashboard..." />;

  const blobName = selectedReport?.imageBlobName || selectedReport?.ImageBlobName;
  const isLost = (selectedReport?.reportType || selectedReport?.ReportType) === 'LOST';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white border border-white/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Azure Cloud Connected • Real-time DB Sync</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.fullName || 'Campus Member'}! 👋
          </h1>
          <p className="text-blue-100 text-sm mt-1 max-w-xl leading-relaxed">
            Track active campus lost items, check algorithmic match suggestions, and verify custody handovers with secure Azure Blob photography.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/report-lost"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/report-found"
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md transition flex items-center gap-1.5 border border-white/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-md transition flex items-center gap-1.5 border border-white/10"
            >
              <Search className="w-4 h-4" />
              <span>Browse All Items</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-amber-300 dark:hover:border-amber-500 transition">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
            <FileQuestion className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalLost ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Total Lost Reports</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <PackageCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalFound ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Total Found Reports</p>
        </div>

        <Link 
          to="/my-matches"
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition group block"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-slate-900 dark:text-white">{matchesCount}</p>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">View</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Active Smart Matches</p>
        </Link>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-500 transition">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{stats?.recoveredItems ?? 0}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Recovered Belongings</p>
        </div>
      </div>

      {/* Recently Reported Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recently Reported Campus Items</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">Click any card to inspect high-resolution photographs & details</p>
          </div>
          <Link to="/browse" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <span>View full directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentReports.map(report => (
            <ReportCard 
              key={report.reportId || report.ReportId} 
              report={report} 
              onSelect={(r) => setSelectedReport(r)} 
            />
          ))}
        </div>
      </div>

      {/* Selected Item Full Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header Media */}
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
                  {isLost ? 'Lost Item Report' : 'Found Item Report'}
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
                  <span>Click to Expand Photo</span>
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
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  <span>{selectedReport.category}</span>
                  {selectedReport.brand && <span>• {selectedReport.brand}</span>}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedReport.title}
                </h2>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  Item Description
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Location
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{selectedReport.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Date Recorded
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                    <span>{formatDate(selectedReport.eventDate)}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Color
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <Palette className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{selectedReport.color || 'Unspecified'}</span>
                  </div>
                </div>

                <div className="bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 rounded-xl p-3">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Reporter
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate">{selectedReport.reporterName || 'Campus Student'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/browse?selected=${selectedReport.reportId || selectedReport.ReportId}`}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Open In Full Directory & Claim View</span>
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
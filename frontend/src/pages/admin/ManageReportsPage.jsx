import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';
import { formatDate } from '../../utils/dateUtils';
import { getStatusBadgeClass } from '../../utils/formatters';
import { ItemImage } from '../../components/common/ItemImage';
import { getItemImageUrl, getItemFallbackProxyUrl } from '../../utils/imageUtils';
import { Eye, X } from 'lucide-react';

export function ManageReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const loadReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleStatusChange = async (reportId, status) => {
    await api.patch(`/reports/${reportId}/status`, { status });
    loadReports();
  };

  if (loading) return <Loader label="Loading campus reports..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage & Moderate Reports</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review reported items with Azure Blob Storage photographs and update lifecycle states
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-x-auto shadow-sm transition-colors">
        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase font-bold text-[11px]">
            <tr>
              <th className="p-4">Photo</th>
              <th className="p-4">Type</th>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map(r => {
              const blobName = r.imageBlobName || r.ImageBlobName;
              return (
                <tr key={r.reportId || r.ReportId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                  <td className="p-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer">
                      <ItemImage
                        blobName={blobName}
                        category={r.category}
                        alt={r.title}
                        className="w-full h-full"
                        showBadge={false}
                        onClick={() => {
                          const url = getItemImageUrl(blobName) || getItemFallbackProxyUrl(blobName);
                          if (url) setLightboxImage(url);
                        }}
                      />
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{r.reportType}</td>
                  <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">{r.title}</td>
                  <td className="p-4">{r.category}</td>
                  <td className="p-4">{r.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getStatusBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r.reportId || r.ReportId, e.target.value)}
                      className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OPEN" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">OPEN</option>
                      <option value="MATCHED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">MATCHED</option>
                      <option value="CLAIMED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">CLAIMED</option>
                      <option value="RESOLVED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">RESOLVED</option>
                      <option value="EXPIRED" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">EXPIRED</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
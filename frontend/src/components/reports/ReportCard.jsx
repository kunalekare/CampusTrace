import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { getStatusBadgeClass } from '../../utils/formatters';
import { ItemImage } from '../common/ItemImage';

export function ReportCard({ report, onSelect }) {
  const isLost = report.reportType === 'LOST';
  const blobName = report.imageBlobName || report.ImageBlobName;
  const reportId = report.reportId || report.ReportId;

  const handleClick = (e) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(report);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        onSelect ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top Media Section */}
      <div>
        <div className="relative">
          <ItemImage
            blobName={blobName}
            category={report.category}
            alt={report.title}
            className="h-48 w-full"
            showBadge={true}
          />

          {/* Type & Status Badges Floating on Top of Image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span
              className={`px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg backdrop-blur-md shadow-sm ${
                isLost
                  ? 'bg-amber-500/90 text-white border border-amber-400/40'
                  : 'bg-blue-600/90 text-white border border-blue-400/40'
              }`}
            >
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            <span
              className={`px-2 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md shadow-sm ${
                report.status === 'OPEN'
                  ? 'bg-emerald-500/90 text-white border border-emerald-400/40'
                  : 'bg-slate-800/80 text-white border border-slate-700'
              }`}
            >
              {report.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <Tag className="w-3 h-3 text-slate-400" />
              {report.category}
            </span>
            {report.brand && (
              <span className="text-slate-400 font-medium">• {report.brand}</span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {report.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {report.description}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1 font-medium">{report.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{formatDate(report.eventDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-slate-50 mt-1">
        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
          By {report.reporterName || 'Campus Student'}
        </span>
        {onSelect ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(report);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition group-hover:translate-x-0.5"
          >
            <span>View Details & Photo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Link
            to={`/browse?selected=${reportId}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 transition group-hover:translate-x-0.5"
          >
            <span>View Details & Photo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
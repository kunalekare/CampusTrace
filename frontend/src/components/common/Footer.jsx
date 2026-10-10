import React from 'react';
import { ShieldCheck, Cloud, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                C
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Campus<span className="text-blue-600">Trace</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              University smart lost & found network. Instant algorithmic matching, Azure Blob photograph storage, and verified physical custody handovers.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Microsoft Azure Cloud Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/browse" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Browse Lost & Found
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-amber-600 dark:hover:text-amber-400 transition">
                  Report Lost Belonging
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition">
                  Student Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Desks */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Security Holding Desks
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li>Central Library Desk: Desk 104</li>
              <li>Student Union Center: Room 202</li>
              <li>Campus Safety Desk: Bldg A</li>
              <li className="pt-1 text-slate-700 dark:text-slate-300 font-semibold">
                Emergency Dispatch: (555) 019-2834
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-3">
          <p>© 2026 CampusTrace. Powered by Microsoft Azure (App Service, Azure SQL, Blob Storage).</p>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span>Built for Campus Communities</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
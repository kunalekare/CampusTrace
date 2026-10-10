import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  FolderHeart,
  Sparkles,
  ShieldCheck,
  Bell,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-bold'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 md:bg-transparent z-40 md:z-auto p-4 md:p-0 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="bg-white dark:bg-slate-900 md:border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-6 transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Student Hub
            </p>
            <nav className="space-y-1">
              <NavLink to="/dashboard" className={linkClass} onClick={onClose}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </NavLink>
              <NavLink to="/browse" className={linkClass} onClick={onClose}>
                <Search className="w-4 h-4" />
                Browse Directory
              </NavLink>
              <NavLink to="/my-reports" className={linkClass} onClick={onClose}>
                <FolderHeart className="w-4 h-4" />
                My Reports
              </NavLink>
              <NavLink to="/my-matches" className={linkClass} onClick={onClose}>
                <Sparkles className="w-4 h-4" />
                Smart Matches
              </NavLink>
              <NavLink to="/my-claims" className={linkClass} onClick={onClose}>
                <ShieldCheck className="w-4 h-4" />
                Claims & Handovers
              </NavLink>
              <NavLink to="/notifications" className={linkClass} onClick={onClose}>
                <Bell className="w-4 h-4" />
                Notifications
              </NavLink>
            </nav>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Action Desk
            </p>
            <nav className="space-y-1">
              <NavLink to="/report-lost" className={linkClass} onClick={onClose}>
                <PlusCircle className="w-4 h-4 text-amber-500" />
                Report Lost Item
              </NavLink>
              <NavLink to="/report-found" className={linkClass} onClick={onClose}>
                <PlusCircle className="w-4 h-4 text-blue-500" />
                Report Found Item
              </NavLink>
            </nav>
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider px-3 mb-2">
                Administration
              </p>
              <nav className="space-y-1">
                <NavLink to="/admin" className={linkClass} onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Overview
                </NavLink>
                <NavLink to="/admin/reports" className={linkClass} onClick={onClose}>
                  <FolderHeart className="w-4 h-4" />
                  Moderate Reports
                </NavLink>
                <NavLink to="/admin/claims" className={linkClass} onClick={onClose}>
                  <ShieldCheck className="w-4 h-4" />
                  Verify Claims
                </NavLink>
                <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
                  <Users className="w-4 h-4" />
                  Campus Users
                </NavLink>
                <NavLink to="/admin/analytics" className={linkClass} onClick={onClose}>
                  <BarChart3 className="w-4 h-4" />
                  Recovery Metrics
                </NavLink>
                <NavLink to="/admin/audit-logs" className={linkClass} onClick={onClose}>
                  <FileText className="w-4 h-4" />
                  Audit Logs
                </NavLink>
              </nav>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
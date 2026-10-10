import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../notifications/NotificationBell';
import { LogOut, User, Menu, PlusCircle, Search } from 'lucide-react';

export function Navbar({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="CampusTrace" className="h-8" />
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/browse"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Browse Items
            </Link>
            <Link
              to="/report-lost"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
            >
              <PlusCircle className="w-4 h-4 text-amber-600" />
              Report Lost
            </Link>
            <Link
              to="/report-found"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
            >
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Report Found
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-40">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 uppercase">
                          {user.role}
                        </span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
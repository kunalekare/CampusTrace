import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationList } from '../../components/notifications/NotificationList';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">All Notifications</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time alerts for item matches, claims, and status changes</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold rounded-xl transition border border-blue-200/60 dark:border-blue-800/60"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm transition-colors">
        <NotificationList notifications={notifications} onMarkRead={markAsRead} />
      </div>
    </div>
  );
}
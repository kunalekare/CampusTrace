import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationList } from '../../components/notifications/NotificationList';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">All Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time alerts for item matches, claims, and status changes</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg transition"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <NotificationList notifications={notifications} onMarkRead={markAsRead} />
      </div>
    </div>
  );
}
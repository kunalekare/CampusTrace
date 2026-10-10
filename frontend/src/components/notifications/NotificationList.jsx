import React from 'react';
import { timeAgo } from '../../utils/dateUtils';
import { Sparkles, CheckCircle2, ShieldAlert, Bell } from 'lucide-react';

export function NotificationList({ notifications = [], onMarkRead, onClose }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
        No notifications right now.
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'POTENTIAL_MATCH':
        return <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'CLAIM_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'CLAIM_REJECTED':
        return <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="space-y-2 max-h-72 overflow-y-auto">
      {notifications.map(n => (
        <div
          key={n.notificationId}
          onClick={() => {
            if (!n.isRead && onMarkRead) onMarkRead(n.notificationId);
          }}
          className={`p-3 rounded-2xl border text-xs cursor-pointer transition ${
            n.isRead
              ? 'bg-white dark:bg-slate-800/70 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/60 text-slate-900 dark:text-white font-semibold hover:bg-blue-50/80 dark:hover:bg-blue-950/60'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5">{getIcon(n.type)}</div>
            <div className="flex-1">
              <p className="leading-snug">{n.message}</p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{timeAgo(n.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { timeAgo } from '../../utils/dateUtils';
import { Sparkles, CheckCircle2, ShieldAlert, Bell } from 'lucide-react';

export function NotificationList({ notifications = [], onMarkRead, onClose }) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400">
        No notifications right now.
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'POTENTIAL_MATCH':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'CLAIM_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'CLAIM_REJECTED':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
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
          className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
            n.isRead
              ? 'bg-white border-slate-100 text-slate-600'
              : 'bg-blue-50/40 border-blue-100 text-slate-900 font-medium'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5">{getIcon(n.type)}</div>
            <div className="flex-1">
              <p className="leading-snug">{n.message}</p>
              <span className="text-[10px] text-slate-400 mt-1 block">{timeAgo(n.createdAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
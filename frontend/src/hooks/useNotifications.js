import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './useAuth';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Polling every 20s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead, refresh: fetchNotifications };
}
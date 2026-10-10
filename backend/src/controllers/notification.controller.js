import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const list = await notificationService.getUserNotifications(req.user.userId);
  res.json({
    success: true,
    data: list
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.userId);
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.userId);
  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});
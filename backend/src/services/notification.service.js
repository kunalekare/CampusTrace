import { notificationRepository } from '../repositories/notification.repository.js';

export class NotificationService {
  async notify(userId, type, message, relatedReportId = null, relatedMatchId = null) {
    return notificationRepository.create({
      userId,
      type,
      message,
      relatedReportId,
      relatedMatchId
    });
  }

  async getUserNotifications(userId) {
    return notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId, userId) {
    return notificationRepository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId) {
    return notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
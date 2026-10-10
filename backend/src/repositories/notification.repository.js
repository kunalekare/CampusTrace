import { memoryDb, getDbPool } from '../config/database.js';
import { mapRow, mapRows } from '../utils/dbMapper.js';

export class NotificationRepository {
  async create(data) {
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', data.userId)
        .input('type', data.type)
        .input('message', data.message)
        .input('relatedReportId', data.relatedReportId || null)
        .input('relatedMatchId', data.relatedMatchId || null)
        .input('isRead', false)
        .query(`
          INSERT INTO dbo.Notifications (UserId, Type, Message, RelatedReportId, RelatedMatchId, IsRead)
          OUTPUT INSERTED.*
          VALUES (@userId, @type, @message, @relatedReportId, @relatedMatchId, @isRead)
        `);
      return mapRow(res.recordset[0]);
    }
    const newNotif = {
      notificationId: memoryDb.notifications.length + 1,
      userId: data.userId,
      type: data.type,
      message: data.message,
      relatedReportId: data.relatedReportId || null,
      relatedMatchId: data.relatedMatchId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    memoryDb.notifications.push(newNotif);
    return mapRow(newNotif);
  }

  async findByUserId(userId) {
    const uid = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('userId', uid)
        .query('SELECT * FROM dbo.Notifications WHERE UserId = @userId ORDER BY CreatedAt DESC');
      return mapRows(res.recordset);
    }
    return memoryDb.notifications
      .filter(n => n.userId === uid)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(mapRow);
  }

  async markAsRead(notificationId, userId) {
    const nid = parseInt(notificationId, 10);
    const uid = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      const res = await pool.request()
        .input('notificationId', nid)
        .input('userId', uid)
        .query(`
          UPDATE dbo.Notifications 
          SET IsRead = 1 
          OUTPUT INSERTED.*
          WHERE NotificationId = @notificationId AND UserId = @userId
        `);
      return mapRow(res.recordset[0]) || null;
    }
    const notif = memoryDb.notifications.find(n => 
      n.notificationId === nid && 
      n.userId === uid
    );
    if (notif) notif.isRead = true;
    return mapRow(notif);
  }

  async markAllAsRead(userId) {
    const uid = parseInt(userId, 10);
    const pool = await getDbPool();
    if (pool) {
      await pool.request()
        .input('userId', uid)
        .query('UPDATE dbo.Notifications SET IsRead = 1 WHERE UserId = @userId');
      return true;
    }
    memoryDb.notifications.forEach(n => {
      if (n.userId === uid) n.isRead = true;
    });
    return true;
  }
}

export const notificationRepository = new NotificationRepository();
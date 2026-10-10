const { app } = require('@azure/functions');
const { processNotificationDispatch } = require('../services/notificationProcessor');

app.serviceBusQueue('sendNotifications', {
  connection: 'SERVICE_BUS_CONNECTION',
  queueName: 'item-notifications',
  handler: async (message, context) => {
    context.log('Azure Function executing notification alert:', message);
    try {
      const result = await processNotificationDispatch(message);
      context.log('Notification sent successfully:', result);
    } catch (err) {
      context.error('Failed to dispatch notification:', err);
      throw err;
    }
  }
});
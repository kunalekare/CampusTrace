const { app } = require('@azure/functions');
const { processMatchingJob } = require('../services/matchingProcessor');

app.serviceBusQueue('processMatchingJob', {
  connection: 'SERVICE_BUS_CONNECTION',
  queueName: 'item-matching-jobs',
  handler: async (message, context) => {
    context.log('Azure Function executing item matching job:', message);
    try {
      const outcome = await processMatchingJob(message);
      context.log('Matching job executed successfully:', outcome);
    } catch (err) {
      context.error('Error during matching job processing:', err);
      throw err;
    }
  }
});
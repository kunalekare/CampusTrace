import appInsights from 'applicationinsights';

export function setupTelemetry() {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  if (connectionString) {
    appInsights.setup(connectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .start();
    console.log('[Telemetry] Azure Application Insights active.');
  }
}
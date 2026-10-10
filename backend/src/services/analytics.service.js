import { memoryDb } from '../config/database.js';

export class AnalyticsService {
  async getSummary() {
    const totalReports = memoryDb.itemReports.length;
    const totalLost = memoryDb.itemReports.filter(r => r.reportType === 'LOST').length;
    const totalFound = memoryDb.itemReports.filter(r => r.reportType === 'FOUND').length;
    const recoveredItems = memoryDb.itemReports.filter(r => r.status === 'RESOLVED').length;
    const pendingClaims = memoryDb.claims.filter(c => c.verificationStatus === 'PENDING').length;
    const potentialMatches = memoryDb.potentialMatches.length;

    const recoveryRate = totalLost > 0 ? ((recoveredItems / totalLost) * 100).toFixed(1) : '0.0';

    return {
      totalReports,
      totalLost,
      totalFound,
      recoveredItems,
      recoveryRate: parseFloat(recoveryRate),
      pendingClaims,
      potentialMatches,
      totalUsers: memoryDb.users.length
    };
  }

  async getCategories() {
    const counts = {};
    memoryDb.itemReports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  async getLocations() {
    const counts = {};
    memoryDb.itemReports.forEach(r => {
      counts[r.location] = (counts[r.location] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  async getMonthlyTrends() {
    return [
      { month: 'Jan', lost: 12, found: 8, recovered: 6 },
      { month: 'Feb', lost: 18, found: 14, recovered: 11 },
      { month: 'Mar', lost: 24, found: 19, recovered: 15 },
      { month: 'Apr', lost: 16, found: 15, recovered: 12 },
      { month: 'May', lost: 22, found: 20, recovered: 17 }
    ];
  }
}

export const analyticsService = new AnalyticsService();
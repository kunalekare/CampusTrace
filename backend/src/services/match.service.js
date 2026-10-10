import { matchRepository } from '../repositories/match.repository.js';
import { reportRepository } from '../repositories/report.repository.js';
import { notificationService } from './notification.service.js';
import { calculateMatchScore } from './matchingAlgorithm.service.js';
import { appConfig } from '../config/appConfig.js';

export class MatchService {
  async evaluateMatchesForReport(newReport) {
    const oppositeType = newReport.reportType === 'LOST' ? 'FOUND' : 'LOST';
    const candidates = await reportRepository.findCompatibleReports(oppositeType, newReport.category);

    for (const candidate of candidates) {
      const lostItem = newReport.reportType === 'LOST' ? newReport : candidate;
      const foundItem = newReport.reportType === 'FOUND' ? newReport : candidate;

      const { score, reasons } = calculateMatchScore(lostItem, foundItem);

      if (score >= appConfig.matchingWeights.threshold) {
        const match = await matchRepository.create({
          lostReportId: lostItem.reportId,
          foundReportId: foundItem.reportId,
          score,
          matchReasons: JSON.stringify(reasons)
        });

        // Notify both parties of potential match
        await notificationService.notify(
          lostItem.userId,
          'POTENTIAL_MATCH',
          `Potential Match Found: "${foundItem.title}" matches your lost item with a score of ${score}%.`,
          lostItem.reportId,
          match.matchId
        );

        await notificationService.notify(
          foundItem.userId,
          'POTENTIAL_MATCH',
          `Your found item "${foundItem.title}" has a potential match (${score}%) with a reported lost item.`,
          foundItem.reportId,
          match.matchId
        );
      }
    }
  }

  async getUserMatches(userId) {
    const matches = await matchRepository.findByUserId(userId);
    return matches.map(m => ({
      ...m,
      matchReasons: typeof m.matchReasons === 'string' ? JSON.parse(m.matchReasons) : m.matchReasons
    }));
  }

  async getMatchById(matchId) {
    const match = await matchRepository.findById(matchId);
    if (!match) return null;
    return {
      ...match,
      matchReasons: typeof m.matchReasons === 'string' ? JSON.parse(m.matchReasons) : m.matchReasons
    };
  }

  async dismissMatch(matchId, userId) {
    return matchRepository.updateStatus(matchId, 'DISMISSED');
  }
}

export const matchService = new MatchService();
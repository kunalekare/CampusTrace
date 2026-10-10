import { reportRepository } from '../repositories/report.repository.js';
import { matchService } from './match.service.js';
import { auditLogService } from './auditLog.service.js';
import { ApiError } from '../utils/ApiError.js';

export class ReportService {
  async createReport(data, userId) {
    const report = await reportRepository.create({
      ...data,
      userId
    });

    await auditLogService.log(userId, 'REPORT_CREATED', 'ItemReport', report.reportId, {
      type: report.reportType,
      title: report.title
    });

    // Run smart matching against open reports
    setTimeout(() => {
      matchService.evaluateMatchesForReport(report).catch(err => {
        console.error('[ReportService] Error during auto-matching:', err);
      });
    }, 100);

    return report;
  }

  async getReportById(reportId, viewerRole, viewerId) {
    const report = await reportRepository.findById(reportId);
    if (!report) throw ApiError.notFound('Report not found');

    // Protect private verification details: only admin or owner can view
    const isOwner = viewerId && report.userId === viewerId;
    const isAdmin = viewerRole === 'admin';

    if (!isOwner && !isAdmin) {
      delete report.privateVerificationDetails;
    }

    return report;
  }

  async getReports(filters) {
    const result = await reportRepository.findMany(filters);
    // Sanitize private verification details from public browse
    result.reports = result.reports.map(r => {
      const { privateVerificationDetails, ...safe } = r;
      return safe;
    });
    return result;
  }

  async getUserReports(userId) {
    return reportRepository.findByUserId(userId);
  }

  async updateReport(reportId, updates, userId, userRole) {
    const report = await reportRepository.findById(reportId);
    if (!report) throw ApiError.notFound('Report not found');

    if (report.userId !== userId && userRole !== 'admin') {
      throw ApiError.forbidden('You are not authorized to edit this report');
    }

    const updated = await reportRepository.update(reportId, updates);
    await auditLogService.log(userId, 'REPORT_UPDATED', 'ItemReport', reportId);
    return updated;
  }

  async updateStatus(reportId, status, userId, userRole) {
    const report = await reportRepository.findById(reportId);
    if (!report) throw ApiError.notFound('Report not found');

    if (report.userId !== userId && userRole !== 'admin') {
      throw ApiError.forbidden('Not authorized to update status');
    }

    const updated = await reportRepository.update(reportId, { status });
    await auditLogService.log(userId, 'REPORT_STATUS_CHANGED', 'ItemReport', reportId, { status });
    return updated;
  }
}

export const reportService = new ReportService();
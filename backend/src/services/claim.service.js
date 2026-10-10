import { claimRepository } from '../repositories/claim.repository.js';
import { reportRepository } from '../repositories/report.repository.js';
import { notificationService } from './notification.service.js';
import { auditLogService } from './auditLog.service.js';
import { ApiError } from '../utils/ApiError.js';

export class ClaimService {
  async submitClaim(claimData, claimantId) {
    const report = await reportRepository.findById(claimData.reportId);
    if (!report) throw ApiError.notFound('Found item report not found');

    if (report.userId === claimantId) {
      throw ApiError.badRequest('You cannot submit an ownership claim on an item you reported finding.');
    }

    const claim = await claimRepository.create({
      ...claimData,
      claimantId
    });

    await auditLogService.log(claimantId, 'CLAIM_SUBMITTED', 'Claim', claim.claimId);

    // Notify finder that claim has been lodged
    await notificationService.notify(
      report.userId,
      'CLAIM_SUBMITTED',
      `A student has submitted an ownership claim for "${report.title}". Pending administrator verification.`,
      report.reportId
    );

    return claim;
  }

  async reviewClaim(claimId, reviewData, adminId) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) throw ApiError.notFound('Claim not found');

    const updated = await claimRepository.update(claimId, {
      verificationStatus: reviewData.verificationStatus,
      adminNotes: reviewData.adminNotes,
      reviewedBy: adminId,
      reviewedAt: new Date().toISOString()
    });

    const isApproved = reviewData.verificationStatus === 'APPROVED';

    if (isApproved) {
      await reportRepository.update(claim.reportId, { status: 'CLAIMED' });
    }

    await auditLogService.log(adminId, 'CLAIM_REVIEWED', 'Claim', claimId, {
      status: reviewData.verificationStatus
    });

    // Notify claimant
    await notificationService.notify(
      claim.claimantId,
      isApproved ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED',
      isApproved 
        ? `Great news! Your ownership claim for "${claim.report.title}" was APPROVED. Please visit Campus Security for handover.`
        : `Your claim for "${claim.report.title}" was reviewed and could not be verified. Reason: ${reviewData.adminNotes || 'Insufficient proof.'}`,
      claim.reportId
    );

    return updated;
  }

  async confirmHandover(claimId, adminId) {
    const claim = await claimRepository.findById(claimId);
    if (!claim) throw ApiError.notFound('Claim not found');

    if (claim.verificationStatus !== 'APPROVED') {
      throw ApiError.badRequest('Cannot confirm handover for unapproved claim');
    }

    const updated = await claimRepository.update(claimId, {
      handoverStatus: 'CONFIRMED',
      handoverConfirmedAt: new Date().toISOString()
    });

    // Mark the report as RESOLVED (Recovered!)
    await reportRepository.update(claim.reportId, { status: 'RESOLVED' });

    await auditLogService.log(adminId, 'HANDOVER_CONFIRMED', 'Claim', claimId);

    await notificationService.notify(
      claim.claimantId,
      'HANDOVER_CONFIRMED',
      `Handover confirmed! Your item "${claim.report.title}" is officially marked as returned.`,
      claim.reportId
    );

    return updated;
  }

  async getUserClaims(userId) {
    return claimRepository.findByUserId(userId);
  }

  async getAllClaims() {
    return claimRepository.getAll();
  }
}

export const claimService = new ClaimService();
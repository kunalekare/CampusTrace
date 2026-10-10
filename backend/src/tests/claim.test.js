import test from 'node:test';
import assert from 'node:assert/strict';
import { claimService } from '../services/claim.service.js';

test('ClaimService: submits claim and completes admin review workflow', async () => {
  const claim = await claimService.submitClaim({
    reportId: 2,
    verificationEvidence: 'Serial Number: TI-9920194 with blue sticker on battery compartment.'
  }, 2);

  assert.ok(claim.claimId);
  assert.equal(claim.verificationStatus, 'PENDING');

  const reviewed = await claimService.reviewClaim(claim.claimId, {
    verificationStatus: 'APPROVED',
    adminNotes: 'Serial number verified against box photo.'
  }, 1);

  assert.equal(reviewed.verificationStatus, 'APPROVED');

  const handover = await claimService.confirmHandover(claim.claimId, 1);
  assert.equal(handover.handoverStatus, 'CONFIRMED');
});
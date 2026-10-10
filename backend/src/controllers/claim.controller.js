import { claimService } from '../services/claim.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createClaim = asyncHandler(async (req, res) => {
  const claim = await claimService.submitClaim(req.body, req.user.userId);
  res.status(201).json({
    success: true,
    message: 'Ownership claim submitted. It will be verified by campus administration.',
    data: claim
  });
});

export const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await claimService.getUserClaims(req.user.userId);
  res.json({
    success: true,
    data: claims
  });
});

export const getClaimById = asyncHandler(async (req, res) => {
  const claim = await claimService.getAllClaims();
  const target = claim.find(c => c.claimId === parseInt(req.params.id, 10));
  res.json({
    success: true,
    data: target
  });
});

export const reviewClaim = asyncHandler(async (req, res) => {
  const reviewed = await claimService.reviewClaim(req.params.id, req.body, req.user.userId);
  res.json({
    success: true,
    message: `Claim ${req.body.verificationStatus.toLowerCase()} successfully`,
    data: reviewed
  });
});

export const confirmHandover = asyncHandler(async (req, res) => {
  const confirmed = await claimService.confirmHandover(req.params.id, req.user.userId);
  res.json({
    success: true,
    message: 'Item handover confirmed! Item status marked as RESOLVED.',
    data: confirmed
  });
});
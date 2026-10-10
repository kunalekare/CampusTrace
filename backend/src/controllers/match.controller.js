import { matchService } from '../services/match.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyMatches = asyncHandler(async (req, res) => {
  const matches = await matchService.getUserMatches(req.user.userId);
  res.json({
    success: true,
    data: matches
  });
});

export const getMatchById = asyncHandler(async (req, res) => {
  const match = await matchService.getMatchById(req.params.id);
  res.json({
    success: true,
    data: match
  });
});

export const dismissMatch = asyncHandler(async (req, res) => {
  await matchService.dismissMatch(req.params.id, req.user.userId);
  res.json({
    success: true,
    message: 'Match dismissed'
  });
});
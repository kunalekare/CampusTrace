import { analyticsService } from '../services/analytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getSummary = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummary();
  res.json({ success: true, data });
});

export const getCategories = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCategories();
  res.json({ success: true, data });
});

export const getLocations = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLocations();
  res.json({ success: true, data });
});

export const getMonthlyTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyTrends();
  res.json({ success: true, data });
});
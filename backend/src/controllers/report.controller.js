import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createReport = asyncHandler(async (req, res) => {
  const report = await reportService.createReport(req.body, req.user.userId);
  res.status(201).json({
    success: true,
    message: 'Report submitted successfully',
    data: report
  });
});

export const getReports = asyncHandler(async (req, res) => {
  const { type, category, location, status, search, limit, offset } = req.query;
  const result = await reportService.getReports({
    type,
    category,
    location,
    status,
    search,
    limit: limit ? parseInt(limit, 10) : 20,
    offset: offset ? parseInt(offset, 10) : 0
  });
  res.json({
    success: true,
    data: result
  });
});

export const getReportById = asyncHandler(async (req, res) => {
  const viewerRole = req.user ? req.user.role : null;
  const viewerId = req.user ? req.user.userId : null;
  const report = await reportService.getReportById(req.params.id, viewerRole, viewerId);
  res.json({
    success: true,
    data: report
  });
});

export const getMyReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getUserReports(req.user.userId);
  res.json({
    success: true,
    data: reports
  });
});

export const updateReport = asyncHandler(async (req, res) => {
  const updated = await reportService.updateReport(req.params.id, req.body, req.user.userId, req.user.role);
  res.json({
    success: true,
    message: 'Report updated successfully',
    data: updated
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const updated = await reportService.updateStatus(req.params.id, status, req.user.userId, req.user.role);
  res.json({
    success: true,
    message: 'Report status updated',
    data: updated
  });
});

export const deleteReport = asyncHandler(async (req, res) => {
  const updated = await reportService.updateStatus(req.params.id, 'EXPIRED', req.user.userId, req.user.role);
  res.json({
    success: true,
    message: 'Report marked as expired/closed',
    data: updated
  });
});
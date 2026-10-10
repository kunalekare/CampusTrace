import { userRepository } from '../repositories/user.repository.js';
import { reportRepository } from '../repositories/report.repository.js';
import { claimService } from '../services/claim.service.js';
import { auditLogService } from '../services/auditLog.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userRepository.getAll();
  res.json({ success: true, data: users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await userRepository.update(req.params.id, { accountStatus: status });
  await auditLogService.log(req.user.userId, 'USER_STATUS_UPDATED', 'User', req.params.id, { status });
  res.json({ success: true, message: `User status changed to ${status}`, data: user });
});

export const getReports = asyncHandler(async (req, res) => {
  const reports = await reportRepository.findMany({ limit: 100 });
  res.json({ success: true, data: reports });
});

export const getClaims = asyncHandler(async (req, res) => {
  const claims = await claimService.getAllClaims();
  res.json({ success: true, data: claims });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await auditLogService.getLogs();
  res.json({ success: true, data: logs });
});
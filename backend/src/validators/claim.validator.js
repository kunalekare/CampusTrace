import { z } from 'zod';

export const createClaimSchema = z.object({
  reportId: z.number().int().positive('Valid report ID is required'),
  matchId: z.number().int().positive().nullable().optional(),
  verificationEvidence: z.string().min(10, 'Detailed verification evidence is required (serial number, distinctive marks, purchase proof)'),
  evidenceBlobName: z.string().nullable().optional()
});

export const reviewClaimSchema = z.object({
  verificationStatus: z.enum(['APPROVED', 'REJECTED'], { required_error: 'Status must be APPROVED or REJECTED' }),
  adminNotes: z.string().optional()
});
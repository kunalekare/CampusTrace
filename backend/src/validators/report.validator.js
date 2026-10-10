import { z } from 'zod';

export const createReportSchema = z.object({
  reportType: z.enum(['LOST', 'FOUND'], { required_error: 'Report type is required' }),
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  brand: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  location: z.string().min(1, 'Campus location is required'),
  eventDate: z.string().transform(val => {
    if (!val) return new Date().toISOString().split('T')[0];
    const trimmed = val.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parts = trimmed.split(/[/.-]/);
    if (parts.length === 3 && parts[2].length === 4) {
      const y = parts[2];
      const m = parts[0].padStart(2, '0');
      const d = parts[1].padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return trimmed;
  }),
  imageBlobName: z.string().nullable().optional(),
  distinctiveCharacteristics: z.string().nullable().optional(),
  privateVerificationDetails: z.string().nullable().optional(),
  handoverNotes: z.string().nullable().optional(),
  storageLocation: z.string().nullable().optional()
});

export const updateReportSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  brand: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  location: z.string().optional(),
  status: z.enum(['OPEN', 'MATCHED', 'CLAIMED', 'RESOLVED', 'EXPIRED']).optional(),
  distinctiveCharacteristics: z.string().nullable().optional(),
  privateVerificationDetails: z.string().nullable().optional()
});
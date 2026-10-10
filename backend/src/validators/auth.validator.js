import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Valid campus email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'faculty', 'admin']).optional().default('student'),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  studentId: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  department: z.string().optional(),
  phoneNumber: z.string().optional()
});
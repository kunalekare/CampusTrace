import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.userId);
  res.json({
    success: true,
    data: user
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updated = await authService.updateProfile(req.user.userId, req.body);
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updated
  });
});
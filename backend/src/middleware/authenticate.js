import jwt from 'jsonwebtoken';
import { appConfig } from '../config/appConfig.js';
import { ApiError } from '../utils/ApiError.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token required.'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret);
    req.user = decoded; // { userId, email, role, fullName }
    next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}
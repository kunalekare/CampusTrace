import { ApiError } from '../utils/ApiError.js';

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access forbidden. Requires role: ${allowedRoles.join(', ')}`));
    }
    next();
  };
}
import { ApiError } from '../utils/ApiError.js';

export function validateRequest(zodSchema) {
  return (req, res, next) => {
    try {
      req.body = zodSchema.parse(req.body);
      next();
    } catch (err) {
      const errorMessages = err.errors 
        ? err.errors.map(e => `${e.path.join('.') || 'field'}: ${e.message}`) 
        : [err.message];
      const summary = errorMessages.join('; ');
      next(new ApiError(400, `Validation failed: ${summary}`, errorMessages));
    }
  };
}
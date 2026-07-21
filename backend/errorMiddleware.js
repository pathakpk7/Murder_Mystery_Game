/**
 * Centralized Error Handling Middleware
 * Handles all errors consistently across the application
 */

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Supabase errors
  if (err.code) {
    const statusCode = getStatusCodeFromSupabaseError(err.code);
    return res.status(statusCode).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
      details: err.details
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

function getStatusCodeFromSupabaseError(code) {
  const statusMap = {
    'PGRST116': 404, // Not found
    '23505': 409,   // Unique violation
    '23503': 400,   // Foreign key violation
    '42501': 403,   // Insufficient privilege
    'PGRST301': 401, // Unauthorized
    'PGRST204': 204  // No content
  };
  return statusMap[code] || 500;
}

export class ValidationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

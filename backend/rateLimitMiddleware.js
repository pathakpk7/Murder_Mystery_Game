/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 * Compatible with standalone server & serverless environments
 */

import rateLimit from 'express-rate-limit';

// General rate limiter for all API endpoints
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 mins
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

// Stricter rate limit for query validation/execution
export const queryRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 queries per minute
  message: {
    success: false,
    error: 'Too many SQL query execution attempts, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

// Rate limit for write operations (progress saving, user creation, etc.)
export const writeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 write operations per minute
  message: {
    success: false,
    error: 'Too many save operations, please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

export default {
  rateLimiter,
  queryRateLimiter,
  writeRateLimiter
};

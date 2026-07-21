/**
 * Rate Limiting Middleware
 * Protects API endpoints from abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';

// General rate limiter for all endpoints
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limit for query validation (prevents brute force)
export const queryRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 query validations per minute
  message: {
    success: false,
    error: 'Too many query attempts, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limit for write operations (progress saving, etc.)
export const writeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 write operations per minute
  message: {
    success: false,
    error: 'Too many write operations, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
});

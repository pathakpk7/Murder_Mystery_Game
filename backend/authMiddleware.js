import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in .env file. Get it from Supabase Dashboard > Project Settings > API > JWT Secret');
}

/**
 * Authentication Middleware
 * Verifies Supabase JWT token and attaches user info to req.user
 * 
 * Usage: app.get('/api/protected', authenticateToken, (req, res) => { ... })
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied. No token provided.',
      message: 'Please log in to access this resource.'
    });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object
    req.user = {
      id: decoded.sub, // Supabase user ID (UUID)
      email: decoded.email,
      role: decoded.role,
      aud: decoded.aud
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please log in again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Your session is invalid. Please log in again.'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: 'An error occurred while verifying your token.'
    });
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user info if token is present, but doesn't require it
 * Useful for routes that work both authenticated and unauthenticated
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      aud: decoded.aud
    };
    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    req.user = null;
    next();
  }
}

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource.'
      });
    }

    next();
  };
}

/**
 * Helper to extract user ID from request
 * Throws error if user is not authenticated
 */
export function requireUserId(req) {
  if (!req.user || !req.user.id) {
    throw new Error('User not authenticated');
  }
  return req.user.id;
}

export default authenticateToken;

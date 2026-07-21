/**
 * Structured Logging Middleware
 * Provides consistent logging across the application
 */

const logLevels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLogLevel = process.env.NODE_ENV === 'production' ? logLevels.INFO : logLevels.DEBUG;

function log(level, message, meta = {}) {
  if (logLevels[level] < currentLogLevel) return;

  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...meta
  };

  console.log(JSON.stringify(logEntry));
}

export const logger = {
  debug: (message, meta) => log('DEBUG', message, meta),
  info: (message, meta) => log('INFO', message, meta),
  warn: (message, meta) => log('WARN', message, meta),
  error: (message, meta) => log('ERROR', message, meta)
};

// Express middleware for request logging
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  
  next();
}

export default logger;

/**
 * Safe SQL Query Validator
 * 
 * This module validates SQL queries to ensure they are safe for execution.
 * It prevents malicious queries and restricts access to specific tables.
 * 
 * SECURITY RULES:
 * 1. Only SELECT queries are allowed
 * 2. No INSERT, UPDATE, DELETE, DROP, ALTER, etc.
 * 3. Only specific tables are accessible
 * 4. No SQL injection via comments or semicolons
 * 5. Query complexity limits
 */

// Allowed tables for user queries (updated for new schema)
const ALLOWED_TABLES = [
  'suspects',
  'witnesses',
  'forensics',
  'evidence',
  'timeline',
  'game_clues',
  'game_cases',
  'game_objectives'
];

// Forbidden SQL keywords (case-insensitive)
const FORBIDDEN_KEYWORDS = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'ALTER',
  'CREATE',
  'TRUNCATE',
  'GRANT',
  'REVOKE',
  'EXECUTE',
  'EXEC',
  'CALL',
  'COPY',
  'VACUUM',
  'ANALYZE',
  'REINDEX',
  'CLUSTER',
  'COMMENT',
  'SECURITY',
  'OWNER',
  'PASSWORD',
  'SET',
  'RESET',
  'SHOW',
  'BEGIN',
  'COMMIT',
  'ROLLBACK',
  'SAVEPOINT',
  'RELEASE',
  'LOCK',
  'UNLOCK',
  'NOTIFY',
  'LISTEN',
  'PREPARE',
  'DEALLOCATE',
  'DISCARD',
  'LOAD',
  'REFRESH MATERIALIZED VIEW'
];

// Dangerous patterns that could indicate SQL injection
const DANGEROUS_PATTERNS = [
  /--/,                    // SQL comments
  /\/\*/,                  // Multi-line comments start
  /\*\//,                  // Multi-line comments end
  /;/,                     // Multiple statements
  /xp_/i,                  // Extended stored procedures (SQL Server, but block anyway)
  /sp_/i,                  // Stored procedures
  /0x[0-9a-f]+/i,          // Hex encoding
  /char\s*\(/i,            // CHAR() function
  /exec\s*\(/i,            // EXEC() function
  /eval\s*\(/i,            // EVAL() function
  /script\s*:/i,           // Script tags
  /javascript:/i,          // JavaScript protocol
  /onerror\s*=/i,          // Error event handlers
  /onload\s*=/i            // Load event handlers
];

// Whitelist of allowed SQL patterns (in addition to blacklist)
const ALLOWED_PATTERNS = [
  /^SELECT\s+\*?\s+FROM\s+\w+(\s+WHERE\s+.+)?(\s+ORDER\s+BY\s+.+)?(\s+LIMIT\s+\d+)?$/i,
  /^SELECT\s+.+\s+FROM\s+\w+(\s+WHERE\s+.+)?(\s+ORDER\s+BY\s+.+)?(\s+LIMIT\s+\d+)?$/i,
  /^SELECT\s+.+\s+FROM\s+\w+(\s+JOIN\s+\w+\s+ON\s+.+)?(\s+WHERE\s+.+)?$/i
];

/**
 * Validate SQL query for safety
 * 
 * @param {string} query - SQL query to validate
 * @returns {Object} Validation result with isValid and error message
 */
export function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'Query must be a non-empty string'
    };
  }

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toUpperCase();

  // Rule 1: Must start with SELECT
  if (!normalizedQuery.startsWith('SELECT')) {
    return {
      isValid: false,
      error: 'Only SELECT queries are allowed'
    };
  }

  // Rule 2: Check for forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(trimmedQuery)) {
      return {
        isValid: false,
        error: `Forbidden keyword detected: ${keyword}`
      };
    }
  }

  // Rule 3: Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(trimmedQuery)) {
      return {
        isValid: false,
        error: 'Dangerous pattern detected in query'
      };
    }
  }

  // Rule 4: Check for multiple statements (semicolon)
  if (trimmedQuery.includes(';')) {
    return {
      isValid: false,
      error: 'Multiple statements are not allowed'
    };
  }

  // Rule 5: Extract table names and validate against allowed list
  const tableNames = extractTableNames(trimmedQuery);
  for (const tableName of tableNames) {
    if (!ALLOWED_TABLES.includes(tableName.toLowerCase())) {
      return {
        isValid: false,
        error: `Access to table '${tableName}' is not allowed. Allowed tables: ${ALLOWED_TABLES.join(', ')}`
      };
    }
  }

  // Rule 6: Query complexity limits
  if (trimmedQuery.length > 1000) {
    return {
      isValid: false,
      error: 'Query is too long (max 1000 characters)'
    };
  }

  // Rule 7: Check for subqueries (limit depth)
  const subqueryDepth = countSubqueries(trimmedQuery);
  if (subqueryDepth > 2) {
    return {
      isValid: false,
      error: 'Subquery depth too deep (max 2 levels)'
    };
  }

  // Rule 8: Check for UNION (could be used for data extraction)
  if (/\bUNION\b/i.test(trimmedQuery)) {
    return {
      isValid: false,
      error: 'UNION queries are not allowed'
    };
  }

  // Rule 9: Check against whitelist patterns (additional security layer)
  let patternMatched = false;
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(trimmedQuery)) {
      patternMatched = true;
      break;
    }
  }
  
  if (!patternMatched) {
    return {
      isValid: false,
      error: 'Query does not match allowed patterns. Only simple SELECT queries with WHERE, ORDER BY, and LIMIT are allowed.'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Extract table names from SQL query
 * 
 * @param {string} query - SQL query
 * @returns {Array<string>} Array of table names
 */
function extractTableNames(query) {
  const tables = [];
  
  // Match FROM and JOIN clauses
  const fromRegex = /\bFROM\s+(\w+)/gi;
  const joinRegex = /\b(?:JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN)\s+(\w+)/gi;
  
  let match;
  
  while ((match = fromRegex.exec(query)) !== null) {
    tables.push(match[1]);
  }
  
  while ((match = joinRegex.exec(query)) !== null) {
    tables.push(match[1]);
  }
  
  return [...new Set(tables)]; // Remove duplicates
}

/**
 * Count subquery depth in query
 * 
 * @param {string} query - SQL query
 * @returns {number} Maximum subquery depth
 */
function countSubqueries(query) {
  let depth = 0;
  let maxDepth = 0;
  let inParentheses = 0;
  
  for (let i = 0; i < query.length; i++) {
    if (query[i] === '(') {
      inParentheses++;
      if (inParentheses > depth) {
        depth = inParentheses;
        maxDepth = Math.max(maxDepth, depth);
      }
    } else if (query[i] === ')') {
      inParentheses--;
    }
  }
  
  return maxDepth;
}

/**
 * Sanitize query by removing extra whitespace
 * 
 * @param {string} query - SQL query
 * @returns {string} Sanitized query
 */
export function sanitizeQuery(query) {
  return query
    .trim()
    .replace(/\s+/g, ' ')  // Collapse multiple spaces
    .replace(/\n/g, ' ')    // Remove newlines
    .replace(/\t/g, ' ')    // Remove tabs
    .trim();
}

/**
 * Get allowed tables list
 * 
 * @returns {Array<string>} Array of allowed table names
 */
export function getAllowedTables() {
  return [...ALLOWED_TABLES];
}

/**
 * Check if a table is allowed
 * 
 * @param {string} tableName - Table name to check
 * @returns {boolean} True if table is allowed
 */
export function isTableAllowed(tableName) {
  return ALLOWED_TABLES.includes(tableName.toLowerCase());
}

export default {
  validateQuery,
  sanitizeQuery,
  getAllowedTables,
  isTableAllowed
};

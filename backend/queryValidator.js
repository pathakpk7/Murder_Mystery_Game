/**
 * Safe SQL Query Validator
 * PROJECT VRITRA — SQL Detective Thriller
 * 
 * SECURITY RULES:
 * 1. Only SELECT queries are allowed
 * 2. No INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, etc.
 * 3. Only allowlisted game tables are accessible
 * 4. No SQL injection via comments or multiple statements (semicolons)
 * 5. Query complexity and subquery limits
 */

// Allowlisted tables for user SQL queries
const ALLOWED_TABLES = [
  'suspects',
  'witnesses',
  'forensics',
  'evidence',
  'timeline',
  'game_clues',
  'game_cases',
  'game_objectives',
  'evidence_locker',
  'characters',
  'case_characters'
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

// Dangerous injection patterns
const DANGEROUS_PATTERNS = [
  /--/,                    // SQL line comments
  /\/\*/,                  // Multi-line comment start
  /\*\//,                  // Multi-line comment end
  /xp_/i,                  // Extended stored procedures
  /sp_/i,                  // Stored procedures
  /0x[0-9a-f]+/i,          // Hex literals
  /exec\s*\(/i,            // EXEC() function
  /eval\s*\(/i,            // EVAL() function
  /script\s*:/i,           // Script protocols
  /javascript:/i,          // JS protocol
  /onerror\s*=/i,          // HTML event handlers
  /onload\s*=/i
];

/**
 * Validate SQL query for safety and game compatibility
 * 
 * @param {string} query - SQL query to validate
 * @returns {Object} Validation result with isValid (boolean) and error message
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
      error: 'Only SELECT queries are allowed in Project Vritra'
    };
  }

  // Rule 2: Check for multiple statements (semicolon) - allow trailing semicolon
  const queryWithoutTrailingSemicolon = trimmedQuery.replace(/;\s*$/, '');
  if (queryWithoutTrailingSemicolon.includes(';')) {
    return {
      isValid: false,
      error: 'Multiple SQL statements are not allowed'
    };
  }

  // Rule 3: Check for forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(queryWithoutTrailingSemicolon)) {
      return {
        isValid: false,
        error: `Forbidden SQL operation detected: ${keyword}`
      };
    }
  }

  // Rule 4: Check for dangerous injection patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(queryWithoutTrailingSemicolon)) {
      return {
        isValid: false,
        error: 'Security error: Dangerous pattern detected in query'
      };
    }
  }

  // Rule 5: Check for UNION operations
  if (/\bUNION\b/i.test(queryWithoutTrailingSemicolon)) {
    return {
      isValid: false,
      error: 'UNION queries are not allowed'
    };
  }

  // Rule 6: Extract table names and validate against allowlist
  const tableNames = extractTableNames(queryWithoutTrailingSemicolon);
  if (tableNames.length === 0) {
    return {
      isValid: false,
      error: 'Invalid SQL syntax: Missing target FROM table clause'
    };
  }

  for (const tableName of tableNames) {
    if (!ALLOWED_TABLES.includes(tableName.toLowerCase())) {
      return {
        isValid: false,
        error: `Access to table '${tableName}' is denied. Allowlisted tables: ${ALLOWED_TABLES.join(', ')}`
      };
    }
  }

  // Rule 7: Length and complexity limits
  if (trimmedQuery.length > 1500) {
    return {
      isValid: false,
      error: 'Query length exceeds maximum limit (1500 characters)'
    };
  }

  const subqueryDepth = countSubqueries(queryWithoutTrailingSemicolon);
  if (subqueryDepth > 2) {
    return {
      isValid: false,
      error: 'Subquery depth exceeds limit (max 2 levels allowed)'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Extract table names from FROM and JOIN clauses safely
 */

function extractTableNames(query) {
  const tables = [];
  
  const fromRegex = /\bFROM\s+([a-zA-Z0-9_]+)/gi;
  const joinRegex = /\b(?:JOIN|INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN)\s+([a-zA-Z0-9_]+)/gi;
  
  let match;
  
  while ((match = fromRegex.exec(query)) !== null) {
    tables.push(match[1]);
  }
  
  while ((match = joinRegex.exec(query)) !== null) {
    tables.push(match[1]);
  }
  
  return [...new Set(tables)];
}

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

export function sanitizeQuery(query) {
  return query
    .trim()
    .replace(/;\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAllowedTables() {
  return [...ALLOWED_TABLES];
}

export function isTableAllowed(tableName) {
  return ALLOWED_TABLES.includes(tableName.toLowerCase());
}

export default {
  validateQuery,
  sanitizeQuery,
  getAllowedTables,
  isTableAllowed
};

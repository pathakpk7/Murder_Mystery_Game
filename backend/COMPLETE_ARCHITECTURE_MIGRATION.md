# SQL Detective Game - Complete Backend Architecture Migration
## Supabase-Only Architecture for Production-Grade Detective Game

---

## SECTION 1: Current Architecture Analysis

### 1.1 Technology Stack

**Frontend:**
- HTML/CSS/JavaScript (vanilla)
- No framework (intentional for simplicity)
- Direct API calls to Express backend

**Backend:**
- Express.js (Node.js)
- Mixed database access pattern
- Port: 5433

**Database:**
- Supabase (PostgreSQL hosting)
- Two connection methods:
  1. Supabase Client (`@supabase/supabase-js`) - WORKING
  2. Direct PostgreSQL (`pg` library) - BROKEN

**Authentication:**
- Supabase Auth (JWT-based)
- Working correctly

### 1.2 Current File Structure

```
backend/
├── app.js                    # Express server, uses Supabase client ✅
├── db.js                     # Direct PostgreSQL pool ❌
├── gameEngine.js             # Game logic, uses db.js ❌
├── supabaseClient.js         # Supabase client initialization ✅
├── authMiddleware.js         # JWT validation ✅
├── queryValidator.js         # SQL validation logic
├── init-db.js                # Direct PostgreSQL schema init ❌
├── init-supabase.js          # Supabase data population ✅
├── start.js                  # Server startup script
├── package.json              # Dependencies
├── .env                      # Environment variables
└── .env.example              # Environment template

database/
├── core_schema.sql           # Full PostgreSQL schema (336 lines)
├── supabase_setup.sql        # Simplified Supabase schema
├── easy/                     # Easy case data
├── medium/                   # Medium case data
├── hard/                     # Hard case data
└── expert/                   # Expert case data
```

### 1.3 Database Access Pattern Analysis

**Dual Database Access Pattern (THE PROBLEM):**

**Path A: Supabase Client (Working)**
```
app.js → supabaseClient.js → @supabase/supabase-js → Supabase API → PostgreSQL
```
- Used in: `app.js` (all API endpoints)
- Connection: HTTPS API
- Status: ✅ Working
- DNS: Not required (uses HTTPS)

**Path B: Direct PostgreSQL (Broken)**
```
gameEngine.js → db.js → pg library → DATABASE_URL → PostgreSQL
```
- Used in: `gameEngine.js`, `init-db.js`
- Connection: Direct TCP
- Status: ❌ DNS Error
- DNS: Required (fails: `getaddrinfo ENOTFOUND db.xxqrkcqplbdhutrxceqe.supabase.co`)

### 1.4 Current API Endpoints

**Working Endpoints (Supabase Client):**
- `GET /` - Health check
- `GET /api/health` - Database connection check
- `GET /api/cases` - Get all cases
- `GET /api/cases/:id` - Get single case
- `GET /api/cases/:id/objectives` - Get case objectives
- `GET /api/cases/:id/clues` - Get case clues

**Missing Endpoints (Not Implemented):**
- `POST /api/cases/:id/start` - Start a case
- `POST /api/query/validate` - Validate SQL query
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Save progress
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/profile/:userId` - Get player profile
- `POST /api/hint/request` - Request hint
- `GET /api/achievements/:userId` - Get achievements

### 1.5 Current Game Flow

**Intended Flow:**
1. User authenticates via Supabase Auth
2. User selects a case from `/api/cases`
3. User starts case (not implemented)
4. User sees objectives for the case
5. User writes SQL queries to solve objectives
6. Query is validated against expected result
7. If correct, objective is marked complete
8. Clues are unlocked
9. Progress is saved
10. User advances to next objective
11. Case completion when all objectives done

**Current Broken Flow:**
- Steps 3-11 are broken because `gameEngine.js` cannot function
- `gameEngine.js` depends on `db.js` which is broken
- No query validation endpoint exists
- No progress saving endpoint exists

### 1.6 Current Dependencies

**package.json:**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.106.2",  ✅ Keep
    "cors": "^2.8.5",                      ✅ Keep
    "dotenv": "^16.4.5",                    ✅ Keep
    "express": "^4.18.2",                  ✅ Keep
    "jsonwebtoken": "^9.0.2",              ✅ Keep
    "pg": "^8.11.3"                        ❌ REMOVE
  }
}
```

### 1.7 Environment Variables

**Current .env:**
```
SUPABASE_URL=https://xxqrkcqplbdhutrxceqe.supabase.co  ✅ Keep
SUPABASE_ANON_KEY=eyJhbGci...                    ✅ Keep
SUPABASE_SERVICE_KEY=eyJhbGci...                  ✅ Keep
DATABASE_URL=postgresql://postgres:...@db.xxqrkcqplbdhutrxceqe.supabase.co:5432/postgres  ❌ REMOVE
PORT=5433                                          ✅ Keep
```

---

## SECTION 2: Problems and Bottlenecks

### 2.1 Critical Problems

**Problem 1: DNS Resolution Failure**
- **Issue**: Direct PostgreSQL hostname `db.xxqrkcqplbdhutrxceqe.supabase.co` cannot be resolved
- **Error**: `getaddrinfo ENOTFOUND db.xxqrkcqplbdhutrxceqe.supabase.co`
- **Impact**: All direct PostgreSQL connections fail
- **Root Cause**: Network/firewall blocking DNS resolution for PostgreSQL subdomain
- **Workaround**: Use Supabase API (HTTPS) instead of direct TCP connection

**Problem 2: Mixed Database Architecture**
- **Issue**: Two different database access patterns in same codebase
- **Impact**: Inconsistent data access, maintenance nightmare
- **Files Affected**: `app.js` (Supabase), `gameEngine.js` (PostgreSQL)
- **Root Cause**: Gradual migration left incomplete

**Problem 3: No Database Tables**
- **Issue**: Tables don't exist in Supabase yet
- **Impact**: API returns empty data (`count: 0`)
- **Root Cause**: Schema initialization requires direct PostgreSQL connection
- **Status**: `core_schema.sql` cannot be executed

**Problem 4: Broken Game Engine**
- **Issue**: `gameEngine.js` completely non-functional
- **Impact**: No game logic, no query validation, no progress tracking
- **Root Cause**: Depends on `db.js` which is broken
- **Functions Broken**: `startCase`, `completeObjective`, `validateQuery`, etc.

### 2.2 Security Bottlenecks

**Bottleneck 1: No SQL Sandbox**
- **Issue**: Players can potentially run arbitrary SQL
- **Risk**: Data deletion, unauthorized access, system table access
- **Current Status**: No validation implemented
- **Required**: Whitelist-based SQL validation

**Bottleneck 2: Missing RLS Policies**
- **Issue**: No Row Level Security policies defined
- **Risk**: Users can access other users' data
- **Current Status**: Tables don't exist yet
- **Required**: Comprehensive RLS policies

**Bottleneck 3: No Rate Limiting**
- **Issue**: No API rate limiting
- **Risk**: DDoS attacks, abuse
- **Current Status**: Not implemented
- **Required**: Rate limiting middleware

### 2.3 Scalability Bottlenecks

**Bottleneck 1: No Caching**
- **Issue**: Every request hits database
- **Impact**: Slow response times, high database load
- **Current Status**: No caching layer
- **Required**: Redis or Supabase Edge Functions

**Bottleneck 2: No Connection Pooling**
- **Issue**: Direct PostgreSQL connection pool not working
- **Impact**: Connection exhaustion under load
- **Current Status**: Broken
- **Required**: Supabase handles pooling automatically

**Bottleneck 3: No Pagination**
- **Issue**: No pagination on list endpoints
- **Impact**: Large datasets will crash server
- **Current Status**: Not implemented
- **Required**: Pagination on all list endpoints

### 2.4 Development Bottlenecks

**Bottleneck 1: No Error Handling**
- **Issue**: Inconsistent error handling across endpoints
- **Impact**: Poor debugging experience
- **Current Status**: Basic try-catch only
- **Required**: Centralized error handling middleware

**Bottleneck 2: No Logging**
- **Issue**: No structured logging
- **Impact**: Difficult to debug production issues
- **Current Status**: Console.log only
- **Required**: Winston or Pino logging

**Bottleneck 3: No Testing**
- **Issue**: No unit tests, no integration tests
- **Impact**: Refactoring is dangerous
- **Current Status**: No tests
- **Required**: Jest + Supabase test utilities

### 2.5 Feature Bottlenecks

**Bottleneck 1: Missing Leaderboard**
- **Issue**: No leaderboard system
- **Impact**: No competitive aspect
- **Current Status**: Not implemented
- **Required**: Leaderboard table + API

**Bottleneck 2: Missing Achievements**
- **Issue**: No achievement system
- **Impact**: Reduced engagement
- **Current Status**: Not implemented
- **Required**: Achievements table + API

**Bottleneck 3: Missing Multiplayer**
- **Issue**: No multiplayer features
- **Impact**: Limited social interaction
- **Current Status**: Not implemented
- **Required**: Real-time features (Supabase Realtime)

---

## SECTION 3: New Supabase-Only Architecture

### 3.1 Architecture Principles

**Principle 1: Single Database Access Pattern**
- All database operations via Supabase client
- No direct PostgreSQL connections
- Consistent API across entire codebase

**Principle 2: Security-First Design**
- Row Level Security (RLS) on all tables
- SQL whitelist validation for player queries
- Service role key for admin operations
- Anon key for client operations

**Principle 3: Scalability by Design**
- Supabase handles connection pooling
- Edge Functions for compute-intensive operations
- Realtime for multiplayer features
- CDN for static assets

**Principle 4: Developer Experience**
- Type-safe database queries (TypeScript)
- Centralized error handling
- Structured logging
- Comprehensive testing

### 3.2 New Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  (HTML/CSS/JavaScript)                                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS BACKEND                             │
│  (Port 5433)                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer                                               │  │
│  │  ├─ /api/cases                                          │  │
│  │  ├─ /api/cases/:id                                      │  │
│  │  ├─ /api/cases/:id/objectives                           │  │
│  │  ├─ /api/cases/:id/clues                                │  │
│  │  ├─ /api/cases/:id/start                                │  │
│  │  ├─ /api/query/validate                                 │  │
│  │  ├─ /api/progress/:userId                               │  │
│  │  ├─ /api/leaderboard                                    │  │
│  │  ├─ /api/profile/:userId                                │  │
│  │  └─ /api/achievements/:userId                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                        │  │
│  │  ├─ CORS                                                 │  │
│  │  ├─ JSON Parser                                          │  │
│  │  ├─ Auth Middleware (JWT)                                │  │
│  │  ├─ Rate Limiting                                        │  │
│  │  ├─ Error Handling                                      │  │
│  │  └─ Request Logging                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                    │  │
│  │  ├─ gameEngine.js (Supabase version)                    │  │
│  │  ├─ queryValidator.js (Enhanced)                        │  │
│  │  ├─ progressManager.js (New)                             │  │
│  │  ├─ leaderboardManager.js (New)                          │  │
│  │  └─ achievementManager.js (New)                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLIENT LAYER                         │
│  (@supabase/supabase-js)                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  supabaseClient.js                                        │  │
│  │  ├─ Anon Client (for user operations)                    │  │
│  │  └─ Service Role Client (for admin operations)           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE PLATFORM                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Database (PostgreSQL)                                  │  │
│  │  ├─ users                                               │  │
│  │  ├─ player_progress                                     │  │
│  │  ├─ query_logs                                          │  │
│  │  ├─ game_cases                                          │  │
│  │  ├─ game_objectives                                      │  │
│  │  ├─ game_clues                                           │  │
│  │  ├─ leaderboard                                         │  │
│  │  └─ achievements                                         │  │
│  │  (All with RLS policies)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Authentication (Supabase Auth)                          │  │
│  │  ├─ JWT Validation                                       │  │
│  │  ├─ User Management                                      │  │
│  │  └─ Session Management                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Realtime (for future multiplayer)                       │  │
│  │  └─ WebSocket connections                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Data Flow Architecture

**Read Operations (Player):**
```
Frontend → Express API → Supabase Anon Client → Supabase API → PostgreSQL
                                              ↓
                                         RLS Policy Check
                                              ↓
                                         Return Data
```

**Write Operations (Player):**
```
Frontend → Express API → Supabase Anon Client → Supabase API → PostgreSQL
                                              ↓
                                         RLS Policy Check
                                              ↓
                                         Write Data
```

**Admin Operations (Server):**
```
Express API → Supabase Service Client → Supabase API → PostgreSQL
                                          ↓
                                     Bypass RLS
                                          ↓
                                     Full Access
```

**SQL Query Validation:**
```
Frontend → Express API → queryValidator.js → SQL Whitelist Check
                                              ↓
                                         Execute Query
                                              ↓
                                         Compare Results
                                              ↓
                                         Return Validation
```

### 3.4 Security Architecture

**Layer 1: Network Security**
- HTTPS only (Supabase enforces)
- CORS configured for frontend domain
- Rate limiting on API endpoints

**Layer 2: Authentication**
- Supabase Auth (JWT-based)
- Token validation on protected routes
- Automatic token refresh

**Layer 3: Authorization (RLS)**
- Users can only read their own data
- Users can only write their own data
- Public read access for game content (cases, objectives, clues)
- Service role bypasses RLS for admin operations

**Layer 4: SQL Security**
- Whitelist-based SQL validation
- Blacklist dangerous keywords (DROP, DELETE, UPDATE, etc.)
- Query result comparison (not execution)
- Sandboxed query execution environment

**Layer 5: Data Validation**
- Input validation on all endpoints
- Type checking with Joi or Zod
- SQL injection prevention (parameterized queries)

### 3.5 Scalability Architecture

**Horizontal Scaling:**
- Express backend can be scaled horizontally
- Supabase handles database scaling automatically
- Stateless design enables easy scaling

**Vertical Scaling:**
- Supabase Edge Functions for compute-intensive operations
- Database indexing for fast queries
- Connection pooling handled by Supabase

**Caching Strategy:**
- Cache game content (cases, objectives, clues) - rarely changes
- Cache leaderboard - updates periodically
- No cache for user progress - must be real-time

**Database Optimization:**
- Indexes on foreign keys
- Indexes on frequently queried columns
- Materialized views for complex queries
- Partitioning for large tables (future)

### 3.6 New File Structure

```
backend/
├── app.js                          # Express server (enhanced)
├── supabaseClient.js               # Supabase client initialization
├── authMiddleware.js               # JWT validation (enhanced)
├── errorMiddleware.js              # Centralized error handling (NEW)
├── rateLimitMiddleware.js          # Rate limiting (NEW)
├── logger.js                       # Structured logging (NEW)
│
├── services/                       # Business logic layer (NEW)
│   ├── gameEngine.js              # Game logic (Supabase version)
│   ├── queryValidator.js          # SQL validation (enhanced)
│   ├── progressManager.js         # Progress tracking (NEW)
│   ├── leaderboardManager.js      # Leaderboard logic (NEW)
│   └── achievementManager.js      # Achievement logic (NEW)
│
├── routes/                         # API routes (NEW)
│   ├── cases.js                   # Case-related routes
│   ├── progress.js                # Progress-related routes
│   ├── query.js                   # Query validation routes
│   ├── leaderboard.js             # Leaderboard routes
│   ├── profile.js                 # Profile routes
│   └── achievements.js            # Achievement routes
│
├── validators/                    # Input validation (NEW)
│   ├── caseValidator.js           # Case input validation
│   ├── queryValidator.js          # Query input validation
│   └── progressValidator.js       # Progress input validation
│
├── utils/                         # Utility functions (NEW)
│   ├── sqlParser.js              # SQL parsing utilities
│   ├── responseHelper.js         # Response formatting
│   └── errorHelper.js            # Error formatting
│
├── config/                        # Configuration (NEW)
│   ├── supabase.config.js        # Supabase configuration
│   └── server.config.js           # Server configuration
│
├── tests/                         # Tests (NEW)
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── e2e/                      # End-to-end tests
│
├── start.js                       # Server startup script
├── package.json                   # Dependencies (updated)
├── .env                           # Environment variables (cleaned)
└── .env.example                   # Environment template (updated)

database/
├── migrations/                    # Supabase migrations (NEW)
│   ├── 001_initial_schema.sql    # Initial schema
│   ├── 002_rls_policies.sql       # RLS policies
│   ├── 003_seed_data.sql          # Seed data
│   └── 004_indexes.sql            # Performance indexes
│
├── supabase_setup.sql            # Complete setup script
├── init-supabase.js              # Data population script
│
├── easy/                          # Easy case data
├── medium/                        # Medium case data
├── hard/                          # Hard case data
└── expert/                        # Expert case data
```

---

## SECTION 4: Required File Changes

### 4.1 Files to Delete

**Direct PostgreSQL Dependencies:**
- ❌ `db.js` - Direct PostgreSQL connection pool
- ❌ `init-db.js` - Direct PostgreSQL schema initialization

**Obsolete Files:**
- ❌ `MIGRATION_PLAN.md` - Old migration plan (will be replaced by this document)

### 4.2 Files to Modify

**Backend Core:**
- 🔧 `app.js` - Restructure with new route organization
- 🔧 `supabaseClient.js` - Add service role client
- 🔧 `authMiddleware.js` - Enhanced error handling
- 🔧 `package.json` - Remove `pg` dependency
- 🔧 `.env` - Remove `DATABASE_URL`
- 🔧 `.env.example` - Remove `DATABASE_URL`

**Game Logic:**
- 🔧 `gameEngine.js` - Complete rewrite to use Supabase
- 🔧 `queryValidator.js` - Enhanced SQL validation

**Database:**
- 🔧 `database/supabase_setup.sql` - Complete schema with all tables
- 🔧 `database/init-supabase.js` - Enhanced data population

### 4.3 Files to Create

**Middleware:**
- ✨ `errorMiddleware.js` - Centralized error handling
- ✨ `rateLimitMiddleware.js` - Rate limiting
- ✨ `logger.js` - Structured logging

**Services:**
- ✨ `services/progressManager.js` - Progress tracking logic
- ✨ `services/leaderboardManager.js` - Leaderboard logic
- ✨ `services/achievementManager.js` - Achievement logic

**Routes:**
- ✨ `routes/cases.js` - Case-related routes
- ✨ `routes/progress.js` - Progress-related routes
- ✨ `routes/query.js` - Query validation routes
- ✨ `routes/leaderboard.js` - Leaderboard routes
- ✨ `routes/profile.js` - Profile routes
- ✨ `routes/achievements.js` - Achievement routes

**Validators:**
- ✨ `validators/caseValidator.js` - Case input validation
- ✨ `validators/queryValidator.js` - Query input validation
- ✨ `validators/progressValidator.js` - Progress input validation

**Utilities:**
- ✨ `utils/sqlParser.js` - SQL parsing utilities
- ✨ `utils/responseHelper.js` - Response formatting
- ✨ `utils/errorHelper.js` - Error formatting

**Configuration:**
- ✨ `config/supabase.config.js` - Supabase configuration
- ✨ `config/server.config.js` - Server configuration

**Database Migrations:**
- ✨ `database/migrations/001_initial_schema.sql` - Initial schema
- ✨ `database/migrations/002_rls_policies.sql` - RLS policies
- ✨ `database/migrations/003_seed_data.sql` - Seed data
- ✨ `database/migrations/004_indexes.sql` - Performance indexes

**Tests:**
- ✨ `tests/unit/gameEngine.test.js` - Game engine unit tests
- ✨ `tests/integration/api.test.js` - API integration tests
- ✨ `tests/e2e/gameFlow.test.js` - End-to-end game flow tests

---

## SECTION 5: Required Code Changes

### 5.1 gameEngine.js Conversion

**Current (Direct PostgreSQL):**
```javascript
import { getOne, getAll, execute, transaction } from './db.js';

export async function getAllCases() {
  return getAll(
    'SELECT id, title, description, difficulty, estimated_duration_minutes, is_active FROM game_cases WHERE is_active = true ORDER BY id'
  );
}
```

**New (Supabase Client):**
```javascript
import supabase from './supabaseClient.js';

export async function getAllCases() {
  const { data, error } = await supabase
    .from('game_cases')
    .select('id, title, description, difficulty, estimated_duration_minutes, is_active')
    .eq('is_active', true)
    .order('id');
  
  if (error) throw error;
  return data;
}
```

**Conversion Mapping:**

| Direct PostgreSQL | Supabase Client |
|-------------------|-----------------|
| `getOne(sql, params)` | `supabase.from(table).select('*').eq(column, value).single()` |
| `getAll(sql, params)` | `supabase.from(table).select('*').eq(column, value)` |
| `execute(sql, params)` | `supabase.from(table).insert(data)` or `.update(data)` |
| `transaction(callback)` | Use multiple Supabase calls sequentially (Supabase handles transactions internally) |

### 5.2 Complete gameEngine.js Rewrite

**Key Functions to Convert:**

1. **getAllCases()** - Simple SELECT
2. **getCaseById(caseId)** - SELECT with WHERE
3. **startCase(userId, caseId)** - INSERT with upsert
4. **getCurrentObjective(userId, caseId)** - JOIN query
5. **getCaseObjectives(caseId)** - SELECT with ORDER BY
6. **completeObjective(userId, objectiveId)** - UPDATE with transaction
7. **validateQuery(userId, objectiveId, query, result)** - Validation logic
8. **executeGameFlow(...)** - Complex orchestration

**Transaction Handling:**
- Supabase doesn't expose explicit transaction API like PostgreSQL
- Use sequential operations with error handling
- For complex transactions, use Supabase RPC (Remote Procedure Call)
- Create PostgreSQL functions in Supabase SQL Editor for complex operations

### 5.3 app.js Restructuring

**Current Structure:**
```javascript
// All routes in app.js
app.get('/api/cases', ...);
app.get('/api/cases/:id', ...);
// etc.
```

**New Structure:**
```javascript
// app.js - Main server file
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorMiddleware.js';
import { rateLimiter } from './middleware/rateLimitMiddleware.js';
import { logger } from './logger.js';

// Route imports
import caseRoutes from './routes/cases.js';
import progressRoutes from './routes/progress.js';
import queryRoutes from './routes/query.js';
import leaderboardRoutes from './routes/leaderboard.js';
import profileRoutes from './routes/profile.js';
import achievementRoutes from './routes/achievements.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(logger);

// Routes
app.use('/api/cases', caseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/achievements', achievementRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

### 5.4 New Route Structure

**routes/cases.js:**
```javascript
import express from 'express';
import { getAllCases, getCaseById } from '../services/gameEngine.js';
import { validateCaseId } from '../validators/caseValidator.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const cases = await getAllCases();
    res.json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validateCaseId, async (req, res, next) => {
  try {
    const caseData = await getCaseById(req.params.id);
    res.json({ success: true, data: caseData });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### 5.5 SQL Validation Enhancement

**Current queryValidator.js:**
- Basic SQL validation
- No whitelist
- No sandboxing

**New queryValidator.js:**
```javascript
// Whitelist of allowed SQL patterns
const ALLOWED_PATTERNS = [
  /^SELECT\s+\*?\s+FROM\s+\w+(\s+WHERE\s+.+)?(\s+ORDER\s+BY\s+.+)?(\s+LIMIT\s+\d+)?$/i,
  /^SELECT\s+.+\s+FROM\s+\w+(\s+WHERE\s+.+)?(\s+ORDER\s+BY\s+.+)?(\s+LIMIT\s+\d+)?$/i
];

// Blacklist of dangerous keywords
const BLACKLISTED_KEYWORDS = [
  'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE',
  'TRUNCATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE'
];

export function validateSQL(query) {
  // Check for blacklisted keywords
  const upperQuery = query.toUpperCase();
  for (const keyword of BLACKLISTED_KEYWORDS) {
    if (upperQuery.includes(keyword)) {
      return { valid: false, reason: `Dangerous keyword: ${keyword}` };
    }
  }
  
  // Check against whitelist
  for (const pattern of ALLOWED_PATTERNS) {
    if (pattern.test(query)) {
      return { valid: true };
    }
  }
  
  return { valid: false, reason: 'Query does not match allowed patterns' };
}
```

### 5.6 Supabase Client Enhancement

**Current supabaseClient.js:**
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;
```

**New supabaseClient.js:**
```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Anon client for user operations
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default supabase;
```

### 5.7 Error Middleware

**New errorMiddleware.js:**
```javascript
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
    '42501': 403    // Insufficient privilege
  };
  return statusMap[code] || 500;
}
```

### 5.8 Rate Limiting Middleware

**New rateLimitMiddleware.js:**
```javascript
import rateLimit from 'express-rate-limit';

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

// Stricter rate limit for query validation
export const queryRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 query validations per minute
  message: {
    success: false,
    error: 'Too many query attempts, please slow down'
  }
});
```

---

## SECTION 6: Database Schema Changes

### 6.1 Complete Supabase Schema

**Table: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  avatar_url TEXT,
  total_score INTEGER DEFAULT 0,
  cases_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: game_cases**
```sql
CREATE TABLE game_cases (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  estimated_duration_minutes INTEGER DEFAULT 30,
  mythology_theme TEXT, -- Indian mythology theme
  story_background TEXT, -- Story context
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: game_objectives**
```sql
CREATE TABLE game_objectives (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  expected_query TEXT NOT NULL,
  expected_result JSONB,
  hint TEXT,
  hint_threshold INTEGER DEFAULT 3,
  order_index INTEGER NOT NULL,
  points INTEGER DEFAULT 100,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: game_clues**
```sql
CREATE TABLE game_clues (
  id SERIAL PRIMARY KEY,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  objective_id INTEGER REFERENCES game_objectives(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  clue_type TEXT DEFAULT 'information' CHECK (clue_type IN ('information', 'evidence', 'hint')),
  icon TEXT DEFAULT '💡',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: player_progress**
```sql
CREATE TABLE player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,
  current_objective_id INTEGER REFERENCES game_objectives(id),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, case_id)
);
```

**Table: objective_progress**
```sql
CREATE TABLE objective_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective_id INTEGER NOT NULL REFERENCES game_objectives(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_taken_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, objective_id)
);
```

**Table: query_logs**
```sql
CREATE TABLE query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  objective_id INTEGER NOT NULL REFERENCES game_objectives(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  was_successful BOOLEAN DEFAULT false,
  execution_time_ms INTEGER,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: leaderboard**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id INTEGER REFERENCES game_cases(id) ON DELETE SET NULL,
  score INTEGER NOT NULL,
  completion_time_seconds INTEGER,
  rank INTEGER,
  period TEXT DEFAULT 'all_time' CHECK (period IN ('daily', 'weekly', 'monthly', 'all_time')),
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, case_id, period)
);
```

**Table: achievements**
```sql
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '🏆',
  requirement TEXT NOT NULL,
  points INTEGER DEFAULT 50,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'speed', 'accuracy', 'explorer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Table: user_achievements**
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_id)
);
```

### 6.2 Row Level Security Policies

**Policy: users**
```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Service role can insert users
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);
```

**Policy: game_cases (Public Read)**
```sql
-- Everyone can read active cases
CREATE POLICY "Public read access for game_cases" ON game_cases
  FOR SELECT USING (is_active = true);

-- Service role can manage cases
CREATE POLICY "Service role can manage game_cases" ON game_cases
  FOR ALL USING (auth.role() = 'service_role');
```

**Policy: game_objectives (Public Read)**
```sql
-- Everyone can read objectives
CREATE POLICY "Public read access for game_objectives" ON game_objectives
  FOR SELECT USING (true);

-- Service role can manage objectives
CREATE POLICY "Service role can manage game_objectives" ON game_objectives
  FOR ALL USING (auth.role() = 'service_role');
```

**Policy: game_clues (Public Read)**
```sql
-- Everyone can read clues
CREATE POLICY "Public read access for game_clues" ON game_clues
  FOR SELECT USING (true);

-- Service role can manage clues
CREATE POLICY "Service role can manage game_clues" ON game_clues
  FOR ALL USING (auth.role() = 'service_role');
```

**Policy: player_progress (User Isolation)**
```sql
-- Users can read their own progress
CREATE POLICY "Users can read own progress" ON player_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress" ON player_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress" ON player_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

**Policy: objective_progress (User Isolation)**
```sql
-- Users can read their own objective progress
CREATE POLICY "Users can read own objective progress" ON objective_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own objective progress
CREATE POLICY "Users can insert own objective progress" ON objective_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own objective progress
CREATE POLICY "Users can update own objective progress" ON objective_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

**Policy: query_logs (User Isolation)**
```sql
-- Users can read their own query logs
CREATE POLICY "Users can read own query logs" ON query_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own query logs
CREATE POLICY "Users can insert own query logs" ON query_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Policy: leaderboard (Public Read)**
```sql
-- Everyone can read leaderboard
CREATE POLICY "Public read access for leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Service role can manage leaderboard
CREATE POLICY "Service role can manage leaderboard" ON leaderboard
  FOR ALL USING (auth.role() = 'service_role');
```

**Policy: achievements (Public Read)**
```sql
-- Everyone can read achievements
CREATE POLICY "Public read access for achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- Service role can manage achievements
CREATE POLICY "Service role can manage achievements" ON achievements
  FOR ALL USING (auth.role() = 'service_role');
```

**Policy: user_achievements (User Isolation)**
```sql
-- Users can read their own achievements
CREATE POLICY "Users can read own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own achievements
CREATE POLICY "Users can insert own achievements" ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 6.3 Performance Indexes

```sql
-- Indexes for faster queries
CREATE INDEX idx_game_objectives_case_id ON game_objectives(case_id);
CREATE INDEX idx_game_objectives_order ON game_objectives(case_id, order_index);
CREATE INDEX idx_player_progress_user_case ON player_progress(user_id, case_id);
CREATE INDEX idx_player_progress_status ON player_progress(status);
CREATE INDEX idx_objective_progress_user_objective ON objective_progress(user_id, objective_id);
CREATE INDEX idx_game_clues_case_id ON game_clues(case_id);
CREATE INDEX idx_game_clues_objective_id ON game_clues(objective_id);
CREATE INDEX idx_query_logs_user_objective ON query_logs(user_id, objective_id);
CREATE INDEX idx_query_logs_attempted_at ON query_logs(attempted_at DESC);
CREATE INDEX idx_leaderboard_period ON leaderboard(period);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
```

### 6.4 Database Functions (RPC)

**Function: start_case**
```sql
CREATE OR REPLACE FUNCTION start_case(p_user_id UUID, p_case_id INTEGER)
RETURNS UUID AS $$
DECLARE
  v_progress_id UUID;
BEGIN
  INSERT INTO player_progress (user_id, case_id, status)
  VALUES (p_user_id, p_case_id, 'in_progress')
  ON CONFLICT (user_id, case_id) DO UPDATE SET
    status = 'in_progress',
    started_at = CURRENT_TIMESTAMP
  RETURNING id INTO v_progress_id;
  
  RETURN v_progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function: complete_objective**
```sql
CREATE OR REPLACE FUNCTION complete_objective(p_user_id UUID, p_objective_id INTEGER, p_time_taken_seconds INTEGER)
RETURNS UUID AS $$
DECLARE
  v_progress_id UUID;
  v_case_id INTEGER;
BEGIN
  -- Get case_id
  SELECT case_id INTO v_case_id
  FROM game_objectives
  WHERE id = p_objective_id;
  
  -- Update objective progress
  INSERT INTO objective_progress (user_id, objective_id, status, time_taken_seconds, completed_at)
  VALUES (p_user_id, p_objective_id, 'completed', p_time_taken_seconds, CURRENT_TIMESTAMP)
  ON CONFLICT (user_id, objective_id) DO UPDATE SET
    status = 'completed',
    time_taken_seconds = p_time_taken_seconds,
    completed_at = CURRENT_TIMESTAMP;
  
  -- Update player progress score
  UPDATE player_progress
  SET score = score + (SELECT points FROM game_objectives WHERE id = p_objective_id)
  WHERE user_id = p_user_id AND case_id = v_case_id;
  
  -- Get progress_id
  SELECT id INTO v_progress_id
  FROM player_progress
  WHERE user_id = p_user_id AND case_id = v_case_id;
  
  RETURN v_progress_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function: update_leaderboard**
```sql
CREATE OR REPLACE FUNCTION update_leaderboard(p_user_id UUID, p_case_id INTEGER, p_score INTEGER, p_completion_time_seconds INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO leaderboard (user_id, case_id, score, completion_time_seconds, period)
  VALUES (p_user_id, p_case_id, p_score, p_completion_time_seconds, 'all_time')
  ON CONFLICT (user_id, case_id, period) DO UPDATE SET
    score = GREATEST(leaderboard.score, p_score),
    completion_time_seconds = LEAST(leaderboard.completion_time_seconds, p_completion_time_seconds);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## SECTION 7: Migration Plan

### 7.1 Pre-Migration Checklist

**Environment Setup:**
- [ ] Backup current codebase
- [ ] Create new Git branch for migration
- [ ] Document current database state (if any)
- [ ] Prepare rollback plan

**Supabase Setup:**
- [ ] Verify Supabase project is active
- [ ] Confirm SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
- [ ] Test Supabase client connection
- [ ] Enable Row Level Security in Supabase

**Dependencies:**
- [ ] Remove `pg` from package.json
- [ ] Add `express-rate-limit` to package.json
- [ ] Add `joi` or `zod` for validation
- [ ] Add `winston` for logging
- [ ] Run `npm install`

### 7.2 Migration Steps

**Phase 1: Database Setup (Manual - Supabase SQL Editor)**

1. **Run Initial Schema**
   - Open Supabase Dashboard → SQL Editor
   - Execute `database/migrations/001_initial_schema.sql`
   - Verify all tables created

2. **Apply RLS Policies**
   - Execute `database/migrations/002_rls_policies.sql`
   - Verify policies are active

3. **Seed Initial Data**
   - Execute `database/migrations/003_seed_data.sql`
   - Verify sample cases exist

4. **Create Performance Indexes**
   - Execute `database/migrations/004_indexes.sql`
   - Verify indexes created

5. **Create RPC Functions**
   - Execute RPC function definitions
   - Test functions in SQL Editor

**Phase 2: Backend Code Migration**

6. **Remove Direct PostgreSQL Dependencies**
   - Delete `db.js`
   - Delete `init-db.js`
   - Remove `DATABASE_URL` from `.env`
   - Remove `pg` from `package.json`

7. **Enhance Supabase Client**
   - Update `supabaseClient.js` with service role client
   - Test both anon and service role clients

8. **Create Middleware**
   - Create `errorMiddleware.js`
   - Create `rateLimitMiddleware.js`
   - Create `logger.js`
   - Test middleware in isolation

9. **Convert gameEngine.js**
   - Rewrite all functions to use Supabase client
   - Replace `getOne()` with Supabase select
   - Replace `getAll()` with Supabase select
   - Replace `execute()` with Supabase insert/update
   - Replace `transaction()` with RPC functions
   - Test each function individually

10. **Create Service Layer**
    - Create `services/progressManager.js`
    - Create `services/leaderboardManager.js`
    - Create `services/achievementManager.js`
    - Test service functions

11. **Create Route Files**
    - Create `routes/cases.js`
    - Create `routes/progress.js`
    - Create `routes/query.js`
    - Create `routes/leaderboard.js`
    - Create `routes/profile.js`
    - Create `routes/achievements.js`
    - Test each route file

12. **Restructure app.js**
    - Import all route files
    - Apply middleware
    - Remove inline route definitions
    - Test server startup

13. **Enhance queryValidator.js**
    - Implement SQL whitelist
    - Implement keyword blacklist
    - Add query result comparison
    - Test validation logic

**Phase 3: Testing**

14. **Unit Tests**
    - Test gameEngine.js functions
    - Test service layer functions
    - Test validator functions
    - Test utility functions

15. **Integration Tests**
    - Test API endpoints
    - Test database operations
    - Test authentication flow
    - Test error handling

16. **End-to-End Tests**
    - Test complete game flow
    - Test case progression
    - Test query validation
    - Test progress saving

**Phase 4: Data Migration**

17. **Migrate Existing Data (if any)**
    - Export existing data from old database (if accessible)
    - Transform data to new schema
    - Import via Supabase SQL Editor
    - Verify data integrity

18. **Run Data Population Script**
    - Execute `database/init-supabase.js`
    - Verify all cases populated
    - Verify objectives populated
    - Verify clues populated

**Phase 5: Deployment**

19. **Environment Configuration**
    - Update production `.env`
    - Remove `DATABASE_URL`
    - Verify all Supabase credentials

20. **Deploy to Production**
    - Deploy backend code
    - Verify server startup
    - Test API endpoints
    - Monitor error logs

### 7.3 Rollback Plan

**If Migration Fails:**
1. Revert Git branch
2. Restore old backend code
3. Keep Supabase tables (can be dropped later)
4. Restore old `.env` with `DATABASE_URL`
5. Restart old backend

**Rollback Triggers:**
- Critical bugs in new architecture
- Performance degradation
- Data loss or corruption
- Security vulnerabilities

### 7.4 Migration Timeline

**Phase 1: Database Setup** - 2 hours
- Manual execution in Supabase SQL Editor
- Verification of each step

**Phase 2: Backend Code Migration** - 8 hours
- File deletion and dependency cleanup: 1 hour
- Supabase client enhancement: 1 hour
- Middleware creation: 2 hours
- gameEngine.js conversion: 3 hours
- Service layer creation: 2 hours
- Route file creation: 2 hours
- app.js restructuring: 1 hour
- queryValidator.js enhancement: 1 hour

**Phase 3: Testing** - 6 hours
- Unit tests: 2 hours
- Integration tests: 2 hours
- End-to-end tests: 2 hours

**Phase 4: Data Migration** - 2 hours
- Data export/transform/import: 1 hour
- Data population script: 1 hour

**Phase 5: Deployment** - 2 hours
- Environment configuration: 1 hour
- Deployment and verification: 1 hour

**Total Estimated Time: 20 hours**

---

## SECTION 8: Testing Plan

### 8.1 Unit Testing Strategy

**Test Framework: Jest**

**gameEngine.js Tests:**
```javascript
describe('gameEngine', () => {
  describe('getAllCases', () => {
    it('should return all active cases', async () => {
      const cases = await getAllCases();
      expect(cases).toBeInstanceOf(Array);
      expect(cases.every(c => c.is_active === true)).toBe(true);
    });
  });

  describe('getCaseById', () => {
    it('should return case by ID', async () => {
      const caseData = await getCaseById(1);
      expect(caseData).toHaveProperty('id', 1);
    });

    it('should throw error for non-existent case', async () => {
      await expect(getCaseById(999)).rejects.toThrow();
    });
  });

  describe('startCase', () => {
    it('should create new progress entry', async () => {
      const userId = 'test-user-id';
      const caseId = 1;
      const progress = await startCase(userId, caseId);
      expect(progress).toHaveProperty('user_id', userId);
      expect(progress).toHaveProperty('case_id', caseId);
    });
  });
});
```

**queryValidator.js Tests:**
```javascript
describe('queryValidator', () => {
  describe('validateSQL', () => {
    it('should allow valid SELECT queries', () => {
      const result = validateSQL('SELECT * FROM users');
      expect(result.valid).toBe(true);
    });

    it('should block DROP queries', () => {
      const result = validateSQL('DROP TABLE users');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('DROP');
    });

    it('should block DELETE queries', () => {
      const result = validateSQL('DELETE FROM users');
      expect(result.valid).toBe(false);
    });
  });
});
```

### 8.2 Integration Testing Strategy

**API Endpoint Tests:**
```javascript
describe('API Integration Tests', () => {
  describe('GET /api/cases', () => {
    it('should return all cases', async () => {
      const response = await request(app).get('/api/cases');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/cases/:id', () => {
    it('should return single case', async () => {
      const response = await request(app).get('/api/cases/1');
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 404 for non-existent case', async () => {
      const response = await request(app).get('/api/cases/999');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/query/validate', () => {
    it('should validate correct query', async () => {
      const response = await request(app)
        .post('/api/query/validate')
        .send({
          userId: 'test-user-id',
          objectiveId: 1,
          query: 'SELECT * FROM users'
        });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reject dangerous query', async () => {
      const response = await request(app)
        .post('/api/query/validate')
        .send({
          userId: 'test-user-id',
          objectiveId: 1,
          query: 'DROP TABLE users'
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 8.3 End-to-End Testing Strategy

**Complete Game Flow Test:**
```javascript
describe('E2E Game Flow', () => {
  it('should complete full game flow', async () => {
    // 1. User authenticates
    const authResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    const userId = authResponse.body.user.id;

    // 2. Get available cases
    const casesResponse = await request(app).get('/api/cases');
    const caseId = casesResponse.body.data[0].id;

    // 3. Start a case
    const startResponse = await request(app)
      .post(`/api/cases/${caseId}/start`)
      .send({ userId });
    expect(startResponse.body.success).toBe(true);

    // 4. Get objectives
    const objectivesResponse = await request(app)
      .get(`/api/cases/${caseId}/objectives`);
    const objectiveId = objectivesResponse.body.data[0].id;

    // 5. Submit query
    const queryResponse = await request(app)
      .post('/api/query/validate')
      .send({
        userId,
        objectiveId,
        query: 'SELECT * FROM users'
      });
    expect(queryResponse.body.success).toBe(true);

    // 6. Check progress
    const progressResponse = await request(app)
      .get(`/api/progress/${userId}`);
    expect(progressResponse.body.data).toHaveProperty('score');
  });
});
```

### 8.4 Performance Testing

**Load Testing with Artillery:**
```yaml
config:
  target: 'http://localhost:5433'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'Get Cases'
    flow:
      - get:
          url: '/api/cases'
  - name: 'Validate Query'
    flow:
      - post:
          url: '/api/query/validate'
          json:
            userId: 'test-user-id'
            objectiveId: 1
            query: 'SELECT * FROM users'
```

**Performance Targets:**
- API response time < 200ms (p95)
- Database query time < 100ms (p95)
- Support 100 concurrent users
- 99.9% uptime

### 8.5 Security Testing

**SQL Injection Tests:**
```javascript
describe('Security Tests', () => {
  it('should block SQL injection attempts', async () => {
    const maliciousQueries = [
      "SELECT * FROM users; DROP TABLE users; --",
      "SELECT * FROM users WHERE 1=1; UPDATE users SET password='hacked';",
      "' OR '1'='1",
      "'; EXEC xp_cmdshell('dir'); --"
    ];

    for (const query of maliciousQueries) {
      const response = await request(app)
        .post('/api/query/validate')
        .send({
          userId: 'test-user-id',
          objectiveId: 1,
          query
        });
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    }
  });
});
```

**RLS Policy Tests:**
```javascript
describe('RLS Policy Tests', () => {
  it('should prevent user from accessing other users data', async () => {
    const user1Id = 'user-1-id';
    const user2Id = 'user-2-id';

    // User 1 tries to access User 2's progress
    const response = await request(app)
      .get(`/api/progress/${user2Id}`)
      .set('Authorization', `Bearer ${user1Id}`);
    
    expect(response.status).toBe(403);
  });
});
```

### 8.6 Test Coverage Goals

**Minimum Coverage:**
- Unit tests: 80% code coverage
- Integration tests: All API endpoints
- E2E tests: Critical user flows
- Security tests: All input validation points

**Tools:**
- Jest for unit/integration tests
- Supertest for API testing
- Artillery for load testing
- Jest Coverage for coverage reports

---

## SECTION 9: Production Deployment Plan

### 9.1 Deployment Architecture

**Recommended Stack:**
- **Backend**: Express.js on Vercel or Railway
- **Database**: Supabase (already hosted)
- **CDN**: Vercel Edge Network or Cloudflare
- **Monitoring**: Sentry for error tracking
- **Logging**: Logtail or Datadog
- **Analytics**: Google Analytics or Plausible

### 9.2 Environment Configuration

**Production .env:**
```env
SUPABASE_URL=https://xxqrkcqplbdhutrxceqe.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
PORT=5433
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Development .env:**
```env
SUPABASE_URL=https://xxqrkcqplbdhutrxceqe.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
PORT=5433
NODE_ENV=development
LOG_LEVEL=debug
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### 9.3 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 9.4 Monitoring and Alerting

**Error Tracking (Sentry):**
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Performance Monitoring:**
- Track API response times
- Monitor database query performance
- Track error rates
- Monitor user engagement metrics

**Alerting Rules:**
- Error rate > 1% for 5 minutes
- API response time > 1s (p95) for 5 minutes
- Database connection failures
- Rate limit violations > 10% of requests

### 9.5 Scaling Strategy

**Horizontal Scaling:**
- Deploy backend on multiple instances
- Use load balancer (Vercel handles automatically)
- Stateless design enables easy scaling

**Vertical Scaling:**
- Supabase Pro tier for higher database limits
- Edge Functions for compute-intensive operations
- CDN for static assets

**Database Scaling:**
- Supabase handles connection pooling
- Read replicas for read-heavy workloads
- Partitioning for large tables (future)

### 9.6 Backup and Disaster Recovery

**Database Backups:**
- Supabase automatic daily backups
- Point-in-time recovery (7 days)
- Export backup weekly to external storage

**Code Backups:**
- Git repository (GitHub)
- Multiple environments (dev, staging, prod)
- Rollback capability via Git

**Disaster Recovery Plan:**
1. Identify the issue
2. Rollback to previous stable version
3. Restore database from backup if needed
4. Investigate root cause
5. Implement fix
6. Test thoroughly
7. Deploy fix
8. Monitor closely

### 9.7 Security Hardening

**Production Security Checklist:**
- [ ] Enable HTTPS only
- [ ] Configure CORS for production domain only
- [ ] Enable rate limiting
- [ ] Implement request size limits
- [ ] Enable security headers (Helmet.js)
- [ ] Disable debug mode
- [ ] Rotate secrets regularly
- [ ] Enable audit logging
- [ ] Implement IP whitelisting for admin routes
- [ ] Regular security audits

**Security Headers:**
```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 9.8 Launch Checklist

**Pre-Launch:**
- [ ] All tests passing
- [ ] Code review completed
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Alerting configured
- [ ] Backup plan tested
- [ ] Rollback plan tested

**Launch Day:**
- [ ] Deploy to production
- [ ] Verify all endpoints working
- [ ] Test authentication flow
- [ ] Test complete game flow
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Be ready to rollback if needed

**Post-Launch:**
- [ ] Monitor closely for 24 hours
- [ ] Collect user feedback
- [ ] Fix critical bugs immediately
- [ ] Plan next iteration
- [ ] Document lessons learned

### 9.9 Future Roadmap

**Phase 2 (3 months):**
- Real-time multiplayer leaderboard
- Achievement system
- Daily challenges
- Player profiles with avatars

**Phase 3 (6 months):**
- Mobile app (React Native)
- Social features (friends, chat)
- Custom case creator
- Case marketplace

**Phase 4 (12 months):**
- AI-powered hint system
- Procedurally generated cases
- Tournament mode
- Subscription model

---

## CONCLUSION

This migration plan provides a comprehensive roadmap for transforming your SQL Detective Game from a mixed PostgreSQL/Supabase architecture to a pure Supabase-only architecture. The new architecture addresses all current issues:

**Key Benefits:**
1. **Eliminates DNS issues** - No direct PostgreSQL connection required
2. **Unified database access** - Single pattern across entire codebase
3. **Enhanced security** - RLS policies, SQL validation, rate limiting
4. **Improved scalability** - Supabase handles scaling automatically
5. **Better developer experience** - Consistent APIs, centralized error handling
6. **Production-ready** - Monitoring, logging, testing, deployment strategies

**Next Steps:**
1. Review this migration plan
2. Approve the architecture
3. Begin Phase 1 (Database Setup)
4. Execute migration steps sequentially
5. Test thoroughly at each phase
6. Deploy to production

The estimated timeline is 20 hours for complete migration, but this can be done in phases to minimize disruption. The architecture is designed to be future-proof, supporting 1000+ users, multiplayer features, and continuous expansion of game content.

**Success Metrics:**
- All API endpoints functional
- Game flow working end-to-end
- No DNS errors
- Response time < 200ms (p95)
- 99.9% uptime
- Positive user feedback

Good luck with the migration! 🕵️‍♂️

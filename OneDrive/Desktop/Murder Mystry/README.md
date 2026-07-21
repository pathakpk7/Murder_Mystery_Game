# 🔍 SQL Murder Mystery Game

A professional SQL learning game where you solve mysteries by writing SQL queries. Learn SQL through an engaging detective experience with a modern, professional interface.

## 🎮 Quick Start (5 Minutes)

### Option 1: Play Immediately (No Setup Required)

1. Open `frontend/login-simple.html` in your browser
2. Enter any username/email and password
3. Click Login
4. Navigate to `frontend/game-pro.html` to play

That's it! No database, no backend, no configuration needed. The game uses localStorage for progression.

### Option 2: Full Game Engine (Requires Setup)

For the complete game engine with database persistence and backend integration:

#### Step 1: Start Backend (30 seconds)

```bash
cd backend
npm start
```

Or double-click `START_BACKEND.bat` (Windows)

The backend should show:
```
✓ Backend server started successfully!
✓ Server listening on http://localhost:5433
✓ PostgreSQL connection successful
```

#### Step 2: Play (1 minute)

1. Open `frontend/login-simple.html` in browser
2. Login with any credentials
3. Navigate to `frontend/game-pro.html`
4. Select a case and start playing!

---

## 📋 Project Overview

### Features

- **Professional Dashboard UI** - Modern dark theme with glassmorphism effects
- **CodeMirror SQL Editor** - Syntax highlighting with Dracula theme
- **Mission-Based Gameplay** - Complete objectives to unlock clues
- **Progress Tracking** - Visual progress bars and statistics
- **Hint System** - Request hints with point penalties
- **Responsive Design** - Works on different screen sizes
- **Backend Integration** - Full API connectivity for data persistence

### Game Flow

1. **Login** → Enter credentials (localStorage-based)
2. **Select Case** → Choose from available mystery cases
3. **Start Investigation** → Begin the case
4. **Complete Objectives** → Write SQL queries to solve objectives
5. **Unlock Clues** → Progress through the case
6. **Solve Mystery** → Identify the culprit

---

## 🔧 Full Setup Guide

### Backend Configuration

The backend connects to Supabase PostgreSQL for data persistence.

#### 1. Configure Database Connection

Open `backend/.env` and update:

```env
# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:Murder_Mystry@db.xxqrkcqplbdhutrxceqe.supabase.co:5432/postgres

# JWT Secret
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cXJrY3FwbGJkaHV0cnhjZXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDA1OTksImV4cCI6MjA5NTExNjU5OX0.tmozdGgw10AOwXju35lqQYpBf22cX-FdFZTiZTeP-gI

# Server Configuration
PORT=5433
```

#### 2. Start Backend Server

```bash
cd backend
npm install
npm start
```

The backend should start successfully and show:
```
✓ Backend server started successfully!
✓ Server listening on http://localhost:5433
✓ API available at http://localhost:5433/api
✓ Health check: http://localhost:5433/api/health
✓ PostgreSQL connection successful
```

### Frontend Files

The frontend consists of these essential files:

- `index.html` - Landing page with case selection and progression tracking
- `login-simple.html` - Login page (localStorage-based authentication)
- `game-pro.html` - Professional game interface with CodeMirror editor
- `landing-page.css` - Styles for landing page
- `landing-page.js` - Logic for landing page and progression system

### Database Schema

The game uses a comprehensive database schema with:

- `game_cases` - Game scenarios/mysteries
- `game_objectives` - Missions within a case
- `game_progress` - User progress through cases
- `objective_progress` - Completion of individual objectives
- `game_clues` - Unlockable game content
- `user_clues` - Tracks unlocked clues per user
- `hint_requests` - Tracks hint usage
- `query_attempts` - Logs all user queries

The database comes pre-populated with sample data including:
- 1 complete case: "The Blackwood Manor Mystery"
- 8 objectives for the case
- 9 clues for the case
- All necessary witness, suspect, and forensic data

---

## 🎯 Game Engine Details

### Mission-Based Objectives

Each case consists of multiple objectives that must be completed in order:

1. Identify witnesses with unverified alibis
2. Investigate unverified persons
3. Align timeline with witness claims
4. Narrow suspects using high suspicion
5. Name the main culprit

### Query Validation

The system validates SQL queries by:
1. Executing the user's query
2. Comparing results with expected output
3. Checking for correct data and structure
4. Providing immediate feedback

### Clue Unlock System

- Clues unlock automatically when objectives are completed
- Each objective unlocks specific clues
- Clues are displayed in the right panel with type indicators
- Evidence and information clues have different styling

### Hint System

- Players can request hints for current objectives
- Each hint costs 10 points
- Hints provide guidance without giving away the answer
- Hint usage is tracked for analytics

---

## 🚀 API Endpoints

The backend provides these endpoints:

- `GET /api/health` - Health check
- `GET /api/game/cases` - Get available cases
- `POST /api/game/cases/:id/start` - Start a case
- `GET /api/game/cases/:id/current-objective` - Get current objective
- `GET /api/game/cases/:id/user-clues` - Get unlocked clues
- `GET /api/game/cases/:id/objective-progress` - Get progress
- `POST /api/game/execute-query` - Execute SQL query
- `POST /api/game/objectives/:id/request-hint` - Request hint

---

## 📁 File Structure

```
murder-mystery-game/
├── backend/
│   ├── app.js              # Express server and API endpoints
│   ├── db.js               # Database connection and queries
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/
│   ├── index.html          # Landing page with case selection
│   ├── login-simple.html   # Login page (localStorage auth)
│   ├── game-pro.html       # Professional game interface
│   ├── landing-page.css    # Landing page styles
│   └── landing-page.js     # Landing page logic
├── database/
│   ├── game_engine_schema.sql  # Complete database schema
│   └── game_data.sql           # Sample game data
└── README.md               # This file
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Problem:** Port already in use
- **Solution:** Change PORT in `backend/.env` to a different port (e.g., 5434)
- **Solution:** Kill process using the port: `taskkill /F /PID [PID]`

### No Cases Loading

**Problem:** Database schema not applied
- **Solution:** Run `database/game_engine_schema.sql` in Supabase SQL Editor
- **Solution:** Verify backend is running and accessible

### Login Not Working

**Problem:** Authentication issues
- **Solution:** System uses localStorage - no Supabase auth needed
- **Solution:** Check browser console for errors (F12)
- **Solution:** Clear browser cache and localStorage

### Backend Connection Failed

**Problem:** Frontend can't connect to backend
- **Solution:** Ensure backend is running on port 5433
- **Solution:** Check API_BASE in frontend files matches backend port
- **Solution:** Verify DATABASE_URL in backend/.env is correct

### CORS Errors

**Problem:** Browser shows CORS errors
- **Solution:** Backend has CORS enabled - check specific error in console
- **Solution:** Verify backend is accessible from frontend origin

---

## 🎮 How to Play

### Starting the Game

1. **Login** - Open `frontend/login-simple.html` and enter any credentials
2. **Landing Page** - View available cases and your progress
3. **Select Case** - Click on a case to start investigation
4. **Game Interface** - Professional dashboard with SQL editor

### Playing a Case

1. **Read Objective** - Current objective displayed in left panel
2. **Write Query** - Use SQL editor in center panel
3. **Execute** - Click "Execute Query" or press Ctrl+Enter
4. **View Results** - Results appear in bottom panel
5. **Get Feedback** - System validates query and provides feedback
6. **Unlock Clues** - Complete objectives to unlock clues
7. **Request Hints** - Click hint button if stuck (costs points)
8. **Solve Case** - Complete all objectives to solve the mystery

### Progress Tracking

- Progress bar shows completion percentage
- Clues panel displays unlocked clues
- Stats panel shows cases solved and total progress
- All progress saved to localStorage

---

## 🔍 Testing the System

### Test Backend Health

```bash
curl http://localhost:5433/api/health
```

Expected: `{"status":"ok"}`

### Test Cases API

```bash
curl http://localhost:5433/api/game/cases
```

Expected: `{"cases": [...]}`

### Test Frontend

1. Open `frontend/login-simple.html`
2. Login with any credentials
3. Navigate to `frontend/game-pro.html`
4. Check browser console (F12) for errors
5. Should see cases loading successfully

---

## ✅ Success Indicators

- Backend running on port 5433
- `/api/health` returns ok
- `/api/game/cases` returns cases
- Frontend loads without errors
- Cases display in game-pro.html
- Can start and play cases
- Progress tracking works
- Clues unlock on objective completion

---

## 🎨 Design Features

### Dark Theme
- Background: Deep blue gradient (#1a1a2e → #16213e)
- Accent color: #e94560 (red-pink)
- Glassmorphism: Semi-transparent panels with backdrop blur
- Smooth animations and transitions

### Responsive Design
- Works on desktop and tablet
- Adapts to different screen sizes
- Mobile-friendly interface

### User Experience
- Clear visual feedback
- Intuitive navigation
- Professional game feel
- Engaging animations

---

## 📞 Support

For detailed troubleshooting, see the individual setup guides:
- Backend configuration issues
- Authentication problems
- Database setup
- Frontend issues

---

## 🚀 Ready to Play?

Open `frontend/login-simple.html` now and start solving mysteries! 🎮

---

**Current Configuration:**
- **Backend Port:** 5433
- **Authentication:** localStorage-based
- **Database:** Supabase PostgreSQL
- **SQL Editor:** CodeMirror with Dracula theme
- **Frontend:** Professional dashboard interface

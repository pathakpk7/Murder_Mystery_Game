# Murder Mystery Detective Game

This project contains a static frontend and a Node.js + Express backend with a SQLite database. The backend seeds the game data automatically from an SQL file.

- Frontend: `murder-mystery-game/frontend/`
- Backend: `murder-mystery-game/backend/`
- Database files: `murder-mystery-game/database/` (`game.db` will be created, `game_data.sql` seeds schema/data)
- SQL progression queries moved to: `queries/queries.txt`

## Prerequisites
- Node.js 18+ and npm (https://nodejs.org)
- No external DB server required (uses SQLite file DB)

## Backend Setup (API)
Location: `murder-mystery-game/backend/`

1. Install dependencies
   - Windows PowerShell (run in project root, set cwd to backend):
     - `npm install`
2. Run the server
   - `npm run start`
3. Default URL
   - `http://localhost:5050`
4. Health check
   - `GET http://localhost:5050/api/health` -> `{ "status": "ok" }`

Notes:
- On first start, the backend creates `murder-mystery-game/database/game.db` and executes `murder-mystery-game/database/game_data.sql`.
- If `sqlite3` install fails on Windows, install build tools and retry:
  - `npm config set msvs_version 2022 --global`
  - Install "Desktop development with C++" via Visual Studio Build Tools.

## Frontend Setup (Static)
Location: `murder-mystery-game/frontend/`

- Open `index.html` in a browser (double-click or serve with any static server).
- The current UI operates fully offline with a mocked data layer.
- To integrate with the backend, add small helper functions in `script.js` to call API endpoints (e.g., `/api/case/1`, `/api/case/1/clues`, `/api/case/1/story/1`).

## Database
- File path: `murder-mystery-game/database/game.db`
- Seed SQL: `murder-mystery-game/database/game_data.sql`
- The backend exposes endpoints to read game data (e.g., `/api/witnesses`, `/api/suspects`, `/api/forensics`, `/api/timeline`).

## Common Issues
- "Backend unavailable" in the UI can occur if:
  - The backend server is not running at `http://localhost:5050`.
  - Or the frontend helper functions for API calls are missing. Implement them in `frontend/script.js` to use `fetch` and fall back to mocks on failure.

## Useful Endpoints
- `GET /api/health`
- `GET /api/levels/:levelId`
- `GET /api/witnesses`
- `GET /api/suspects`
- `GET /api/forensics`
- `GET /api/timeline`
- `POST /api/accuse`
- `GET /api/case/:id`
- `GET /api/case/:id/clues`
- `GET /api/case/:id/story/:stage`
- `POST /api/case/:id/accuse`

## Project Scripts (from backend)
- `npm run start` — Start the API server on port 5050
- `npm run dev` — Same as start (you can swap to nodemon if desired)

## SQL Progression Guide
- The previous SQL guide was moved to `queries/queries.txt`.
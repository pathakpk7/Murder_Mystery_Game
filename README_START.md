# Murder Mystery Game - Quick Start Guide

## Starting the Backend Server

The backend server MUST be running before you can use the game.

### Option 1: Using the Batch File (Windows)
1. Double-click `START_BACKEND.bat` in the project root
2. Wait for the server to start (you'll see "Backend server started successfully!")
3. Keep the window open while playing the game

### Option 2: Using Command Line
1. Open a terminal/command prompt
2. Navigate to the backend directory:
   ```
   cd murder-mystery-game/backend
   ```
3. Start the server:
   ```
   npm start
   ```
4. You should see:
   ```
   ✓ Database initialized successfully
   ✓ Backend server started successfully!
   ✓ Server listening on http://localhost:5050
   ```

### Option 3: Using PowerShell
```powershell
Set-Location "murder-mystery-game\backend"
node app.js
```

## Starting the Frontend

1. Open `murder-mystery-game/frontend/index.html` in your web browser
2. Or use a local server:
   - Using Python: `python -m http.server 8000` (from frontend directory)
   - Using Node.js: `npx http-server` (from frontend directory)
   - Then visit: `http://localhost:8000`

## Troubleshooting

### "Request timeout - Backend server may be down"
- Make sure the backend server is running (see above)
- Check that port 5050 is not being used by another application
- Verify the backend shows "Server listening on http://localhost:5050"

### "Database initialization error"
- The database will be created automatically
- If you see this error, check that the `database` folder exists
- Delete `database/game.db` and restart the server to reinitialize

### Connection Issues
- Make sure both frontend and backend are running
- Frontend connects to: `http://localhost:5050`
- Backend must be accessible on port 5050

## Game Flow

1. Start the backend server (required!)
2. Open the frontend in your browser
3. Login with any username and password
4. Start investigating the mystery!

## API Endpoints

The backend provides these endpoints:
- `GET /api/health` - Health check
- `POST /api/players` - Create player profile
- `GET /api/player/:playerId/game-state` - Get game state
- `POST /api/player/:playerId/game-state` - Save game state
- `GET /api/case/:id/clues` - Get case clues
- And more...


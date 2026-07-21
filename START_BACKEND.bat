@echo off
echo Starting Murder Mystery Backend Server...
echo.
cd murder-mystery-game\backend
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo.
echo Starting server on http://localhost:5050
echo Press Ctrl+C to stop the server
echo.
node app.js
pause


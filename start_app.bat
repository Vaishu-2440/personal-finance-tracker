@echo off
echo Starting Personal Finance Tracker...
echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && python app.py"
echo Backend started on http://localhost:5000
echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm install && npm start"
echo Frontend will start on http://localhost:3000
echo.
echo Both servers are starting...
echo Please wait a moment for the frontend to install dependencies.
echo.
pause 
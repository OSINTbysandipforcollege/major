@echo off
echo Starting ResQ Development Environment...
echo.

echo Starting Backend Server...
start "ResQ Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "ResQ Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo.
echo Both servers are starting in separate windows...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul


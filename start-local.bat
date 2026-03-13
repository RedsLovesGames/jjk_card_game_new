@echo off
setlocal

cd /d "%~dp0"

echo ============================================
echo JJK Card Game - Local Launcher
echo ============================================

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is not installed or not in PATH.
  echo Install Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo [INFO] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] Dependency install failed.
    pause
    exit /b 1
  )
)

echo [INFO] Opening browser at http://localhost:8080 ...
start "" cmd /c "timeout /t 3 /nobreak >nul && start \"\" http://localhost:8080"

echo [INFO] Starting development server...
call npm run dev

endlocal

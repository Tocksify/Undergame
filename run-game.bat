@echo off
title Echo Realm
cd /d "%~dp0"

echo ============================================
echo  ECHO REALM — Test Launcher
echo ============================================
echo.

:: Check for pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo pnpm not found. Installing via npm...
  call npm install -g pnpm
  if %ERRORLEVEL% neq 0 ( echo Failed to install pnpm. & pause & exit /b 1 )
)

:: Install workspace dependencies
echo [1/3] Installing dependencies...
call pnpm install
if %ERRORLEVEL% neq 0 ( echo Dependency install failed. & pause & exit /b 1 )

:: Build the Vite web assets
echo.
echo [2/3] Building game assets...
set PORT=3000
set BASE_PATH=/
call pnpm --filter @workspace/echo-realm run build
if %ERRORLEVEL% neq 0 ( echo Build failed — check errors above. & pause & exit /b 1 )

:: Launch Electron
echo.
echo [3/3] Launching Echo Realm...
echo   Saves will be stored in: %~dp0artifacts\echo-realm\saves\
echo.
call pnpm --filter @workspace/echo-realm run electron

pause

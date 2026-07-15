@echo off
title Echo Realm — Build Installer
cd /d "%~dp0"

echo ============================================
echo  ECHO REALM — Build Windows Installer
echo ============================================
echo.
echo This will create an NSIS installer (.exe) and a portable .exe
echo Output: artifacts\echo-realm\release\
echo.

:: Check for pnpm
where pnpm >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo pnpm not found. Installing...
  call npm install -g pnpm
  if %ERRORLEVEL% neq 0 ( echo Failed to install pnpm. & pause & exit /b 1 )
)

:: Install all workspace deps (including electron + electron-builder)
echo [1/3] Installing dependencies...
call pnpm install
if %ERRORLEVEL% neq 0 ( echo Dependency install failed. & pause & exit /b 1 )

:: Build Vite assets
echo.
echo [2/3] Building game assets...
set PORT=3000
set BASE_PATH=/
call pnpm --filter @workspace/echo-realm run build
if %ERRORLEVEL% neq 0 ( echo Build failed. & pause & exit /b 1 )

:: Package with electron-builder
echo.
echo [3/3] Packaging...
cd artifacts\echo-realm
call npx electron-builder --config electron-builder.json --win
if %ERRORLEVEL% neq 0 ( echo Packaging failed — check errors above. & cd /d "%~dp0" & pause & exit /b 1 )
cd /d "%~dp0"

echo.
echo ============================================
echo  BUILD COMPLETE
echo  Installer : artifacts\echo-realm\release\Echo Realm Setup*.exe
echo  Portable  : artifacts\echo-realm\release\EchoRealm-portable.exe
echo ============================================
echo.
echo Saves are stored next to the .exe in a "saves" folder.
echo.
pause

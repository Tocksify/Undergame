@echo off
setlocal enabledelayedexpansion
title Echo Realm — Desktop Build

echo ============================================================
echo  Echo Realm  ^|  Windows Desktop Build
echo ============================================================
echo.

:: ── Locate the repo root (one level above this script) ──────────────
set "REPO=%~dp0.."
set "GAME=%REPO%\artifacts\echo-realm"

:: ── Verify Node.js is available ────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js was not found.
    echo         Download it from https://nodejs.org and re-run this script.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo [OK] Node.js %NODE_VER% found.
echo.

:: ── Install workspace dependencies ─────────────────────────────────
echo [1/3] Installing dependencies...
cd /d "%REPO%"
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
)
echo.

:: ── Build the Vite app (desktop config) ────────────────────────────
echo [2/3] Building game assets...
cd /d "%GAME%"
call npx vite build --config vite.desktop.config.ts
if errorlevel 1 (
    echo [ERROR] Vite build failed.
    pause
    exit /b 1
)
echo.

:: ── Package with electron-builder ──────────────────────────────────
echo [3/3] Packaging Windows installer (this may take a minute)...
call npx electron-builder --config electron-builder.json --win
if errorlevel 1 (
    echo [ERROR] electron-builder failed.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  Build complete!
echo  Your files are in:
echo    %GAME%\release\
echo ============================================================
echo.
explorer "%GAME%\release"
pause

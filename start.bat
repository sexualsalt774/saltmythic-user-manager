@echo off
setlocal enabledelayedexpansion

REM Change to the script directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Check if .env exists, if not, create it and ask for input
if not exist ".env" (
    echo .env file not found. Creating it now...

    REM Ask for PORT
    set /p "PORT=Enter the PORT (default 3000): "
    if "!PORT!"=="" set "PORT=3000"

    REM Ask for MONGODB_URI
    set /p "MONGODB_URI=Enter the MONGODB_URI (default mongodb://localhost:27017/): "
    if "!MONGODB_URI!"=="" set "MONGODB_URI=mongodb://localhost:27017/"

    REM Ask for DB_NAME
    set /p "DB_NAME=Enter the DB_NAME (default 'auth'): "
    if "!DB_NAME!"=="" set "DB_NAME=auth"

    REM Write to .env
    echo PORT=!PORT! > .env
    echo MONGODB_URI=!MONGODB_URI! >> .env
    echo DB_NAME=!DB_NAME! >> .env

    echo .env file created with provided values.
)
REM Load PORT from .env
set "PORT=3000"
for /f "usebackq tokens=1,2 delims==" %%a in (".env") do (
    if "%%a"=="PORT" set "PORT=%%b"
)

REM Start server.js in a new terminal
echo Starting server on port %PORT%...
start "" cmd /k "node server.js"

REM Wait a bit to let server start
timeout /t 2 >nul

REM Open browser
start http://localhost:%PORT%

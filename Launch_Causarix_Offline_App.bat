@echo off
title Causarix AI - Sovereign Desktop Launcher
color 0B
cls

echo ===============================================================================
echo   CAUSARIX AI - SOVEREIGN OFFLINE DESKTOP LAUNCHER
echo ===============================================================================
echo.

:: 1. Clean up any stale electron instances
taskkill /F /IM electron.exe >nul 2>&1

:: 2. Ensure Ollama is running
echo [1/3] Initializing Ollama on D:\OllamaModels...
start "" /B "C:\Users\Shourya\AppData\Local\Programs\Ollama\ollama.exe" serve >nul 2>&1

:: 3. Launch Local Next.js Engine
echo [2/3] Initializing Local Next.js Server on port 3000...
cd /d D:\Synaps
start "Causarix Local Server" /MIN cmd /c "cd /d D:\Synaps && npm run dev"

:: 4. Launch Native Standalone App
echo [3/3] Launching Native Causarix Desktop Application...
ping -n 3 127.0.0.1 >nul

start "" "D:\Synaps\node_modules\electron\dist\electron.exe" "D:\Synaps\electron\main.js"

echo [SUCCESS] Causarix AI Native Desktop Application is running!
exit
